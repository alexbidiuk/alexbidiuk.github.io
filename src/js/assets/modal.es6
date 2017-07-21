/* Modal module */
let GeminiScrollbar = require('../lib/gemini-scrollbar.js');
module.exports = class Modal {
  constructor() {
    this.modal = document.querySelector('#modal');
    this.close = document.querySelector('#modal-close');
    this.close_links = document.querySelectorAll('.close-modal');
    this.close_links_length = this.close_links.length;
    this.links = document.querySelectorAll('.modal-link');
    this.links_length = this.links.length;
    this.modals = document.querySelectorAll('.modal');
    this.modals_length = this.modals.length;
    this.Scroll = GeminiScrollbar;
    for(let i = this.links_length - 1; i >= 0; i--) {
      this.links[i].addEventListener('click', this.setModal.bind(this), false);
    }
    for(let i = this.close_links_length - 1; i >= 0; i--) {
      this.close_links[i].addEventListener('click', this.closeModal.bind(this), false);
    }
    this.close.addEventListener('click', this.closeModal.bind(this), false);
    document.addEventListener('close_modal', this.closeModal.bind(this), false);
    document.addEventListener('set_navigation', this.closeModalHandler.bind(this));
  }
  setModal(event) {

    event.preventDefault();
    
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";

    let active = event.currentTarget.getAttribute('href').substr(1);
    let modal = null;
    for(let i = this.modals_length - 1; i >= 0; i--) {
      if(this.modals[i].id == active) {
        this.modals[i].classList.add('show');
        modal = this.modals[i];
      }
      else {
        this.modals[i].classList.remove('show');
      }
    }
    this.modal.classList.add('show');
    if (this.modal.querySelector('.show').getAttribute('id') == "modal-crowdsale") {
      document.querySelector("#join-button").style.display = "block";
    } else {
      document.querySelector("#join-button").style.display = "none";
    }
    this.scroll = new this.Scroll(
      {
        element: modal.querySelector('.modal-content')
      }
    ).create();
  }
  closeModal() {

    document.body.style.overflow = null;
    document.body.style.position = null;


    setTimeout(function() {
      this.modal.scrollTop = 0;
    }, 500);

    this.modal.classList.remove('show');

    let scroll = this.scroll;
    function destroy() {
      if(scroll) {
        scroll.destroy();
      }
    }
    setTimeout(function() {
      destroy();
    }, 300);
  }
  closeModalHandler() {
    if(this.modal.classList.contains('show')) {
      setTimeout(this.closeModal.bind(this), 300);
    }
  }
}