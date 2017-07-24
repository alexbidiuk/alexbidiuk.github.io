/* Preloader module */
let logoDrawingTime = require('../../js/configurations/animation.json').preloader.logo_drawer;
module.exports = class Preloader {
    constructor() {
        this.preloader = document.querySelectorAll('.preloader')[0];
        this.container = document.querySelectorAll('.container')[0];
        this.logoDrawTimeout = logoDrawingTime.replace(/[^0-9]+/, '');
        this.preloaderEnder();
    }
    contentLoadPromise() {
       return new Promise((resolve, reject) => {
            window.addEventListener('load', function() {
                console.log('loaded');
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
                this.container.classList.toggle('loaded');
            });
    }

};