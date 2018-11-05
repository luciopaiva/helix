
export default class Vector {

    constructor (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    setSphericalCoordinates(phi, theta) {
        this.x = Math.cos(phi) * Math.sin(theta);
        this.y = Math.sin(theta) * Math.sin(phi);
        this.z = Math.cos(theta);
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    scale(scalar) {
        Vector.scale(this, scalar, this);
        return this;
    }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    normalize() {
        const len = this.length;
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

    toString() {
        return `${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)} (${this.length.toFixed(2)})`
    }

    /**
     * @param {Vector} v1
     * @param {Number} scalar
     * @param {Vector} result
     */
    static scale(v1, scalar, result) {
        result.x = v1.x * scalar;
        result.y = v1.y * scalar;
        result.z = v1.z * scalar;
    }
}
