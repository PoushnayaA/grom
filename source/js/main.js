import IMask from 'imask';
import { iosVhFix } from './utils/ios-vh-fix';
import { initModals } from './modules/modals/init-modals';
import { Form } from './modules/form-validate/form';


import { initAccordions } from './modules/accordion/init-accordion';

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

  setTimeout(initAccordions(), 1000);

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
    document.querySelector('body').classList.toggle('dark-modal');
  });

  window.addEventListener('resize', () => {

    const windowWidth = window.innerWidth;

    if (windowWidth >= 768) {
      filtersContainer.classList.remove('active');
      document.querySelector('body').classList.remove('dark-modal');
    }
  });

  const sortToggle = document.querySelector('.competitions-list__sort-button');
  const sortOptions = document.querySelector('.competitions-list__sort-list');

  sortToggle.addEventListener('click', () => {
    sortOptions.classList.toggle('active');
    sortToggle.querySelector('.arrow').classList.toggle('active')
  });

  const sortLinks = sortOptions.querySelectorAll('a');
  sortLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const sortBy = event.target.dataset.sort;
      sortOptions.style.display = 'none';
    });
  });

  const addressElements = document.querySelectorAll('.competitions__address');

  function updateAddresses() {
    const windowWidth = window.innerWidth;

    addressElements.forEach(addressElement => {
      const shortAddress = addressElement.dataset.addressMobile;
      const longAddress = addressElement.dataset.addressDesktop;
      addressElement.textContent = windowWidth >= 1440 ? longAddress : shortAddress;
    });
  }

  updateAddresses();
  window.addEventListener('resize', updateAddresses);

  const competitionsButtons = document.querySelectorAll('.competitions__buttons');
  competitionsButtons.forEach(button => {
    const buttonRegistration = button.querySelector('a').getAttribute('data-button-registration');
    const priceElement = button.querySelector('p');
    if (buttonRegistration == 'over' || buttonRegistration == 'registration-completed') {
      priceElement.style.display = 'none';
    } else if (buttonRegistration == 'registration-active') {
      priceElement.style.display = 'block';
    }
  });

  const filterInput = document.querySelector('.filter-input');
  const filterListSearch = document.getElementById('filter-category').querySelectorAll('.filter-item');
  const filterList = document.querySelectorAll('.filter-item');
  const selectedContainer = document.querySelector('.selected-items');

  filterInput.addEventListener('input', () => {
    const searchTerm = filterInput.value.toLowerCase();
    filterListSearch.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });

  filterList.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      const text = item.textContent;
      if (checkbox.checked) {
        addToSelectedContainer(text, item);
      } else {
        removeFromSelectedContainer(text, item);
      }
    });
  });

  function addToSelectedContainer(text, item) {
    selectedContainer.classList.remove('visually-hidden');
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    selectedItem.dataset.text = text; // Сохраняем текст в data-атрибуте

    const selectedItemText = document.createElement('span');
    selectedItemText.textContent = text;

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-btn');

    // Создаем SVG элемент
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '10');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.setAttribute('fill', 'none');

    // Создаем SVG path элемент
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M1 1L9 9M9 1L1 9');
    path.setAttribute('stroke', '#999999');
    svg.appendChild(path);
    removeBtn.appendChild(svg);

    removeBtn.addEventListener('click', () => {
      removeFromSelectedContainer(text, item);
    });

    selectedItem.appendChild(selectedItemText);
    selectedItem.appendChild(removeBtn);
    selectedContainer.appendChild(selectedItem);
  }

  function removeFromSelectedContainer(text, item) {
    const selectedItems = selectedContainer.querySelectorAll('.selected-item');
    selectedItems.forEach(selectedItem => {
      if (selectedItem.dataset.text === text) {
        selectedItem.remove();
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.checked = false;

        if (document.querySelectorAll('.selected-item').length === 0) {
          selectedContainer.classList.add('visually-hidden');
        }
      }
    });


  }






  const dateInputField = document.querySelector('.date-input__field');
  const dateInputBtn = document.querySelector('.date-input__btn');


  new Cleave(dateInputField, {
    date: true,
    datePattern: ['d', 'm', 'Y'],
    delimiter: '.',
    blocks: [2, 2, 4],
    maxLength: 10,

  });



dateInputBtn.addEventListener('click', (event) => {
  event.preventDefault();
  dateInputField.showPicker();
});













    const form = document.getElementById('filterForm');

    form.addEventListener('submit', (event) => {
      // event.preventDefault();
    });

    form.querySelector('button').addEventListener('click', (event) => {
      event.preventDefault();
    })

});
