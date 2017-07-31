/* Portfolio module */
// let print_config = require('../configurations/print');
// let printString = require('../utilities/print_string');
let vs = require('../lib/VirtualScroll.js');
module.exports = class Portfolio {
    constructor() {
        this.vs = vs;
        this.currentX = 0;
        this.targetX = 0;

        this.ease = 0.1;
        this.scrollWidth = 390;
        this.height =  window.innerHeight;
        this.width =  window.innerWidth;
        this.pyth = (this.width * this.width ) + (this.height * this.height);
        this.diagonal = Math.round(Math.sqrt(this.pyth));
        this.elements = document.querySelectorAll('.portolio-item');
        this.elements_length = this.elements.length;
        this.elements_width =  Math.round(this.diagonal/this.elements_length);

        this.portfolio_items = document.querySelector('.portfolio-item-wrapper');
        this.portfolio_items_height = this.portfolio_items.getBoundingClientRect().height;

        for (let i = this.elements_length - 1; i >= 0; i--) {
            this.elements[i].setAttribute('style', `flex: 0 0 ${this.elements_width}px`);
        }
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
        this.setScroll()
        this.run();
    }

    setScroll() {
        this.vs.on(function(e){
            this.targetX += e.deltaY;

            console.log(this.targetX + e.deltaY)
            this.targetX = Math.max(( e.originalEvent.srcElement.clientHeight - window.innerHeight) * -1, this.targetX);
            this.targetX = Math.min(0, this.targetX);
        });
    };

    run() {
        requestAnimationFrame(this.run.bind(this));
        console.log(this.currentX);
        this.currentX += (this.targetX - this.currentX) * this.ease;
        let t = 'translateX(' + this.currentX + 'px) translateZ(0)';
        let s = this.portfolio_items.style;
        s["transform"] = t;
        s["webkitTransform"] = t;
        s["mozTransform"] = t;
        s["msTransform"] = t;
    };


}