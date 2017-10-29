/* Preloader module */
let config = require('../configurations/animation.json');
let logoDrawingTime = config.preloader.logo_drawer;
let viewport =  config.viewport;
// let Walkway = require('../lib/walkway.min');
// let TweenLite = require('gsap');

module.exports = class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.preloaderLogo = document.querySelector('.logo.preloader-logo');
        this.container = document.querySelector('.container');
        this.logoDrawTimeout = this.timeParser(logoDrawingTime);
        window.innerWidth > viewport.large && this.startDrawing()
        this.preloaderEnder();
    }   
    startDrawing() {
        this.preloaderLogo.style.opacity = 1;
        
        // let svg = new Walkway({
        //     selector: '#creato-logo',
        //     duration: this.logoDrawTimeout
        // });

        // svg.draw(function() {
        //     console.log('Animation finished');
        // });
        // TweenLite.to(this.preloaderLogo.style, this.logoDrawTimeout, {strokeDashoffset: '0'});
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