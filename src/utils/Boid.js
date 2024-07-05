import * as THREE from "three";

class Boid {
	constructor() {
		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this._acceleration = new THREE.Vector3();
		this._width = 500;
		this._height = 500;
		this._depth = 200;
		this._neighborhoodRadius = 250;
		this._maxSpeed = 1.1;
		this._maxSteerForce = 0.04;
		this._avoidWalls = true;
	}

	setAvoidWalls(value) {
		this._avoidWalls = value;
	}

	setWorldSize(width, height, depth) {
		this._width = width;
		this._height = height;
		this._depth = depth;
	}

	run(boids, otherBoids, delta) {
		if (Math.abs(this.velocity.y) > 0.75) {
			this.velocity.y *= 0.9;
		}

		if (this._avoidWalls) {
			const scalar = 5 * this._maxSpeed;
			const vector = new THREE.Vector3();
			vector.set(-this._width, this.position.y, this.position.z);
			this._acceleration.add(this.avoid(vector).multiplyScalar(scalar));

			vector.set(this._width, this.position.y, this.position.z);
			this._acceleration.add(this.avoid(vector).multiplyScalar(scalar));

			vector.set(this.position.x, -this._height, this.position.z);
			this._acceleration.add(this.avoid(vector).multiplyScalar(scalar));

			vector.set(this.position.x, this._height, this.position.z);
			this._acceleration.add(this.avoid(vector).multiplyScalar(scalar));

			vector.set(this.position.x, this.position.y, -this._depth);
			this._acceleration.add(this.avoid(vector).multiplyScalar(scalar));

			vector.set(this.position.x, this.position.y, this._depth);
			this._acceleration.add(this.avoid(vector).multiplyScalar(scalar));
		}

		if (Math.random() > 0.5) {
			this.flock(boids, otherBoids);
		}

		this.move(delta);
	}

	flock(boids, otherBoids) {
		this._acceleration.add(this.alignment(boids));
		this._acceleration.add(this.cohesion(boids));
		this._acceleration.add(this.separation(boids.concat(otherBoids)));
	}

	move(delta) {
		// Apply acceleration
		this.velocity.add(this._acceleration.multiplyScalar(delta));

		// Limit velocity to max speed
		this.velocity.clampLength(0, this._maxSpeed);

		// Update position based on velocity
		this.position.add(this.velocity.clone().multiplyScalar(delta));

		// Reset acceleration and local velocity adjustments
		this._acceleration.set(0, 0, 0);
	}

	avoid(target) {
		const steer = new THREE.Vector3();
		steer
			.copy(this.position)
			.sub(target)
			.multiplyScalar(1 / this.position.distanceToSquared(target));
		return steer;
	}

	repulse(target) {
		const distance = this.position.distanceTo(target);
		if (distance < 150) {
			const steer = new THREE.Vector3();
			steer.subVectors(this.position, target).multiplyScalar(1 / distance);
			this._acceleration.add(steer);
		}
	}

	reach(target, amount) {
		const steer = new THREE.Vector3();
		steer.subVectors(target, this.position).multiplyScalar(amount);
		return steer;
	}

	alignment(boids) {
		const velSum = new THREE.Vector3();
		let count = 0;

		for (const boid of boids) {
			const distance = boid.position.distanceTo(this.position);
			if (distance > 0 && distance <= this._neighborhoodRadius) {
				velSum.add(boid.velocity);
				count++;
			}
		}

		if (count > 0) {
			velSum.divideScalar(count);
			const l = velSum.length();
			if (l > this._maxSteerForce) {
				velSum.divideScalar(l / this._maxSteerForce);
			}
		}
		return velSum;
	}

	cohesion(boids) {
		const posSum = new THREE.Vector3();
		const steer = new THREE.Vector3();
		let count = 0;

		for (const boid of boids) {
			const distance = boid.position.distanceTo(this.position);
			if (distance > 0 && distance <= this._neighborhoodRadius) {
				posSum.add(boid.position);
				count++;
			}
		}

		if (count > 0) {
			posSum.divideScalar(count);
		}
		steer.subVectors(posSum, this.position);
		const l = steer.length();
		if (l > this._maxSteerForce) {
			steer.divideScalar(l / this._maxSteerForce);
		}
		return steer;
	}

	separation(boids) {
		const posSum = new THREE.Vector3();
		const repulse = new THREE.Vector3();

		for (const boid of boids) {
			const distance = boid.position.distanceTo(this.position);
			if (distance > 0 && distance <= this._neighborhoodRadius) {
				repulse
					.subVectors(this.position, boid.position)
					.normalize()
					.divideScalar(distance);
				posSum.add(repulse);
			}
		}
		return posSum;
	}
}

export default Boid;
