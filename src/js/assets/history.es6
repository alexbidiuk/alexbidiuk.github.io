/* History module */
let routes = require('../configurations/routes');
module.exports = class History {
    constructor() {
        this.title = 'CREATO'
        this.states = [];
        this.state = 0
        this.replace = false;
        this.defaultRoute = routes.home;
        window.addEventListener('popstate', this.popstateHandler.bind(this));
        window.addEventListener('hashchange', this.hashChangeHandler.bind(this));
    }

    popstateHandler(event) {
        if (this.states !== event.state) {
            this.replace = true;
            let page = event.state.page || this.defaultRoute;
            let event_detail = {
                detail: {
                    page: page,
                    source: 'history'
                }
            };
            document.dispatchEvent(new CustomEvent('change_page', event_detail));
        }
    }

    hashChangeHandler() {
        if (this.states !== location.hash) {
            let page = location.hash;
            let event_detail = {
                detail: {
                    page: page,
                    source: 'history'
                }
            };
            document.dispatchEvent(new CustomEvent('change_page', event_detail));
        }
    }

    getStateData(page) {
        let state = {};
        state.data = {
            page: page
        };

        state.title = this.title;
        let item = document.querySelector(page);
        if (item) {
            let subtitle = item.getAttribute('data-title');
            if (subtitle) {
                state.title += ' - ' + subtitle;
            }
        }

        state.url = window.location.origin + page;

        return state;
    }

    setState(page) {
        console.log('hi');
        let state = this.getStateData(page);
        this.states[this.states.length] = state.data;
        if (history && history.pushState) {
            if (history.state == null || this.replace) {
                this.replace = false;
                history.replaceState(state.data, state.title, state.url);
            }
            else {
                history.pushState(state.data, state.title, state.url);
            }
        }
        document.title = state.title;
    }
}