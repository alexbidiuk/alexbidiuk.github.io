/* Preloader module */
let logoDrawingTime = require('../configurations/animation.json').preloader.logo_drawer;
let Walkway = require('../lib/walkway.min');

module.exports = class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.preloaderLogo = document.querySelector('.logo.preloader-logo');
        this.container = document.querySelector('.container');
        this.logoDrawTimeout = this.timeParser(logoDrawingTime);
        this.startDrawing()
        this.preloaderEnder();
    }
    startDrawing() {
        let svg = new Walkway({
            selector: '#creato-logo',
            duration: this.logoDrawTimeout
        });

        svg.draw(function() {
        console.log('Animation finished');
        });
    }
    timeParser(logoDrawingTime) {
        return logoDrawingTime.replace(/[^0-9]+/, '');
    }

    contentLoadPromise() {
        return new Promise((resolve, reject) => {
            window.addEventListener('load', function () {
                resolve();
            });
        });
    }

    logoDrawPromise() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, this.logoDrawTimeout);
        });
    }

    preloaderEnder() {
        return Promise.all([this.contentLoadPromise(), this.logoDrawPromise()])
            .then(() => {
                this.preloader.classList.toggle('ended');
                this.preloaderLogo.style.willChange = 'auto';
                this.container.classList.toggle('loaded');
                document.dispatchEvent(new CustomEvent('initialize_menu'));
            });
    }

};