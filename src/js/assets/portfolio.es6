/* Portfolio module */
// let print_config = require('../configurations/print');
let GeminiScrollbar = require('../lib/gemini-scrollbar.js');
let animationConfig = require('../configurations/animation.json');
let Animate = require('./animate');
var TweenLite = require('gsap').TweenLite;
module.exports = class Portfolio {
    constructor(elem_per_page = 4) {
        this.portfolio_page = document.querySelector('#portfolio');
        this.go_back_link = document.querySelector('#go_back');
        this.go_back_link.addEventListener('click', (e) => this.setInitialTranslate(e));
        this.elements = document.querySelectorAll('.portfolio-item');
        this.elements_text = document.querySelectorAll('.portfolio-item-text');
        this.porfolio_links_length = this.elements.length;
        for (let i = this.porfolio_links_length - 1; i >= 0; i--) {
            if (this.elements[i].id == 'go_back') {
                continue;
            }
            this.elements[i].addEventListener('click', this.portfolioItemHandler.bind(this), false);
        }
        this.elements_wrapper = document.querySelector('.portfolio-items-wrapper');
        this.leftWrapperX = window.innerWidth < animationConfig.viewport.large ? 50 : 0;
        this.elements_wrapper.setAttribute('style', `left: ${this.leftWrapperX}%; transform: translate3d(0, -50%, 0) rotate(${this.angleofRotateCalculate()}deg)`);

        this.portfolio_scrolling = document.querySelector('.portfolio-scrolling-block');
        this.elements_count_perpage = elem_per_page;
        this.elements_actual_count = this.elements.length;
        this.elements_width = this.elementWidthCalculate();
        // this.scroll_step = window.innerWidth < animationConfig.viewport.large ? this.elements_width*2 : this.elements_width;
        this.scroll_step = this.elements_width * 2;
        this.hidden_width = this.elements_width * (this.elements_actual_count - this.elements_count_perpage);
        for (let i = this.elements_actual_count - 1; i >= 0; i--) {
            this.elements[i].setAttribute('style', `flex: 0 0 ${this.elements_width}px`);
            this.elements_text[i].setAttribute('style', `transform: rotate(-${this.angleofRotateCalculate()}deg)`);
        }
        this.delta = 0;
        this.scrollings = [];
        this.isTransitioning = false;
        this.isPaused = false;
        this.lastScrollWorking = new Date().getTime();
        this.currTranslateX = 0;
        this.touch_start = null;
        this.touch_event = null;
        document.addEventListener('pause_portfolio', this.pause.bind(this));
        this.portfolio_page.addEventListener('touchstart', (event) => this.touchstartHandler(event));
        this.portfolio_page.addEventListener('touchmove', (event) => this.touchmoveHandler(event));
        this.setMousewheelHandler();
    }
    imagesLazyLoading() {
        let portfolio_pages_images = document.querySelectorAll('#portfolio img[data-src]');
        if(portfolio_pages_images.length) {
            for (let i = portfolio_pages_images.length - 1; i >= 0; i--) {
                let img = portfolio_pages_images[i];
                img.setAttribute('src', img.getAttribute('data-src'));
                img.onload = () => img.removeAttribute('data-src');
            }
        }
    }
    portfolioItemHandler(event) {
        event.preventDefault();
        let page = event.currentTarget.getAttribute('href');
        let event_detail = {
            detail: {
                page: page,
                source: 'portfolio'
            }
        };
        document.dispatchEvent(new CustomEvent('change_page', event_detail));
    }

    pause(event) {
        this.isPaused = event.detail.pause ? true : false;
    }

    radToDeg(rad) {
        return rad / Math.PI * 180;
    }

    angleofRotateCalculate() {
        let rad = Math.atan(document.documentElement.clientHeight / document.documentElement.clientWidth);
        let angle = this.radToDeg(rad);
        if (window.innerWidth < animationConfig.viewport.large) {
            angle = 90;
        }
        ;
        return angle;
    }

    elementWidthCalculate() {
        let element_width = Math.round(this.diagonalLengthCalculate() / this.elements_count_perpage);
        if (window.innerWidth < animationConfig.viewport.large) {
            element_width = Math.round(document.documentElement.clientHeight / this.elements_count_perpage);
        }
        ;
        return element_width;
    }

    diagonalLengthCalculate() {
        let pyth = (document.documentElement.clientWidth * document.documentElement.clientWidth) + (document.documentElement.clientHeight * document.documentElement.clientHeight);
        return Math.round(Math.sqrt(pyth));
    }

    getAverage(elements, number) {
        let sum = 0;

        //taking `number` elements from the end to make the average, if there are not enought, 1
        let lastElements = elements.slice(Math.max(elements.length - number, 1));

        for (let i = 0; i < lastElements.length; i++) {
            sum = sum + lastElements[i];
        }

        return Math.ceil(sum / number);
    }

    setPortfolioPage() {
        this.portfolio_page.classList.add('show');
    }

    setMousewheelHandler() {
         if(!this.isPaused) {
            if (document.addEventListener) {
                if ('onwheel' in document) {
                    // IE9+, FF17+, Ch31+
                    this.portfolio_page.addEventListener("wheel", this.mousewheelHandler.bind(this));
                }
                else if ('onmousewheel' in document) {
                    // устаревший вариант события
                    this.portfolio_page.addEventListener("mousewheel", this.mousewheelHandler.bind(this));
                }
                else {
                    // Firefox < 17
                    this.portfolio_page.addEventListener("MozMousePixelScroll", this.mousewheelHandler.bind(this));
                }
            }
            else { // IE8-
                this.portfolio_page.attachEvent("onmousewheel", this.mousewheelHandler.bind(this));
            }
         }
    }

    mousewheelHandler(event) {
            event.preventDefault();
            event.stopPropagation();

            let currScrollWorking = new Date().getTime();

            let value = event.wheelDelta || -event.deltaY || -event.detail;

            this.scrollings.push(Math.abs(value));

            if (this.scrollings.length > 149) {
                this.scrollings.shift();
            }

            let timeDiff = currScrollWorking - this.lastScrollWorking;

            if (timeDiff > animationConfig.portfolio.scroll_delay && !this.isTransitioning) {
                this.lastScrollWorking = currScrollWorking;

                this.delta = Math.max(-1, Math.min(1, value));

                let averageEnd = this.getAverage(this.scrollings, 10);
                let averageMiddle = this.getAverage(this.scrollings, 100);
                let isAccelerating = averageEnd >= averageMiddle;


                if (isAccelerating) {
                    this.scrollHandler();
                }
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

    animationStart(timeFunc, drawFunc, callback = () => {
    }) {
        new Animate({
            duration: animationConfig.portfolio.scroll_duration,
            timing: (timeFraction) => timeFunc(timeFraction),
            draw: (progress) => drawFunc(progress),
            callbackFunction: () => callback()
        });
    }

    touchstartHandler(event) {
        if(!this.isPaused) {
            this.touching = true;
            this.touch_start = event.touches[0].pageY;
        }
    }

    touchmoveHandler(event) {
        if(!this.isPaused) {
            this.touch_event = event.touches[0].pageY;
            if (new Date().getTime() - this.lastScrollWorking >= animationConfig.portfolio.scroll_delay && !this.isTransitioning) {
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
    }

    scrollHandler() {
        if (this.checkTransitionCoordinate() && !this.isTransitioning) {
            this.isTransitioning = true;
            this.scrollings = [];
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
        let translatingX = this.currTranslateX - progress * this.currTranslateX;
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
        return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
    }
}