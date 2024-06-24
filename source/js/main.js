
import { iosVhFix } from './utils/ios-vh-fix';

import { initAccordions } from './modules/accordion/init-accordion';


window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();

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

  //клик на соревнование

  //filter-modal
  const filtersToggle = document.querySelector('.competitions-list__filter-mobile-button');
  const filtersContainer = document.querySelector('.filters');
  const filtersClose = document.querySelector('.filters__button-close');
  if (filtersToggle) {
    filtersToggle.addEventListener('click', () => {
      filtersContainer.classList.toggle('active');
      document.querySelector('body').classList.toggle('dark-modal');
    });
    filtersClose.addEventListener('click', () => {
      filtersContainer.classList.remove('active');
      document.querySelector('body').classList.remove('dark-modal');
    });
  }

  window.addEventListener('resize', () => {

    const windowWidth = window.innerWidth;

    if (windowWidth >= 768) {
      filtersContainer.classList.remove('active');
      document.querySelector('body').classList.remove('dark-modal');
    }
  });


  //sort
  function sortCompetitions(sortBy) {
    const competitionList = document.querySelectorAll('.competitions__item');
    var competitionItemsArray = Array.from(competitionList);

    if (sortBy === 'date') {
      competitionItemsArray.sort((a, b) => {
        const dateA = new Date(a.querySelector('[data-date]').getAttribute('data-date').split('.').reverse().join('-'));
        const dateB = new Date(b.querySelector('[data-date]').getAttribute('data-date').split('.').reverse().join('-'));
        return dateB.getFullYear() - dateA.getFullYear() || dateB.getMonth() - dateA.getMonth() || dateB.getDate() - dateA.getDate();
      });
    } else if (sortBy === 'popularity') {
      competitionItemsArray.sort((a, b) => {
        const popularityA = a.getAttribute('data-popularity');
        const popularityB = b.getAttribute('data-popularity');
        return popularityB - popularityA;
      });
    }

    const competitionsContainer = document.querySelector('.competitions');
    const fragment = document.createDocumentFragment();

    competitionItemsArray.forEach(item => {
      fragment.appendChild(item);
    });

    if (competitionsContainer) {
      competitionsContainer.innerHTML = '';
      competitionsContainer.appendChild(fragment);
    }
  }
  //при загрузке страницы изначально сортировка по популярности
  sortCompetitions('popularity');
  const sortToggle = document.querySelector('.competitions-list__sort-button');
  const sortOptions = document.querySelector('.competitions-list__sort-list');

  if (sortToggle && sortOptions) {
    sortToggle.addEventListener('click', () => {
      sortOptions.classList.toggle('active');
      sortToggle.querySelector('.arrow').classList.toggle('active')
    });

    const sortLinks = sortOptions.querySelectorAll('a');
  sortLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const sortBy = event.target.dataset.sort;
      sortCompetitions(sortBy);
      console.log(1);
      const windowWidth = window.innerWidth;
      if (windowWidth < 1440) {
        sortOptions.classList.toggle('active');
        sortToggle.querySelector('.arrow').classList.toggle('active')
      }

      sortLinks.forEach((l) => l.classList.remove('active'));
      event.target.classList.add('active');
    });
  });
  }



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

  //filter reset
const resetButton = document.querySelector('.selected-container button[type="reset"]');

