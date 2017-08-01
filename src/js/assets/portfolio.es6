/* Portfolio module */
// let print_config = require('../configurations/print');
let Animate = require('./animate');
module.exports = class Portfolio {
    constructor() {
        this.height =  window.innerHeight;
        this.width =  window.innerWidth;
        this.pyth = (this.width * this.width ) + (this.height * this.height);
        this.diagonal = Math.round(Math.sqrt(this.pyth));
        this.elements = document.querySelectorAll('.portfolio-item');
        this.elements_count_perpage = 4;
        this.elements_actual_count = this.elements.length;
        this.elements_width =  Math.round(this.diagonal/this.elements_count_perpage);
        this.hidden_width = this.elements_width * (this.elements_actual_count - this.elements_count_perpage);
        this.portfolio_scrolling = document.querySelector('.portfolio-scrolling-block');

        for (let i = this.elements_actual_count - 1; i >= 0; i--) {
            this.elements[i].setAttribute('style', `flex: 0 0 ${this.elements_width}px`);
        }
        // window.addEventListener('touchstart', (event)=> this.touchstartHandler(event));
        // window.addEventListener('touchmove', (event)=> this.touchmoveHandler(event));
        this.delta = null;
        this.translating = false;
        this.currTranslateX = 0;
        this.currTranslateX = 0;
        this.setMousewheelHandler();
    }

    mousewheelHandler(event) {
        this.delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        // if(this.checkTransition()) {
            this.scrollHandler();
        // }

    }
    checkNextDirection() {
        this.delta==1 ? true : false
    }
    checkTransition() {
        let trigger = true;
        trigger = ( this.currTranslateX < 0 && this.currTranslateX === this.hidden_width && this.checkNextDirection()) ? false : true;
        trigger = (this.currTranslateX > 0) ? false : true;
        return trigger;
    }

    // touchstartHandler(event) {
    //     if(this.ready_next || this.ready_prev) {
    //         this.touch_start = event.touches[0].pageY;
    //     }
    //     else {
    //         this.touch_start = null;
    //     }
    // }
    // touchmoveHandler(event) {
    //     if(this.touch_start && (this.ready_next || this.ready_prev)) {
    //         let move = this.touch_start - event.touches[0].pageY;
    //         if(-1 * move > this.move_distance && this.ready_prev) {
    //             this.pageHandler(false);
    //             this.touch_start = null;
    //             this.ready_prev = false;
    //         }
    //         if(move > this.move_distance && this.ready_next) {
    //             this.pageHandler();
    //             this.touch_start = null;
    //             this.ready_next = false;
    //         }
    //     }
    // }
    setMousewheelHandler() {
        if(document.addEventListener) {
            if('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                document.addEventListener("wheel", this.mousewheelHandler.bind(this));
            }
            else if('onmousewheel' in document) {
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

    scrollHandler() {
        // new Animate({
        //     duration: 1000,
        //     timing: (timeFraction) => this.timeFunc(timeFraction),
        //     draw: (progress) => this.changeScroll(progress),
        //     callbackFunction: () => this.currTranslateX += this.elements_width*this.delta
        // });
        this.currTranslateX  += this.elements_width*this.delta;
        // let translatingY = translatingX;
        let t = `translate3d(${this.currTranslateX}px, 0px, 0px)`;
        let s = this.portfolio_scrolling.style;
        s["transform"] = t;
        s["webkitTransform"] = t;
        s["mozTransform"] = t;
        s["msTransform"] = t;
    };
    changeScroll(progress) {

        let translatingX = progress*this.elements_width*this.delta + this.currTranslateX;
        let translatingY = translatingX;
        let t = `translate3d(${translatingX}px, 0px, 0px)`;
        let s = this.portfolio_scrolling.style;
        s["transform"] = t;
        s["webkitTransform"] = t;
        s["mozTransform"] = t;
        s["msTransform"] = t;

    }
    timeFunc(t) {
        //cubicInOut func
        return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
    }

    run() {
        // let t =matrix_3d.translate(this.translateX,this.translateY,0);
        // console.log()
        // let t = 'translateX(' + this.translateX + 'px) translateY(' + this.translateY + 'px) translateZ(0)';
        // let s = this.portfolio_scrolling.style;
        // s["transform"] = t;
        // s["webkitTransform"] = t;
        // s["mozTransform"] = t;
        // s["msTransform"] = t;
        // requestAnimationFrame(this.run.bind(this));
    };


}