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
        this.elements_count_perpage = 3;
        this.elements_actual_count = this.elements.length;
        this.elements_width =  Math.round(this.diagonal/this.elements_count_perpage);
        this.hidden_width = this.elements_width * (this.elements_actual_count - this.elements_count_perpage);
        console.log(this.hidden_width)
        this.portfolio_scrolling = document.querySelector('.portfolio-scrolling-block');

        for (let i = this.elements_actual_count - 1; i >= 0; i--) {
            this.elements[i].setAttribute('style', `flex: 0 0 ${this.elements_width}px`);
        }
        // window.addEventListener('touchstart', (event)=> this.touchstartHandler(event));
        // window.addEventListener('touchmove', (event)=> this.touchmoveHandler(event));
        this.delta = null;
        this.scrollWorking = new Date().getTime();
        this.translating = false;
        this.currTranslateX = 0;
        
        this.setMousewheelHandler();
    }

    mousewheelHandler(event) {
        if (new Date().getTime() - this.scrollWorking > 1200) {
            this.delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            // if(this.checkTransition()) {
                this.scrollHandler();
            // }
           this.scrollWorking = new Date().getTime();;
        }
    }
 
    checkNextDirection() {
        this.delta==-1 ? true : false
    }
    checkTransition() {
        let trigger = true;
        if(this.currTranslateX + this.elements_width*this.delta > 0) trigger = false;
        if(this.currTranslateX + this.elements_width*this.delta < 0 && this.hidden_width < 0 && Math.abs(this.currTranslateX + this.elements_width*this.delta) > this.hidden_width) trigger = false;

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
        if(this.checkTransition()) {
            new Animate({
                duration: 800,
                timing: (timeFraction) => this.timeFunc(timeFraction),
                draw: (progress) => this.changeScroll(progress),
                callbackFunction: () => this.currTranslateX += this.elements_width*this.delta
            });
        }
    };
    changeScroll(progress) {
        let translatingX = progress*this.elements_width*this.delta + this.currTranslateX;
        let translatingY = translatingX;
        let t = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${translatingX},0,0,1)`;
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
}