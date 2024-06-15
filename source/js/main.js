import { iosVhFix } from './utils/ios-vh-fix';
import { initModals } from './modules/modals/init-modals';
import { Form } from './modules/form-validate/form';

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

  const bodyElement = document.body;

  function handleWindowResize() {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 768) {
      bodyElement.classList.remove('dark');
      menu.classList.remove('show');
      menu.classList.add('hide');
      burger.classList.remove('active');
    }
  }

  window.addEventListener('resize', handleWindowResize);

  const filtersToggle = document.querySelector('.competitions-list__filter-mobile-button');
  const filtersContainer = document.querySelector('.filters');

  filtersToggle.addEventListener('click', () => {
    filtersContainer.classList.toggle('active');
    document.querySelector('body').classList.toggle('dark');
  });

  const sortToggle = document.querySelector('.competitions-list__sort-button');
  const sortOptions = document.querySelector('.competitions-list__sort-list');

  sortToggle.addEventListener('click', () => {
    sortOptions.classList.toggle('active');
  });

  const sortLinks = sortOptions.querySelectorAll('a');
  sortLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const sortBy = event.target.dataset.sort;
      console.log(`Sorting by ${sortBy}`);
      sortOptions.style.display = 'none';
    });
  });
});
