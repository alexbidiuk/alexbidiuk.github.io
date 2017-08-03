/* Portfolio module */
// let print_config = require('../configurations/print');
let Animate = require('./animate');
module.exports = class Portfolio {
    constructor(elem_per_page = 3) {
        this.portfolio_page = document.querySelector('#portfolio');
        this.elements = document.querySelectorAll('.portfolio-item');
        this.elements_wrapper = document.querySelector('.portfolio-items-wrapper');
        this.elements_wrapper.setAttribute('style', `transform: translate3d(0, -50%, 0) rotate(${this.angleofRotateCalculate()}deg)`);

        this.portfolio_scrolling = document.querySelector('.portfolio-scrolling-block');
        this.elements_count_perpage = elem_per_page;
        this.elements_actual_count = this.elements.length;
        this.elements_width = this.elementWidthCalculate();
        this.scroll_step = this.elements_width;

        this.hidden_width = this.elements_width * (this.elements_actual_count - this.elements_count_perpage);
        for (let i = this.elements_actual_count - 1; i >= 0; i--) {
            this.elements[i].setAttribute('style', `flex: 0 0 ${this.elements_width}px`);
        }
        this.delta = 0;
        this.isTransitioning = false;
        this.lastScrollWorking = new Date().getTime();
        this.currTranslateX = 0;
        this.touch_start = null;
        this.touch_event = null;
        this.setMousewheelHandler();
        window.addEventListener('initial_scroll', this.setInitialTranslate.bind(this), false);
        window.addEventListener('set_portfolio', () => this.setPortfolioPage());
        window.addEventListener('touchstart', (event) => this.touchstartHandler(event));
        window.addEventListener('touchmove', (event) => this.touchmoveHandler(event));
    }
    radToDeg(rad) {
        return rad / Math.PI * 180;
    }

    angleofRotateCalculate() {
        let rad = Math.atan(window.innerHeight/window.innerWidth);
        return this.radToDeg(rad);
    }
    elementWidthCalculate() {
        return Math.round(this.diagonalLengthCalculate() / this.elements_count_perpage);
    }

    diagonalLengthCalculate() {
        let pyth = (window.innerWidth * window.innerWidth) + (window.innerHeight * window.innerHeight);
        return Math.round(Math.sqrt(pyth));
    }
    setPortfolioPage() {
        this.portfolio_page.classList.add('show');
    }

    setMousewheelHandler() {
        if (document.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                document.addEventListener("wheel", this.mousewheelHandler.bind(this));
            }
            else if ('onmousewheel' in document) {
                // устаревший вариант события
                document.addEventListener("mousewheel", this.mousewheelHandler.bind(this));
            }
            else {
                // Firefox < 17
                document.addEventListener("MozMousePixelScroll", this.mousewheelHandler.bind(this));
            }
        }
        else { // IE8-
            document.attachEvent("onmousewheel", this.mousewheelHandler.bind(this));
        }
    }

    mousewheelHandler(event) {
        if (new Date().getTime() - this.lastScrollWorking >= 700 && !this.isTransitioning) {
            this.lastScrollWorking = new Date().getTime();
            this.delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            this.scrollHandler();
        }
    }

    willTranslateXcalculate() {
        return this.currTranslateX + this.scroll_step * this.delta;
    }

    checkTransitionCoordinate() {
        let trigger = true;
        if (this.willTranslateXcalculate() > 0) trigger = false;
        if (this.willTranslateXcalculate() < 0 && Math.abs(this.willTranslateXcalculate()) > this.hidden_width) trigger = false;
        if (this.hidden_width < 0) trigger = false;
        return trigger;
    }

    animationStart(timeFunc, drawFunc, callback=() => {}) {
        new Animate({
            duration: 900,
            timing: (timeFraction) => timeFunc(timeFraction),
            draw: (progress) => drawFunc(progress),
            callbackFunction: () => callback()
        });
    }

    touchstartHandler(event) {
        this.touching = true;
        this.touch_start = event.touches[0].pageY;
    }

    touchmoveHandler(event) {
        this.touch_event = event.touches[0].pageY;
        if (new Date().getTime() - this.lastScrollWorking >= 700 && !this.isTransitioning) {
            this.lastScrollWorking = new Date().getTime();
            if (this.touch_start > this.touch_event) {
                this.delta = -1;
                this.scrollHandler();
            } else {
                this.delta = 1;
                this.scrollHandler();
            }
        }
    }

    scrollHandler() {
        if (this.checkTransitionCoordinate() && !this.isTransitioning) {
            this.isTransitioning = true;
            this.animationStart(this.timeFunc, this.changeScroll.bind(this), this.scrollAnimCallback.bind(this));
        }
    }

    setInitialTranslate(e) {
        e.preventDefault();
        if (!this.isTransitioning) {
            this.animationStart(this.timeFunc, this.setInitialScroll.bind(this), this.scrollAnimToInitialCallback.bind(this));
        }
    }

    setInitialScroll(progress) {
        let translatingX = this.currTranslateX - progress*this.currTranslateX ;
        this.animationTransformApply(this.portfolio_scrolling, translatingX);
    }

    changeScroll(progress) {
        let translatingX = progress * this.scroll_step * this.delta + this.currTranslateX;
        this.animationTransformApply(this.portfolio_scrolling, translatingX);
    }

    animationTransformApply(elem, translatingX) {
        let val = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${translatingX},0,0,1)`;
        elem.style["transform"] = val;
        elem.style["webkitTransform"] = val;
        elem.style["mozTransform"] = val;
        elem.style["msTransform"] = val;
    }

    scrollAnimCallback() {
        this.currTranslateX += this.scroll_step * this.delta;
        this.isTransitioning = false;
    }
    scrollAnimToInitialCallback() {
        this.currTranslateX = 0;
        this.isTransitioning = false;
    }

    timeFunc(t) {
        //cubicInOut func
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }
}