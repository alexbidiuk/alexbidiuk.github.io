/* Menu module */
// let print_config = require('../configurations/print');
// let printString = require('../utilities/print_string');
module.exports = class Menu {
    constructor() {
        // this.printString = printString;
        // this.print_config = print_config;
        // this.timeout = 500;
        // this.active = null;
        // this.printing = null;
        this.menu_bg_container = document.querySelector('.menu-bg-container');
        this.menu_bg_container.setAttribute('style',  `transform: translate3d(-50%, -50%, 0) rotate(${this.angleofRotateCalculate()}deg)`);
        this.menu_toggle = document.querySelector('.menu-toggle');
        this.menu_close = document.querySelector('.menu-trigger');
        this.menu_open = document.querySelector('.close-trigger');
        this.menu = document.querySelector('.menu');
        this.elements = document.querySelectorAll('.menu-element');
        this.elements_length = this.elements.length;
        this.links = document.querySelectorAll('.menu-link');
        this.links_length = this.links.length;
        this.porfolio_links = document.querySelectorAll('.portfolio-item');
        this.porfolio_links_length = this.porfolio_links.length;
        for (let i = this.links_length - 1; i >= 0; i--) {
            this.links[i].addEventListener('click', this.selectItemHandler.bind(this), false);
            // this.links[i].addEventListener('mouseenter', this.mouseEnterHandler.bind(this), false);
            // this.links[i].addEventListener('mouseleave', this.mouseLeaveHandler.bind(this), false);
        }
        for (let i = this.porfolio_links_length - 1; i >= 0; i--) {
            if(this.porfolio_links[i].id == 'go_back') { continue; }
            this.porfolio_links[i].addEventListener('click', this.selectItemHandler.bind(this), false);
            // this.links[i].addEventListener('mouseenter', this.mouseEnterHandler.bind(this), false);
            // this.links[i].addEventListener('mouseleave', this.mouseLeaveHandler.bind(this), false);
        }
        document.addEventListener('set_navigation', this.selectItemAction.bind(this), false);
        this.menu_toggle.addEventListener('click', this.toggleMenu.bind(this));
        document.addEventListener('unset_menu', this.unsetMenu.bind(this));
    }

    radToDeg(rad) {
        return rad / Math.PI * 180;
    }
    angleofRotateCalculate() {
        let rad = Math.atan(document.documentElement.clientHeight/document.documentElement.clientWidth);
        return this.radToDeg(rad);
    }
    toggleMenu() {
        this.menu.classList.contains('is-active') ? this.unsetMenu() : this.setMenu();
    }

    setMenu() {
        this.menu.classList.add('is-active');
        this.menu_open.classList.toggle('is-active');
        this.menu_close.classList.toggle('is-active');
        let event_detail = {
            detail: {
                pause: true
            }
        };
        document.dispatchEvent(new CustomEvent('pause_webgl', event_detail));
    }
    unsetMenu() {
        this.menu.classList.remove('is-active');
        this.menu_open.classList.toggle('is-active');
        this.menu_close.classList.toggle('is-active');
        let event_detail = {
            detail: {
                pause: false
            }
        };
        document.dispatchEvent(new CustomEvent('pause_webgl', event_detail));
    }

    checkActive(page) {
        if (page == '#home') {
            return true;
        }
        if (document.querySelector(page).classList.contains('show')) {
            return false;
        }
        return true;
    }

    selectItemHandler(event) {
        event.preventDefault();
        let page = event.currentTarget.getAttribute('href');
        (page.split('-').length <= 1) && this.toggleMenu();
        console.log(page)
        let event_detail = {
            detail: {
                page: page,
                source: 'menu'
            }
        };
        document.dispatchEvent(new CustomEvent('change_page', event_detail));
    }

    selectItemAction(event) {
        let page = event.detail.page;
        this.selectItem(page);
    }

    selectItem(active) {
        this.active = active;
        for (let i = this.links_length - 1; i >= 0; i--) {
            let href = this.links[i].getAttribute('href');

            if (active == href) {
                this.links[i].classList.add('active');
            }
            else {
                this.links[i].classList.remove('active');
            }
        }
    }

    mouseEnterHandler(event) {
        if (!this.printing && !(event.target.lastChild.nodeName == 'SPAN')) {
            let target = event.target;
            let text = target.getAttribute('data-text');
            if (text) {
                let options = this.print_config.printer_settings.header_string;
                this.printing = document.createElement('span')
                target.innerHTML = '';
                target.appendChild(this.printing);
                this.printString(this.printing, text, options);
            }
        }
    }

    mouseLeaveHandler(event) {
        if (this.printing) {
            this.printing.remove();
            this.printing = null;
            let target = event.target;
            target.innerHTML = target.getAttribute('data-text');
        }
    }
}