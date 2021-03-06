/* Router module */
let History = require('./history');
let Menu = require('./menu');
let Portfolio = require('./portfolio');
let GeminiScrollbar = require('../lib/gemini-scrollbar.js');
let animationConfig = require('../../js/configurations/animation.json');
let routerConfig = require('../../js/configurations/router');
module.exports = class Router {
    constructor() {
        this.menu = new Menu();
        this.portfolio = new Portfolio();
        this.history = new History();
        this.default_page = routerConfig.default.page;
        this.page_fade_time = routerConfig.page_fade_time;
        this.menu_fade_time = parseInt(animationConfig.menu.in_out, 10);
        this.active = null;
        this.pagesWrap = document.querySelector('.pages');

        this.scrollbar = new GeminiScrollbar({element: this.pagesWrap}).create();

        document.addEventListener('change_page', this.changePage.bind(this));

        let event_detail = {
            detail: {
                page: window.location.hash,
                source: 'init'
            }
        };
        document.dispatchEvent(new CustomEvent('change_page', event_detail));
    }

    checkPage(page) {
        let event_detail = {
            detail: {
                pause: true
            }
        };
        document.dispatchEvent(new CustomEvent('pause_webgl', event_detail));
        document.dispatchEvent(new CustomEvent('pause_portfolio', event_detail));

        if (page == '' || page == '#home') {
            event_detail.detail.pause = false;
            document.dispatchEvent(new CustomEvent('pause_webgl', event_detail));
        }
        if (!page || page == '' || !document.querySelector(page)) {
            return this.default_page;
        }
        if (page == '#portfolio') {
            event_detail.detail.pause = false;
            document.dispatchEvent(new CustomEvent('pause_portfolio', event_detail));
        }
        if (page == '#portfolio' || ( page.split('-').length > 1 && page.split('-')[0] == '#portfolio') ) {
            setTimeout(this.portfolio.imagesLazyLoading, this.menu_fade_time);
        }
        return page;
    }

    setPage() {
        this.history.setState(this.active);
        let event_detail = {
            detail: {
                page: this.active
            }
        };
        document.dispatchEvent(new CustomEvent('set_navigation', event_detail));
        document.querySelector(this.active).classList.add('show');
        this.scrollbar.update();

    }

    hidePages() {
        let pages = document.querySelectorAll('.page');
        for (let i = pages.length - 1; i >= 0; i--) {
            pages[i].classList.remove('show');
        }
    }

    checkSubpaging(page) {
        if (page.split('-').length > 1) {
            document.querySelector(page.split('-')[0]).classList.add('show');
            document.querySelector(page.split('-')[0] + ' .portfolio-items-wrapper').classList.add('hide');
        }
        if (page.split('-').length < 2) {
          page == '#portfolio' && document.querySelector(page + ' .portfolio-items-wrapper').classList.remove('hide');
        }
    }

    changePage(event) {
        let page = this.checkPage(event.detail.page);
        if (this.active == page) {
            return false;
        }
        this.active = page;
        this.menu.checkActiveHome(page);
        this.hidePages();
        this.checkSubpaging(page);
        this.setPage();
    }

}