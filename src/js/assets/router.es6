/* Router module */
let Menu = require('./menu');
let History = require('./history');
let GeminiScrollbar = require('../lib/gemini-scrollbar.js');
let routerConfig = require('../../js/configurations/router');
module.exports = class Router {
  constructor() {
    new Menu();
    this.default_page = routerConfig.default.page;
    this.page_fade_time = routerConfig.page_fade_time;
    this.active = null;
    this.history = new History();

    this.pages = document.querySelectorAll('.page');
    this.pages_length = this.pages.length;

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
    if(!page || page == '/' || !document.querySelector(page)) {
      return this.default_page;
    }
    if(page == '/' || page == '#home') {
        let event_detail = {
            detail: {
                pause: false
            }
        };
        document.dispatchEvent(new CustomEvent('pause_webgl', event_detail));
    } else {
        let event_detail = {
            detail: {
                pause: true
            }
        };
        document.dispatchEvent(new CustomEvent('pause_webgl', event_detail));
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
    for(let i = this.pages_length - 1; i >= 0; i--) {
      this.pages[i].classList.remove('show');
    }
  }
  checkSubpaging(page) {
      if(page.split('-').length > 1) {
          document.querySelector(page.split('-')[0]).classList.add('show');
          document.querySelector(page.split('-')[0] + ' .portfolio-items-wrapper').classList.add('hide');
      }
      page == '#portfolio' && document.querySelector(page + ' .portfolio-items-wrapper').classList.remove('hide');
  }

  changePage(event) {
    // let page = event.detail.page;
    let page = this.checkPage(event.detail.page);
    if(this.active == page) {
      return false;
    }
    this.active = page;
    // this.active = this.checkPage(page);
    this.hidePages();
    this.checkSubpaging(page);
    this.setPage();
  }

}