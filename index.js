
import Particle from "./particle.js";

const TAU = Math.PI * 2;
const FRAME_DURATION_IN_MILLIS = 1000 / 16;

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

        const length = 41;
        const colors = Array.from(Array(length), (e, i) => 230 + Math.floor(70 * (i / length)));

        // this.head = new Particle(this.aspectRatio * Math.random(), Math.random(), Math.random());
        this.head = new Particle(0, 0, 0, colors[0]);
        this.head.velocity.set(0.1, 0, 0);
        this.nextHeadingChange = 0;

        this.body = Array.from(Array(length - 1), (e, i) =>
            new Particle(0, 0, 0, colors[i + 1]));

        window.addEventListener("keypress", this.keypress.bind(this));

        this.isRunning = true;

        this.updateFn = this.update.bind(this);
        this.previousTime = performance.now();
        this.update(this.previousTime);
    }

    keypress(event) {
        switch (event.key) {
            case " ": this.isRunning = !this.isRunning;
        }
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

    /**
     * @param {Vector} vector
     * @returns {[Number, Number, Number]}
     */
    toScreenCoordinates(vector) {
        return [
            this.halfWidth + vector.x * this.halfWidth,
            this.halfHeight - vector.y * this.halfHeight
        ];
    }

    update(now) {
        const dt = Math.min(FRAME_DURATION_IN_MILLIS, now - this.previousTime);
        this.previousTime = now;

        if (this.isRunning) {
            this.ctx.clearRect(0, 0, this.width, this.height);

            if (now >= this.nextHeadingChange) {
                this.head.setHeading(Math.random() * TAU, Math.random() * TAU);
                this.nextHeadingChange = now + 2000;
            }

            this.head.update(now, dt);

            for (let i = 0; i < this.body.length; i++) {
                const part = this.body[i];
                part.follow(now, dt, i === 0 ? this.head : this.body[i - 1]);
            }

            const sortedParticles = /** @type {Particle[]} */ [this.head, ...this.body]
                .sort((a, b) => a.position.z - b.position.z);

            for (const particle of sortedParticles) {
                const brightness = Math.max(0, (particle.position.z + 1) / 2 * 80);
                const saturation = Math.max(30, 30 + (particle.position.z + 1) / 2 * 60);
                this.ctx.fillStyle = `hsl(${particle.color}, ${saturation}%, ${brightness}%)`;
                this.ctx.beginPath();
                const [x, y] = this.toScreenCoordinates(particle.position);
                const rasterizedSize = Math.max(1, 1 + (particle.position.z + 1) / 2 * 70);
                this.ctx.arc(x, y, rasterizedSize, 0, TAU);
                this.ctx.fill();
            }

            // // center
            // this.ctx.fillStyle = "red";
            // this.ctx.fillRect(this.halfWidth, this.halfHeight, 1, 1);

            // // containment circle
            // this.ctx.strokeStyle = "red";
            // this.ctx.lineWidth = 0.5;
            // this.ctx.beginPath();
            // this.ctx.arc(this.halfWidth, this.halfHeight, 0.9 * Math.min(this.halfHeight, this.halfWidth), 0, TAU);
            // this.ctx.stroke();

            this.updateHUD();
        }

        requestAnimationFrame(this.updateFn);
    }
}

new Helix();
