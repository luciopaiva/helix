
import Vector from "./vector.js";

const STEERING_FORCE = 0.5;
const SPEED_LIMIT = 0.4;

export default class Particle {

    constructor (x, y, z, color) {
        this.position = new Vector(x, y, z);
        this.color = color;

        this.velocity = new Vector(0, 0, 0);
        this.acceleration = new Vector(0, 0, 0);
        this.heading = new Vector(0, 0, 0);
        this.aux = new Vector(0, 0, 0);
        this.desiredVelocity = new Vector(0, 0, 0);
        this.steer = new Vector(0, 0, 0);
        this.repulsion = new Vector(0, 0, 0);
    }

    setHeading(phi, theta) {
        this.heading.setSphericalCoordinates(phi, theta).scale(STEERING_FORCE);
    }

    /**
     * @param {Number} now
     * @param {Number} dt
     */
    update(now, dt) {
        dt /= 1000;
        const distanceFromCenter = this.position.length;

        this.acceleration.clear();
        this.acceleration.add(this.heading);

        // ToDo this should be a parameter
        if (distanceFromCenter > 0.5) {  // too far from center - repel it
            this.repulsion.set(this.position).normalize().scale(-distanceFromCenter * 0.8);
            this.acceleration.add(this.repulsion);
        }

        this.acceleration.scale(dt);

        // v = v0 + at
        this.velocity.add(this.acceleration);
        this.velocity.limit(SPEED_LIMIT);

        // s = s0 + vt
        Vector.scale(this.velocity, dt, this.aux);
        this.position.add(this.aux);
    }

    /**
     * @param {Number} now
     * @param {Number} dt
     * @param {Particle} leader
     */
    follow(now, dt, leader) {
        dt /= 1000;  // convert to seconds

        this.acceleration.clear();

        const distance = Vector.subtract(leader.position, this.position, this.desiredVelocity).length;
        if (distance > 0.005) {  // maximum distance reached - apply force
            this.desiredVelocity.normalize().scale(SPEED_LIMIT);

            Vector.subtract(this.desiredVelocity, this.velocity, this.steer);
            this.steer.scale(15);
            this.acceleration.add(this.steer);
        }

        this.acceleration.scale(dt);
        this.velocity.add(this.acceleration);
        this.velocity.limit(SPEED_LIMIT);

        Vector.scale(this.velocity, dt, this.aux);
        this.position.add(this.aux);
    }
}
