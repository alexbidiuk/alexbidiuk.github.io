/* Animate module */
module.exports = class Animate {
    constructor({ duration, timing, draw, callbackFunction }) {
        this.duration = duration;
        this.timing = timing;
        this.draw = draw;
        this.callbackFunction = callbackFunction;
        this.start = performance.now();
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - this.start) / this.duration;
        if (timeFraction > 1) timeFraction = 1;

        // calculate the current animation state
        let progress = this.timing(timeFraction);
        this.draw(progress); // draw it

        if (timeFraction < 1) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.callbackFunction();
        }
    }
}