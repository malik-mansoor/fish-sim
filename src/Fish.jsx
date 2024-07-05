import { useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders/fish/vertex.glsl";
import fragmentShader from "./shaders/fish/fragment.glsl";
import { useControls } from "leva";
import Boid from "./utils/Boid";

const objPaths = [];
const texturePaths = [];
for (let i = 1; i <= 15; i++) {
	const number = i.toString().padStart(2, "0");
	objPaths.push(`./TropicalFish_obj/TropicalFish${number}.obj`);
	texturePaths.push(`./TropicalFish_obj/TropicalFish${number}.jpg`);
}

export default function Fish() {
	const groupCount = 15;
	const count = 8;
	const groupRef = useRef();

	const objs = useLoader(OBJLoader, objPaths);
	const textures = useLoader(THREE.TextureLoader, texturePaths);

	const fish = useRef([]);
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
		neighborhoodRadius: {
			value: 250,
			min: 0,
			max: 500,
			label: "Neighborhood Radius",
		},
		maxSpeed: { value: 1.1, min: 0, max: 10, label: "Max Speed" },
		maxSteerForce: { value: 0.04, min: 0, max: 1, label: "Max Steer Force" },
	});

	useEffect(() => {
		boids.forEach((groupBoids) => {
			groupBoids.forEach((boid) => {
				boid._neighborhoodRadius = neighborhoodRadius;
				boid._maxSpeed = maxSpeed;
				boid._maxSteerForce = maxSteerForce;
			});
		});
		uniforms.uSpeed.value = maxSpeed * 3;
	}, [neighborhoodRadius, maxSpeed, maxSteerForce]);

	useEffect(() => {
		boids.forEach((group, groupIndex) => {
			group.forEach((boid, i) => {
				const matrix = new THREE.Matrix4();

				const randomScale = (Math.random() - 0.5) * 0.02 + 0.08;

				matrix.compose(
					new THREE.Vector3(boid.position.x, boid.position.y, boid.position.z),
					new THREE.Quaternion(),
					new THREE.Vector3(randomScale, randomScale, randomScale)
				);

				fish.current[groupIndex].setMatrixAt(i, matrix);
			});
		});

		window.addEventListener("mousemove", handleMouseMove, false);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove, false);
		};
	}, []);

	useFrame(({ clock }, delta) => {
		const effectiveDelta = Math.min(0.1, delta) / 0.008;

		boids.forEach((group, groupIndex) => {
			group.forEach((boid, i) => {
				const groupBoids = group;
				const otherBoids = boids.filter((_, i) => i !== groupIndex).flat();

				boid.run(groupBoids, otherBoids, effectiveDelta);

				uniforms.uTime.value = clock.elapsedTime;

				let matrix = new THREE.Matrix4();
				fish.current[groupIndex].getMatrixAt(i, matrix);
				let position = new THREE.Vector3();
				let quaternion = new THREE.Quaternion();
				let scale = new THREE.Vector3();

				matrix.decompose(position, quaternion, scale);

				position.set(boid.position.x, boid.position.y, boid.position.z);

				const target = new THREE.Vector3(
					boid.position.x - boid.velocity.x,
					boid.position.y - boid.velocity.y,
					boid.position.z - boid.velocity.z
				);

				// Compute direction from boid position to target
				let direction = new THREE.Vector3();
				direction.subVectors(target, boid.position).normalize();

				// Create a rotation matrix to orient the object towards the target
				let matrixx = new THREE.Matrix4();
				matrixx.lookAt(boid.position, target, new THREE.Vector3(0, 1, 0)); // Assuming up direction is positive y-axis

				// Extract the rotation component from the matrix as a quaternion
				quaternion.setFromRotationMatrix(matrixx);

				matrix.compose(position, quaternion, scale);
				fish.current[groupIndex].setMatrixAt(i, matrix);
			});
			fish.current[groupIndex].instanceMatrix.needsUpdate = true;
		});
	});

	const { camera } = useThree();
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
				{[...Array(groupCount)].map((_, i) => (
					<instancedMesh
						ref={(el) => (fish.current[i] = el)}
						args={[null, null, count]}
						geometry={objs[i].children[0].geometry}
						key={i}
					>
						<shaderMaterial
							vertexShader={vertexShader}
							fragmentShader={fragmentShader}
							uniforms={{
								...uniforms,
								uShift: { value: i },
								uTexture: { value: textures[i] },
							}}
						/>
					</instancedMesh>
				))}
			</group>
		</>
	);
}
