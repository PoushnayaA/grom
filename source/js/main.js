import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {Form} from './modules/form-validate/form';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();


  window.addEventListener('load', () => {
    initModals();
    const form = new Form();
    window.form = form;
    form.init();
  });



  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('show');
    menu.classList.toggle('hide');
    burger.classList.toggle('active');
    document.querySelector('body').classList.toggle('dark');
  });

  function handleWindowResize() {
    const bodyElement = document.body;
    const windowWidth = window.innerWidth;

    if (windowWidth >= 768) {
      bodyElement.classList.remove('dark');
      menu.classList.remove('show');
    menu.classList.add('hide');
    burger.classList.remove('active');
    }
  }

  window.addEventListener('resize', handleWindowResize);
});
