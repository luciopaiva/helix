
import Vector from "./vector.js";

const STEERING_FORCE = 0.00000004;
const SPEED_LIMIT = 0.008;

export default class Particle {

    constructor (x, y, z) {
        this.position = new Vector(x, y, z);
        this.velocity = new Vector(0, 0, 0);
        this.acceleration = new Vector(0, 0, 0);
        this.aux = new Vector();
    }

    setHeading(phi, theta) {
        this.acceleration.setSphericalCoordinates(phi, theta).scale(STEERING_FORCE);
    }

    update(dt) {
        // v = v0 + at
        Vector.scale(this.acceleration, dt, this.aux);
        this.velocity.add(this.aux);

        const speed = this.velocity.length;
        if (speed > SPEED_LIMIT) {
            this.velocity.normalize().scale(SPEED_LIMIT);
        }

        Vector.scale(this.velocity, dt / 1000, this.aux);
        this.position.add(this.velocity);
    }
}
