import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/Addons.js";

import Boid from "./utils/Boid";

import vertexShader from "./shaders/fish/vertex.glsl";
import fragmentShader from "./shaders/fish/fragment.glsl";
import { useControls } from "leva";

const objPaths = [];
const texturePaths = [];
for (let i = 1; i <= 15; i++) {
	const number = i.toString().padStart(2, "0");
	objPaths.push(`./TropicalFish_obj/TropicalFish${number}.obj`);
	texturePaths.push(`./TropicalFish_obj/TropicalFish${number}.jpg`);
}

export default function Fish() {
	const groupCount = 15;
	const count = 10;
	const groupRef = useRef();

	const objs = useLoader(OBJLoader, objPaths);
	const textures = useLoader(THREE.TextureLoader, texturePaths);

	const boids = useMemo(() => {
		const boids = [];
		let boidArr;

		for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
			boidArr = [];
			for (let i = 0; i < count; i++) {
				const boid = new Boid();
				boid.position.set(
					(Math.random() - 0.5) * 100 + (groupIndex - 7.5) * 20,
					(Math.random() - 0.5) * 100 + (groupIndex - 7.5) * 20,
					(Math.random() - 0.5) * 100 + (groupIndex - 7.5) * 20
				);
				boid.velocity.set(
					(Math.random() - 0.5) * 2,
					(Math.random() - 0.5) * 2,
					(Math.random() - 0.5) * 2
				);
				boid.setAvoidWalls(true);
				boid.setWorldSize(500, 400, 500);

				boidArr.push(boid);
			}
			boids.push(boidArr);
		}

		return boids;
	}, []);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uSpeed: { value: 3 },
		}),
		[]
	);

	const { neighborhoodRadius, maxSpeed, maxSteerForce } = useControls("Fish", {
		neighborhoodRadius: { value: 250, min: 0, max: 500 },
		maxSpeed: { value: 1, min: 0, max: 10 },
		maxSteerForce: { value: 0.04, min: 0, max: 1 },
	});

	useEffect(() => {
		boids.forEach((groupBoids) => {
			groupBoids.forEach((boid) => {
				boid._neighborhoodRadius = neighborhoodRadius;
				boid._maxSpeed = maxSpeed;
				boid._maxSteerForce = maxSteerForce;
			});
		});
	}, [neighborhoodRadius, maxSpeed, maxSteerForce]);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove, false);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove, false);
		};
	}, []);

	useFrame(({ clock }, delta) => {
		if (groupRef.current) {
			groupRef.current.children.forEach((group, groupIndex) => {
				group.children.forEach((fish, i) => {
					const groupBoids = boids[groupIndex];
					const otherBoids = boids.filter((_, i) => i !== groupIndex).flat();

					const boid = groupBoids[i];

					const effectiveDelta = Math.min(0.1, delta) / 0.008;
					boid.run(groupBoids, otherBoids, effectiveDelta);

					uniforms.uTime.value = clock.elapsedTime;

					fish.position.copy(boid.position);

					const target = new THREE.Vector3(
						fish.position.x + boid.velocity.x,
						fish.position.y + boid.velocity.y,
						fish.position.z + boid.velocity.z
					);
					fish.lookAt(target);
				});
			});
		}
	});

	const { camera, size } = useThree();
	const raycaster = useRef(new THREE.Raycaster());
	const handleMouseMove = (event) => {
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		let boid;
		let boidsGroup;
		for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
			boidsGroup = boids[groupIndex];
			for (var i = 0; i < boidsGroup.length; i++) {
				boid = boidsGroup[i];

				const planeZ = new THREE.Plane(
					new THREE.Vector3(0, 0, 1),
					-boid.position.z
				);
				const clickPosition = new THREE.Vector3();
				raycaster.ray.intersectPlane(planeZ, clickPosition);

				boid.repulse(clickPosition);
			}
		}
	};

	return (
		<>
			<group ref={groupRef}>
				{[...Array(groupCount)].map((_, groupIndex) => (
					<group key={groupIndex}>
						{[...Array(count)].map((_, i) => (
							<mesh
								key={i}
								geometry={objs[groupIndex].children[0].geometry}
								scale={0.1}
							>
								<shaderMaterial
									vertexShader={vertexShader}
									fragmentShader={fragmentShader}
									uniforms={{
										...uniforms,
										uShift: { value: i },
										uTexture: { value: textures[groupIndex] },
									}}
								/>
							</mesh>
						))}
					</group>
				))}
			</group>
		</>
	);
}
