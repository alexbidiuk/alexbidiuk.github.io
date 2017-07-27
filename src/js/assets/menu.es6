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
        this.menu_toggle = document.querySelector('.menu-toggle');
        this.menu_close = document.querySelector('.menu-trigger');
        this.menu_open = document.querySelector('.close-trigger');
        this.menu = document.querySelector('.menu');
        this.elements = document.querySelectorAll('.menu-element');
        this.elements_length = this.elements.length;
        this.links = document.querySelectorAll('.menu-link');
        this.links_length = this.links.length;

        for (let i = this.links_length - 1; i >= 0; i--) {
            this.links[i].addEventListener('click', this.selectItemHandler.bind(this), false);
            // this.links[i].addEventListener('mouseenter', this.mouseEnterHandler.bind(this), false);
            // this.links[i].addEventListener('mouseleave', this.mouseLeaveHandler.bind(this), false);
        }
        document.addEventListener('set_navigation', this.selectItemAction.bind(this));
        this.menu_toggle.addEventListener('click', this.toggleMenu.bind(this));
        document.addEventListener('unset_menu', this.unsetMenu.bind(this));
    }

    getCurrent() {
        return this.active;
    }

    toggleMenu() {
        this.menu.classList.toggle('is-active');
        this.menu_open.classList.toggle('is-active');
        this.menu_close.classList.toggle('is-active');
    }


    checkActive(page) {
        if (page == '/') {
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
        if (this.checkActive(page)) {
            let event_detail = {
                detail: {
                    page: page,
                    source: 'menu'
                }
            };
            document.dispatchEvent(new CustomEvent('change_page', event_detail));
        }
    }

    selectItemAction(event) {
        let page = event.detail.page.split('-')[0];
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
    unsetMenu() {
        this.toggleMenu();
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