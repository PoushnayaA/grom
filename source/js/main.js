
import { iosVhFix } from './utils/ios-vh-fix';
import { initModals } from './modules/modals/init-modals';
import { Form } from './modules/form-validate/form';


import { initAccordions } from './modules/accordion/init-accordion';


window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();
  window.addEventListener('load', () => {
    initModals();
    const form = new Form();
    window.form = form;
    form.init();
  });

  //menu
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

  //filter-modal
  const filtersToggle = document.querySelector('.competitions-list__filter-mobile-button');
  const filtersContainer = document.querySelector('.filters');
  const filtersClose = document.querySelector('.filters__button-close');
  filtersToggle.addEventListener('click', () => {
    filtersContainer.classList.toggle('active');
    document.querySelector('body').classList.toggle('dark-modal');
  });
  filtersClose.addEventListener('click', () => {
    filtersContainer.classList.remove('active');
    document.querySelector('body').classList.remove('dark-modal');
  });
  window.addEventListener('resize', () => {

    const windowWidth = window.innerWidth;

    if (windowWidth >= 768) {
      filtersContainer.classList.remove('active');
      document.querySelector('body').classList.remove('dark-modal');
    }
  });


  //sort
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
      const windowWidth = window.innerWidth;
      if (windowWidth < 1440) {
        sortOptions.classList.toggle('active');
    sortToggle.querySelector('.arrow').classList.toggle('active')
      }
    });
  });

  window.addEventListener('resize', () => {

    const windowWidth = window.innerWidth;

    if (windowWidth >= 1440) {
      sortOptions.classList.remove('active');
    sortToggle.querySelector('.arrow').classList.remove('active')
    }
  });


  //card address
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

  //registration button
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

  //filter search
  const filterInput = document.querySelector('.filter-input');
  const filterList = document.querySelectorAll('.filter-item');
  const selectedContainer = document.querySelector('.selected-items');

  //filter checkbox + add container
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
    filterItems();
    selectedContainer.classList.remove('visually-hidden');
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    selectedItem.dataset.text = text; // Сохраняем текст в data-атрибуте

    const selectedItemText = document.createElement('span');
    selectedItemText.textContent = text;

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-btn');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '10');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.setAttribute('fill', 'none');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M1 1L9 9M9 1L1 9');
    path.setAttribute('stroke', '#999999');
    svg.appendChild(path);
    removeBtn.appendChild(svg);
    removeBtn.addEventListener('click', () => {
      removeFromSelectedContainer(text, item);
      item.querySelector('input').checked = false;
      filterItems();
    });

    selectedItem.appendChild(selectedItemText);
    selectedItem.appendChild(removeBtn);
    selectedContainer.appendChild(selectedItem);
  }
  function removeFromSelectedContainer(text, item) {
    filterItems();
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

  //filter item accordion
  setTimeout(initAccordions(), 1000);

  //submit form mobile
  const form = document.getElementById('filterForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    filtersContainer.classList.remove('active');
    document.querySelector('body').classList.remove('dark-modal');
  });

  //фильтрация каталога
  const competitionItems = document.querySelectorAll('.competitions__item');
  const dateInput = document.querySelector('input[name="input-date[]"]');
  const pagination = document.querySelector('.pagination');

  function filterItems() {
    const seriesFilter = Array.from(document.querySelector('#filter-series').querySelectorAll('input:checked')).map(el => el.value);
    const distanceFilter = Array.from(document.querySelector('#filter-distance').querySelectorAll('input:checked')).map(el => el.value);
    const categoryFilter = Array.from(document.querySelector('#filter-category').querySelectorAll('input:checked')).map(el => el.value);
    const inputDateFilter = dateInput.value;
    const selectedDateRanges = Array.from(document.querySelectorAll('input[name="date[]"]:checked')).map(input => input.value);

    let visibleItems = 0;

    competitionItems.forEach(item => {
      item.classList.remove('hidden');
      const series = item.dataset.series;
      const distances = Array.from(item.querySelectorAll('[data-distance]')).map(el => el.dataset.distance);
      const category = item.querySelector('[data-category]').dataset.category;
      const itemDate = new Date(item.querySelector('[data-date]').dataset.date.split('.').reverse().join('-'));

      const matchesSeries = seriesFilter.length === 0 || seriesFilter.includes(series);
      const matchesDistance = distanceFilter.length === 0 || distanceFilter.some(filter => distances.includes(filter));
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(category);
      const matchesDate = inputDateFilter.length === 10 ? itemDate.toLocaleDateString('ru-RU') === inputDateFilter : selectedDateRanges.length === 0 || selectedDateRanges.some(range => isDateInRange(itemDate, range));

      if (matchesSeries && matchesDistance && matchesCategory && matchesDate) {
        item.classList.remove('hidden');
        visibleItems++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (visibleItems === 0) {
      pagination.classList.add('visually-hidden');
    } else {
      pagination.classList.remove('visually-hidden');
    }
  }


  function isDateInRange(date, range) {
    const today = new Date();
    const daysToAdd = parseInt(range, 10);
    const endDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    return date >= today && date <= endDate;
  }

  dateInput.addEventListener('input', filterItems);

  //подсказки при воде названия в фильтре
  const suggestionList = document.getElementById('suggestion-list');
  const competitionTitles = Array.from(document.querySelectorAll('.competitions__title')).map(title => title.textContent.toLowerCase());

  filterInput.addEventListener('input', function () {
    const filterText = this.value.toLowerCase();
    suggestionList.innerHTML = '';

    const matchingTitles = competitionTitles.filter(title => title.includes(filterText));

    if (matchingTitles.length > 0) {
      matchingTitles.forEach(title => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = title;
        suggestionItem.addEventListener('click', () => {
          filterInput.value = title;
          suggestionList.style.display = 'none';
          filterCompetitions(title.toLowerCase());
        });
        suggestionList.appendChild(suggestionItem);
      });
      suggestionList.style.display = 'block';
    } else {
      suggestionList.style.display = 'none';
    }

    filterCompetitions(filterText);
  });

  function filterCompetitions(filterText) {
    competitionItems.forEach(item => {
      const title = item.querySelector('.competitions__title').textContent.toLowerCase();
      if (title.includes(filterText)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  //клик на построннюю область
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.filter-container')) {
      suggestionList.style.display = 'none';
    }

    if (!event.target.closest('.competitions-list__sort-list') && !event.target.closest('.competitions-list__sort-button')) {
      document.querySelector('.competitions-list__sort-list').classList.remove('active');
      document.querySelector('.competitions-list__sort-button .arrow').classList.remove('active');
    }

    if (!event.target.closest('.menu') && !event.target.closest('header')) {
      document.querySelector('.menu').classList.remove('show');
      document.querySelector('body').classList.remove('dark');
      document.querySelector('.burger').classList.remove('active');
    }
  });

  //календарь
  const dateInputs = document.querySelectorAll('.date-input');

  dateInputs.forEach((dateInput) => {
    const input = dateInput.querySelector('input[name="input-date[]"]');
    const button = dateInput.querySelector('.date-input__btn');
    const calendar = dateInput.querySelector('.date-picker__calendar');
    const prevMonthButton = dateInput.querySelector('.date-picker__prev-month');
    const nextMonthButton = dateInput.querySelector('.date-picker__next-month');
    const daysContainer = dateInput.querySelector('.date-picker__days');

    let currentDate = new Date();
    let selectedDate = null;

    function formatDate(date) {
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    }

    function renderCalendar() {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      daysContainer.innerHTML = '';

      for (let i = 0; i < firstDayOfMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('date-picker__day');
        daysContainer.appendChild(day);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('date-picker__day');
        day.textContent = i;
        day.addEventListener('click', () => {
          selectDate(new Date(currentYear, currentMonth, i));
        });
        if (selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear) {
          day.classList.add('is-selected');
        }
        daysContainer.appendChild(day);
      }

      dateInput.querySelector('.date-picker__current-month').textContent = `${currentMonth + 1}/${currentYear}`;
    }

    function selectDate(date) {
      selectedDate = date;
      input.value = formatDate(selectedDate);
      calendar.style.display = 'none';
      filterItems();
    }

    button.addEventListener('click', () => {
      if (calendar.style.display === 'block') {
        calendar.style.display = 'none';
      } else {
        calendar.style.display = 'block';
      }
    });

    document.addEventListener('click', (event) => {
      if (!dateInput.contains(event.target) || event.target.classList.contains('date-picker__day')) {
        calendar.style.display = 'none';
      }
    });

    prevMonthButton.addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      renderCalendar();
    });

    renderCalendar();
  });

})
