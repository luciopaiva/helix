
class Helix {

    constructor () {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.resize();
        window.addEventListener("resize", this.resize.bind(this));

        document.body.appendChild(this.canvas);

        this.updateFn = this.update.bind(this);
        this.update(performance.now());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.halfWidth = this.width >>> 1;
        this.halfHeight = this.height >>> 1;

        this.canvas.setAttribute("width", this.width.toString());
        this.canvas.setAttribute("height", this.height.toString());
    }

    update(now) {
        requestAnimationFrame(this.updateFn);
    }
}

new Helix();
