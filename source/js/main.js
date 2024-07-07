
import { iosVhFix } from './utils/ios-vh-fix';

import { initAccordions } from './modules/accordion/init-accordion';

import NiceSelect from './../js/vendor/nice-select2';


window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();

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

    if (windowWidth >= 768 && filtersContainer) {
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
    const competitionPage = document.querySelector('.competition');
    const fragment = document.createDocumentFragment();

    if (competitionsContainer && !competitionPage) {
      competitionItemsArray.forEach(item => {
        fragment.appendChild(item);
      });
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

    if (windowWidth >= 1440 && sortOptions) {
      sortOptions.classList.remove('active');
      sortToggle.querySelector('.arrow').classList.remove('active')
    }
  });

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

  function addToSelectedContainer(text, item) {

    selectedContainer.classList.remove('visually-hidden');
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    selectedItem.dataset.text = text;

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
      removeFromSelectedContainer(text, item, niceSelectInstance);
      item.querySelector('input').checked = false;
    });

    selectedItem.appendChild(selectedItemText);
    selectedItem.appendChild(removeBtn);
    selectedContainer.appendChild(selectedItem);
  }
  function removeFromSelectedContainer(text, item, niceSelectInstance) {
    const selectedItems = selectedContainer.querySelectorAll('.selected-item');
    selectedItems.forEach(selectedItem => {
      if (selectedItem.dataset.text === text) {
        selectedItem.remove();

        if (item.querySelector('input[type="checkbox"]')) {
          const checkbox = item.querySelector('input[type="checkbox"]');
          checkbox.checked = false;
        }
        if (item.querySelector('input[type="radio"]')) {
          const radio = item.querySelector('input[type="radio"]');
          radio.checked = false;
        }
        if (item.querySelector('input[type="text"]')) {
          const text = item.querySelector('input[type="text"]');
          text.value = '';
        }
        if (item.querySelector('#region')) {
          const region = item.querySelector('#region');
          region.selectedIndex = -1; // Сбросить выбранный option
          if (niceSelectInstance) {
            niceSelectInstance.update();
            document.querySelector('.nice-select').querySelector('.current').style.color = "";
          }
        }

        if (document.querySelectorAll('.selected-item').length === 0) {
          selectedContainer.classList.add('visually-hidden');
        } else {
          selectedContainer.classList.remove('visually-hidden');
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
        select.value = '';
      });

      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      const radioInputs = document.querySelectorAll('input[type="radio"]');
      radioInputs.forEach((radioInput) => {
        radioInput.checked = false;
      });
      selectedContainer.classList.add('visually-hidden');

      const selectedItems = selectedContainer.querySelectorAll('.selected-item');
      selectedItems.forEach(i => i.remove())

      filterItems();
    });
  }

  const select = document.getElementById('region');
  let niceSelectInstance;

  function setFormValues() {
    var urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach(function (value, key) {
      var checkboxes = document.querySelectorAll('input[type="checkbox"][name="' + key + '"]');
      var radioButtons = document.querySelectorAll('input[type="radio"][name="' + key + '"]');

      checkboxes.forEach(function (checkbox) {
        if (checkbox.value === value) {
          checkbox.checked = true;
          addToSelectedContainer(checkbox.parentNode.textContent.trim(), checkbox.parentNode);
        }
      });

      radioButtons.forEach(function (radioButton) {
        if (radioButton.value === value) {
          radioButton.checked = true;
          addToSelectedContainer(radioButton.parentNode.textContent.trim(), radioButton.parentNode);
        }
      });
    });

    var inputDate = document.querySelector('input[name="input-date"]');
    var dateValue = urlParams.get('input-date');
    if (inputDate && dateValue) {
      inputDate.value = dateValue;
      addToSelectedContainer('Дата: ' + dateValue, inputDate.parentNode);
    }

    var selectRegion = document.querySelector('select[name="region"]');
    var regionValue = urlParams.get('region');

    if (select) {
      niceSelectInstance = new NiceSelect(select, {
        searchable: true,
        placeholder: 'Регион/область',
        searchText: 'Начните поиск'
      });

      if (selectRegion && regionValue) {
        selectRegion.value = regionValue;
        niceSelectInstance.update();
        document.querySelector('.nice-select').querySelector('.current').style.color = "#2E2E2E";
        addToSelectedContainer(selectRegion.options[selectRegion.selectedIndex].text, selectRegion.parentNode);
      } else {
        selectRegion.value = '';
        niceSelectInstance.update();
        document.querySelector('.nice-select').querySelector('.current').style.color = "";
      }

      select.addEventListener('change', () => {
        if (select.value !== "") {
          document.querySelector('.nice-select').querySelector('.current').style.color = "#2E2E2E";
          addToSelectedContainer(selectRegion.options[selectRegion.selectedIndex].text, selectRegion.parentNode);
        } else {
          document.querySelector('.nice-select').querySelector('.current').style.color = "";
          removeFromSelectedContainer(selectRegion.options[selectRegion.selectedIndex].text, selectRegion.parentNode);
        }
      });
    }

    filterList.forEach(item => {
      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', () => {
        const text = item.textContent.trim();
        if (checkbox.checked) {
          addToSelectedContainer(text, item);
        } else {
          removeFromSelectedContainer(text, item);
        }
      });
    });
  }

  window.addEventListener('load', setFormValues);

  //filter item accordion
  setTimeout(initAccordions(), 1000);


  //фильтрация каталога
  const competitionItems = document.querySelectorAll('.competitions__item');
  const dateInput = document.querySelector('input[name="input-date"]');
  const pagination = document.querySelector('.pagination');


  function filterItems() {
    const seriesFilter = Array.from(document.querySelector('#filter-series').querySelectorAll('input:checked')).map(el => el.value);
    const distanceFilter = Array.from(document.querySelector('#filter-distance').querySelectorAll('input:checked')).map(el => el.value);
    const categoryFilter = Array.from(document.querySelector('#filter-category').querySelectorAll('input:checked')).map(el => el.value);
    const inputDateFilter = dateInput.value;
    const customSelectInput = Array.from(document.querySelector('#filter-place').querySelectorAll('option:checked')).map(el => el.value);
    const selectedDateRanges = Array.from(document.querySelector('input[name="date"]')).map(input => input.value);

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
      const matchesRegion = customSelectInput.length === 0 || customSelectInput.value === region;

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
      document.querySelector('.list-container__nothing').classList.remove('visually-hidden');
    } else {
      pagination.classList.remove('visually-hidden');
      document.querySelector('.list-container__nothing').classList.add('visually-hidden');
    }
  }

  function isDateInRange(date, range, firstDay) {
    const rangeStr = range.toString();
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


  //календарь
  const dateInputs = document.querySelectorAll('.date-input');
  dateInputs.forEach((dateInput) => {
    const input = dateInput.querySelector('input[name="input-date"]');
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
    if (suggestionList) {
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
    }
  });

  // Получаем элемент information-modal
  const informationModal = document.querySelector('.information-modal');

  let isModalVisible = true;
  let prevScrollPos = window.pageYOffset;

  let hiddenModalTop = 0;
  if (informationModal) {
    window.addEventListener('scroll', openInformationModal);
    window.addEventListener('load', openInformationModal);
    window.addEventListener('resize', openInformationModal);
  }

  function openInformationModal() {
    let modalHeight = informationModal.offsetHeight;
    let modalTop = informationModal.getBoundingClientRect().top;
    const modalTopStart = informationModal.getBoundingClientRect().top;

    const windowWidth = window.innerWidth;
    const currentScrollPos = window.pageYOffset;
    const windowHeight = window.innerHeight;
    if (informationModal) {
      if (modalTop + modalHeight < windowHeight) {
        informationModal.classList.add('none');
        isModalVisible = false;
      }
      if (windowWidth < 768) {
        if (currentScrollPos > prevScrollPos && modalTop + modalHeight <= windowHeight) {
          hiddenModalTop = modalTop;
          informationModal.classList.add('none');
          isModalVisible = false;
        } else if (currentScrollPos <= modalTopStart) {
          informationModal.classList.remove('none');
          isModalVisible = true;
        }

        prevScrollPos = currentScrollPos;
        modalTop = informationModal.getBoundingClientRect().top;
      } else {
        informationModal.classList.remove('none');
        isModalVisible = true;
      }
    }
  }

  window.addEventListener('resize', closeModal);

  function closeModal() {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 768 && document.querySelector('.information-modal')) {
      document.querySelector('.information-modal').classList.remove('mobile-modal');
      document.querySelector('body').classList.remove('dark-modal');
    }
  }

  const moreButton = document.querySelector('.information-modal__more');
  if (moreButton) {
    moreButton.addEventListener('click', function () {
      document.querySelector('.information-modal').classList.add('mobile-modal');
      document.querySelector('body').classList.add('dark-modal');
    })
  }

  const closeModalButton = document.querySelector('.information-modal__close');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', function () {
      document.querySelector('.information-modal').classList.remove('mobile-modal');
      document.querySelector('body').classList.remove('dark-modal');
    })
  }

  const disabledSlot = document.querySelector('[data-state="disabled"]');
  if (disabledSlot) {
    disabledSlot.parentElement.style.backgroundColor = "#f3f4f6"
  }

  const buttonLike = document.querySelector('[data-button="add-like"]');
  if (buttonLike) {
    buttonLike.addEventListener('click', function (event) {
      event.preventDefault();
      if (buttonLike.parentElement.parentElement.getAttribute('data-like') === 'true') {
        buttonLike.parentElement.parentElement.setAttribute('data-like', 'false');
      } else {
        buttonLike.parentElement.parentElement.setAttribute('data-like', 'true');
      }
    })
  }

  //lazy load
  function addLazyLoadingToImages() {
    const images = document.querySelectorAll('img');
    if (images) {
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }

    const sources = document.querySelectorAll('source');
    if (sources) {
      sources.forEach(source => {
        source.setAttribute('loading', 'lazy');
      });
    }

    const iframes = document.querySelectorAll('source');
    if (iframes) {
      iframes.forEach(iframe => {
        iframe.setAttribute('loading', 'lazy');
      });
    }
  }

  window.addEventListener('load', addLazyLoadingToImages);

  //авторизация
  const switchLogin = document.querySelector('.authorization__switch');
  const authorizationLogin = document.querySelector('.authorization__login');
  const authorizationRegistration = document.querySelector('.authorization__registration');

  function switchSection(section) {
    if (switchLogin) {
      if (section === 'login') {
        authorizationLogin.classList.remove('visually-hidden');
        authorizationRegistration.classList.add('visually-hidden');
        switchLogin.querySelector('button[data-button="login"]').classList.add('active');
        switchLogin.querySelector('button[data-button="registration"]').classList.remove('active');
      } else {
        authorizationLogin.classList.add('visually-hidden');
        authorizationRegistration.classList.remove('visually-hidden');
        switchLogin.querySelector('button[data-button="registration"]').classList.add('active');
        switchLogin.querySelector('button[data-button="login"]').classList.remove('active');
      }
    }
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    switchSection(hash);
  });

  const hash = window.location.hash.slice(1) || 'login';
  switchSection(hash);

  if (switchLogin) {
    switchLogin.querySelectorAll('button').forEach(buttonSwitch => {
      buttonSwitch.addEventListener('click', function () {
        const dataButton = this.getAttribute('data-button');
        window.location.hash = dataButton;
      });
    });
  }

  //валидация
  const forms = document.querySelectorAll('.user-form');

  const EMAIL_REGEXP = /^[^@\s]+@[^@\s]+\.[^@\s]+$/iu;

  function validateField(field) {
    const label = field.closest('label');
    const errorMessage = label.querySelector('.error-message');

    if (errorMessage) {
      if (['user-name', 'user-surname'].includes(field.name)) {
        const newValue = field.value.replace(/\d/g, '');
        if (newValue !== field.value) {
          field.value = newValue;
        }
      }

      if (field.name === 'user-email' && !EMAIL_REGEXP.test(field.value)) {
        errorMessage.classList.remove('visually-hidden');
        field.classList.add('error')
        return false;
      } else {
        errorMessage.classList.add('visually-hidden');
        field.classList.remove('error')
      }

      if (field.name === 'user-password-repeat') {
        const passwordField = field.closest('form').querySelector('input[name="user-password"]');
        if (passwordField && field.value !== passwordField.value) {
          errorMessage.classList.remove('visually-hidden');
          field.classList.add('error')
          return false;
        } else {
          errorMessage.classList.add('visually-hidden');
          field.classList.remove('error')
        }
      }


      if (field.parentElement.querySelector('.necessary')) {
        if (field.value == '') {
          errorMessage.classList.remove('visually-hidden');
          field.classList.add('error')
          return false;
        } else {
          errorMessage.classList.add('visually-hidden');
          field.classList.remove('error')
        }
      }


// console.log(form);
      // form.querySelectorAll('.necessary').forEach((label) => {
      //   const field = label.parentElement.parentElement.querySelector('input');
      //   if (field.value.trim() === '') {
      //     areAllNecessaryFieldsFilled = false;
      //   }
      // });


    }

    return true;
  }

  forms.forEach((form) => {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.classList.add('disabled');

    form.querySelectorAll('input').forEach((field) => {
      field.addEventListener('input', () => {
        const isFieldValid = validateField(field);
        const errorMessage = field.closest('label').querySelector('.error-message');

        if (errorMessage) {
          if (isFieldValid) {
            errorMessage.classList.add('visually-hidden');
            field.classList.remove('error')
          } else {
            errorMessage.classList.remove('visually-hidden');
            field.classList.add('error')
          }
        }

        let areAllNecessaryFieldsFilled = true;
        form.querySelectorAll('.necessary').forEach((label) => {
          const field = label.parentElement.parentElement.querySelector('input');
          if (field.value.trim() === '') {
            areAllNecessaryFieldsFilled = false;
          }
        });

        let areAllErrorMessagesHidden = true;
        form.querySelectorAll('.error-message').forEach((message) => {
          if (!message.classList.contains('visually-hidden')) {
            areAllErrorMessagesHidden = false;
          }
        });

        const checkbox = form.querySelector('input[type="checkbox"]');

        if (checkbox) {
          if (areAllNecessaryFieldsFilled && areAllErrorMessagesHidden && checkbox.checked) {
            submitButton.classList.remove('disabled');
            submitButton.classList.add('active');
          } else {
            submitButton.classList.remove('active');
            submitButton.classList.add('disabled');
          }
        } else {
          if (areAllNecessaryFieldsFilled && areAllErrorMessagesHidden) {
            submitButton.classList.remove('disabled');
            submitButton.classList.add('active');
          } else {
            submitButton.classList.remove('active');
            submitButton.classList.add('disabled');
          }
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!submitButton.classList.contains('disabled')) {
        let isFormValid = true;
        form.querySelectorAll('input').forEach((field) => {
          if (!validateField(field)) {
            isFormValid = false;
          }
        });

        if (isFormValid) {
          form.submit();
        } else {
          form.querySelectorAll('.error-message').forEach((message) => {
            message.classList.remove('visually-hidden');
          });
        }
      }
    });
  });
})