if (resetButton) {
  resetButton.addEventListener('click', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.reset();
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    selectedContainer.classList.add('visually-hidden');
    const selectedItems = selectedContainer.querySelectorAll('.selected-item');
    selectedItems.forEach(i => i.remove())

    filterItems();
  });
}


  //filter item accordion
  setTimeout(initAccordions(), 1000);

  //submit form mobile
  const form = document.getElementById('filterForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      filtersContainer.classList.remove('active');
      document.querySelector('body').classList.remove('dark-modal');
    });
  }


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
      const region = item.querySelector('[data-region]').dataset.region;
      const itemDate = new Date(item.querySelector('[data-date]').dataset.date.split('.').reverse().join('-'));

      const matchesSeries = seriesFilter.length === 0 || seriesFilter.includes(series);
      const matchesDistance = distanceFilter.length === 0 || distanceFilter.some(filter => distances.includes(filter));
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(category);
      const matchesRegion = customSelectInput.value.length === 0 || customSelectInput.dataset.value === region;

      var matchesDate = inputDateFilter.length === 10 ? itemDate.toLocaleDateString('ru-RU') === inputDateFilter : selectedDateRanges.length === 0 || selectedDateRanges.some(range => isDateInRange(itemDate, range, 0));

      if (inputDateFilter.length === 21) {
        let [startDate, endDate] = inputDateFilter.split("-");
        const firstDay = new Date(startDate.split('.').reverse().join('-'));
        let start = new Date(startDate.replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1"));
        let end = new Date(endDate.replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1"));
        let diffInMs = end.getTime() - start.getTime();
        let range = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        matchesDate = isDateInRange(itemDate, range, firstDay);
      }


      if (matchesSeries && matchesDistance && matchesCategory && matchesDate && matchesRegion) {
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

  function isDateInRange(date, range, firstDay) {
    const rangeStr = range.toString();
    console.log(date, rangeStr);
    const today = new Date();
    const daysToAdd = parseInt(rangeStr, 10);
    var endDate;

    if (firstDay === 0) {
      endDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      return date >= today && date <= endDate;
    } else {
      endDate = new Date(firstDay.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      return date >= firstDay && date <= endDate;
    }
  }
if (dateInput) {
  dateInput.addEventListener('change', filterItems);
}


  //подсказки при воде названия в фильтре
  const suggestionList = document.getElementById('suggestion-list');
  const competitionTitles = Array.from(document.querySelectorAll('.competitions__title')).map(title => title.textContent.toLowerCase());

  if (filterInput) {
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
  }


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

  //подсказка региона
  const customSelect = document.querySelector('.custom-select');
  const customSelectInput = document.querySelector('.custom-select__input');
  const customSelectOptions = document.querySelectorAll('.custom-select__option');

  if (customSelectOptions) {
    customSelectOptions.forEach(option => {
      option.addEventListener('click', () => {
        customSelectInput.value = option.textContent;
        customSelectInput.dataset.value = option.dataset.value;
        filterItems();
        customSelect.querySelector('.custom-select__options').style.display = 'none';
        customSelect.querySelector('.arrow').classList.remove('active');
      });
    });
  }

if (customSelectInput) {
  customSelectInput.addEventListener('click', () => {
    if (customSelect.querySelector('.custom-select__options').style.display === 'block') {
      customSelect.querySelector('.custom-select__options').style.display = 'none';
      console.log(customSelect.querySelector('.arrow'));
      customSelect.querySelector('.arrow').classList.remove('active');
    } else {
      customSelect.querySelector('.custom-select__options').style.display = 'block';
      customSelect.querySelector('.arrow').classList.add('active');
      console.log(customSelect.querySelector('.arrow'));
    }
  });

  customSelectInput.addEventListener('input', () => {
    const searchText = customSelectInput.value.toLowerCase();
    const filteredOptions = Array.from(customSelectOptions).filter(option =>
      option.textContent.toLowerCase().includes(searchText)
    );
    customSelect.querySelector('.custom-select__options').style.display = filteredOptions.length > 0 ? 'block' : 'none';
    filteredOptions.forEach(option => {
      option.style.display = 'block';
    });
    Array.from(customSelectOptions).filter(option => !filteredOptions.includes(option)).forEach(option => {
      option.style.display = 'none';
    });
  });
}



  document.addEventListener('click', event => {
    if (!customSelect.contains(event.target)) {
      customSelect.querySelector('.custom-select__options').style.display = 'none';
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
    let startDate = null;
    let endDate = null;

    function formatDate(date) {
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    }

    function renderCalendar() {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() || 7; // Если воскресенье, считаем как 7
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

      daysContainer.innerHTML = '';

      // Добавляем пустые дни в начале
      for (let i = 1; i < firstDayOfMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('date-picker__day', 'date-picker__day--empty');
        daysContainer.appendChild(day);
      }

      // Заполняем дни месяца
      for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('date-picker__day');
        day.textContent = i;
        day.addEventListener('click', () => {
          selectDate(new Date(currentYear, currentMonth, i));
        });
        day.addEventListener('mouseover', () => {
          if (startDate && !endDate) {
            const dayDate = new Date(currentYear, currentMonth, i);
            if (dayDate >= startDate || dayDate <= startDate) {
              day.classList.add('is-hovered');
              const daysContainer = dateInput.querySelector('.date-picker__days');
              const days = daysContainer.querySelectorAll('.date-picker__day');
              days.forEach((dayElement) => {
                const elementDate = new Date(currentYear, currentMonth, parseInt(dayElement.textContent));
                if ((elementDate >= startDate && elementDate <= dayDate) || (elementDate <= startDate && elementDate >= dayDate)) {
                  dayElement.classList.add('is-in-range');
                }
              });
            }
          }
        });
        day.addEventListener('mouseout', () => {
          if (startDate && !endDate) {
            day.classList.remove('is-hovered');
            const daysContainer = dateInput.querySelector('.date-picker__days');
            const days = daysContainer.querySelectorAll('.date-picker__day');
            days.forEach((dayElement) => {
              dayElement.classList.remove('is-in-range');
            });
          }
        });

        const dayDate = new Date(currentYear, currentMonth, i);
        if (startDate && endDate) {
          if ((dayDate >= startDate && dayDate <= endDate) || (dayDate <= startDate && dayDate >= endDate)) {
            day.classList.add('is-in-range');
          }
          if (dayDate.getDate() === startDate.getDate() && dayDate.getMonth() === startDate.getMonth() && dayDate.getFullYear() === startDate.getFullYear()) {
            day.classList.add('is-start-date');
          }
          if (dayDate.getDate() === endDate.getDate() && dayDate.getMonth() === endDate.getMonth() && dayDate.getFullYear() === endDate.getFullYear()) {
            day.classList.add('is-end-date');
          }
        } else if (startDate) {
          if (dayDate.getDate() === startDate.getDate() && dayDate.getMonth() === startDate.getMonth() && dayDate.getFullYear() === startDate.getFullYear()) {
            day.classList.add('is-start-date');
          }
        }

        daysContainer.appendChild(day);
      }

      dateInput.querySelector('.date-picker__current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    function selectDate(date) {
      if (!startDate) {
        startDate = date;
        input.value = formatDate(startDate);
        renderCalendar();
      } else if (!endDate) {
        endDate = date;
        if (endDate < startDate) {
          [startDate, endDate] = [endDate, startDate];
        }
        input.value = `${formatDate(startDate)}-${formatDate(endDate)}`;
        calendar.style.display = 'none';
        renderCalendar();
        filterItems();
      } else {
        startDate = date;
        endDate = null;
        input.value = formatDate(startDate);
        renderCalendar();
      }
    }

    button.addEventListener('click', () => {
      if (calendar.style.display === 'block') {
        calendar.style.display = 'none';
      } else {
        calendar.style.display = 'block';
      }
    });

    input.addEventListener('click', () => {
      if (calendar.style.display === 'block') {
        calendar.style.display = 'none';
      } else {
        calendar.style.display = 'block';
      }
    });

    document.addEventListener('click', (event) => {
      if (!dateInput.contains(event.target) && !event.target.classList.contains('date-picker__day')) {
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













})
