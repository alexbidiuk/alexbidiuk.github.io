/* Portfolio menu module */
// let print_config = require('../configurations/print');
// let printString = require('../utilities/print_string');
module.exports = class PortfolioMenu {
    constructor() {
        // this.printString = printString;
        // this.print_config = print_config;
        // this.timeout = 500;
        // this.active = null;
        // this.printing = null;

        this.porfolio_links = document.querySelectorAll('.portfolio-item');
        this.porfolio_links_length = this.porfolio_links.length;

        for (let i = this.porfolio_links_length - 1; i >= 0; i--) {
            if(this.porfolio_links[i].id == 'go_back') {
                this.porfolio_links[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    document.dispatchEvent(new CustomEvent('initial_scroll'));
                })
            };
            this.porfolio_links[i].addEventListener('click', this.selectItemHandler.bind(this), false);
            // this.links[i].addEventListener('mouseenter', this.mouseEnterHandler.bind(this), false);
            // this.links[i].addEventListener('mouseleave', this.mouseLeaveHandler.bind(this), false);
        }
        document.addEventListener('set_navigation', this.selectItemAction.bind(this), false);

    }


    selectItemHandler(event) {
        event.preventDefault();
        let page = event.currentTarget.getAttribute('href');
        let pageFilter = page.split('-');
        if (pageFilter.length > 1) {
            page = '#' + pageFilter[1];
        } else {
            this.toggleMenu()
        }
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