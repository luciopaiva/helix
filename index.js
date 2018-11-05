
import Particle from "./particle.js";

const TAU = Math.PI * 2;

class Helix {

    constructor () {
        this.positionElem = document.getElementById("position");
        this.velocityElem = document.getElementById("velocity");
        this.accelerationElem = document.getElementById("acceleration");

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.resize();
        window.addEventListener("resize", this.resize.bind(this));

        document.body.appendChild(this.canvas);

        // this.head = new Particle(this.aspectRatio * Math.random(), Math.random(), Math.random());
        this.head = new Particle(0, 0, 0);
        this.head.velocity.set(0.001, 0, 0);
        this.nextHeadingChange = 0;

        this.updateFn = this.update.bind(this);
        this.previousTime = performance.now();
        this.update(this.previousTime);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.halfWidth = this.width >>> 1;
        this.halfHeight = this.height >>> 1;
        this.aspectRatio = this.width / this.height;

        this.canvas.setAttribute("width", this.width.toString());
        this.canvas.setAttribute("height", this.height.toString());
    }

    updateHUD() {
        this.positionElem.innerText = "pos: " + this.head.position.toString();
        this.velocityElem.innerText = "vel: " + this.head.velocity.toString();
        this.accelerationElem.innerText = "acc: " + this.head.acceleration.toString();
    }

    update(now) {
        const dt = now - this.previousTime;
        // this.ctx.clearRect(0, 0, this.width, this.height);

        if (now >= this.nextHeadingChange) {
            this.head.setHeading(Math.random() * TAU, Math.random() * TAU);
            this.nextHeadingChange = now + 1000;
        }

        this.head.update(now, dt);

        const x = this.halfWidth + this.head.position.x * this.halfWidth;
        const y = this.halfHeight - this.head.position.y * this.halfHeight;

        this.ctx.fillStyle = "#3f6fff";
        this.ctx.fillRect(x, y, 1, 1);

        this.updateHUD();

        requestAnimationFrame(this.updateFn);
    }
}

new Helix();
