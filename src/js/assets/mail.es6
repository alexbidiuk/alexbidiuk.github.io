/* Mail module */
let print_config = require('../configurations/print');
let printString = require('../utilities/print_string');
module.exports = class Mail {
  constructor() {
    this.printString = printString;
    this.print_config = print_config;
    this.action = '';
    this.type = '';
    this.email = '';
    this.message = '';
    this.form = document.querySelector('.send-form');
    this.timeout = null;
    this.timeout_delay = 3000;
    this.sending = '';
    this.form.addEventListener('submit', this.submithandler.bind(this), false);

  }
  ajaxRequest() {
    let activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] // activeX versions to check for in IE
    if(window.ActiveXObject) { // Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
      for(let i = 0; i < activexmodes.length; i++) {
        try {
          return new ActiveXObject(activexmodes[i]);
        }
        catch(e) {
          console.error('activeX Error');
        }
      }
    }
    else if(window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } // if Mozilla, Safari etc
    else {
      return false
    }
  }
  submithandler(event) {
    let that = this;
    event.preventDefault();
    let form = event.target;
    this.action = form.action;
    this.type = form.name;
    this.email = form.email.value;
    let message_input = form.message;
    if(message_input) {
      this.message = message_input.value;
    }
    else {
      this.message = '';
    }
    let options = this.print_config.printer_settings.header_string;
    let button = form.submit;
    let text = 'SENDING...';
    that.printString(button, text, options);
    this.sending = setInterval(function () {that.printString(button, text, options)}, 2000);
    this.sendData();
  }
  sendData() {
    let data = "email=" + this.email + "&message=" + this.message;
    let request = new this.ajaxRequest();
    let responseHandler = this.responseHandler.bind(this);
    request.responseType = 'json';
    request.onreadystatechange = function() {
      console.log(request)
      if (request.readyState == 4) {
        if(request.status == 200) {
          responseHandler(request.response);
        }
        else {
          console.error("An error has occured making the request");
        }
      }
    };
    request.open("POST", this.action, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(data);
  }
  sentHandler(response) {
    this.form.classList.add('sent');
    let send_message = this.form.querySelector('.send-message');
    let text = send_message.getAttribute('data-text');
    clearInterval(this.sending);
    let options = this.print_config.printer_settings.header_string;
    this.printString(send_message, text, options);
    let unsetSent = this.unsetSent.bind(this);
    this.timeout = setTimeout(() => {
      unsetSent(this.form);
    }, this.timeout_delay)
  }
  unsetSent() {
    clearInterval(this.sending);
    this.form.classList.remove('sent');
    this.form.classList.add('hide-text');
    let button = this.form.submit;
    let text = button.getAttribute('data-text');
    let options = this.print_config.printer_settings.header_string;
    this.printString(button, text, options);
    this.timeout = setTimeout(() => {
      this.form.classList.remove('hide-text');
      this.form.email.value = '';
      if(this.form.message) {
        this.form.message.value = '';
      }
    }, 200);
  }
  errorHandler(response) {
    clearInterval(this.sending);
    this.form.classList.add('error');
    let error_title = this.form.querySelector('.error-title');
    let error_text = this.form.querySelector('.error-text');
    for(let i = response.errors.length; i > 0; i--) {
      let index = i - 1;
      let target= this.form[response.errors[index].target];
      target.classList.add('error');
      target.addEventListener('input', function() {
        this.classList.remove('error');
      })
      if(!index) {
        let options = this.print_config.printer_settings.header_string;
        this.printString(error_title, response.errors[index].title, options);
        this.printString(error_text, response.errors[index].text, options);
      }
    }
    let unsetError = this.unsetError.bind(this);
    this.timeout = setTimeout(() => {
      unsetError();
    }, this.timeout_delay)
  }
  unsetError() {
    this.form.classList.remove('error');
    let button = this.form.submit;
    button.classList.remove('error');
    let text = button.getAttribute('data-text');
    let options = this.print_config.printer_settings.header_string;
    this.printString(button, text, options);
  }
  responseHandler(response) {
    if(response.errors.length) {
      this.errorHandler(response);
    }
    else {
      this.sentHandler();
    }
  }
};