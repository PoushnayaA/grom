import { iosVhFix } from './utils/ios-vh-fix';


import { initAccordions } from './modules/accordion/init-accordion';
import { createCalendar } from './modules/calendar/init-calendar';
import { findPerson } from './modules/search/init-search';
import { initSelect } from './modules/select/init-select';
import { initSwitch, openList } from './modules/switch/init-switch';
import { initPasswordButton } from './modules/password/init-password-button';
import { initFileUpload } from './modules/file-upload/init-file-upload';
import { initMasks } from './modules/masks/init-mask';
import { tableSort } from './modules/sorting-table/init-sorting-table';
import { initClubsFilter } from './modules/club/index';
import { initFeedback } from './modules/feedback/index';

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


  const selectedContainer = document.querySelector('.selected-items');
  let niceSelectInstance;

  function addToSelectedContainer(text, item, itemType) {
    if (selectedContainer) {
      if (selectedContainer.querySelector('[type="submit"]')) {
        selectedContainer.querySelector('[type="submit"]').classList.remove('visually-hidden')
      }

      if (itemType === 'radio' || itemType === 'region' || itemType === 'date') {
        removeExistingItem(itemType);
      }

      if (item.closest('[data-accordion="element"]')) {
        item.closest('[data-accordion="element"]').classList.add('is-active')
      }

      selectedContainer.classList.remove('visually-hidden');
      const selectedItem = document.createElement('div');
      selectedItem.classList.add('selected-item');
      selectedItem.dataset.text = text;
      selectedItem.dataset.itemType = itemType;

      if (itemType === 'date') {
        const selectedItemText = document.createElement('span');
        selectedItemText.textContent = text;
        selectedItem.appendChild(selectedItemText);
      } else {
        const selectedItemText = document.createElement('span');
        selectedItemText.textContent = text;
        selectedItem.appendChild(selectedItemText);
      }

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
        if (itemType === 'text') {
          radioButtons.forEach(radio => {
            radio.checked = false;
            removeFromSelectedContainer(radio.parentNode.textContent.trim(), radio.parentNode, niceSelectInstance);
          });
        }
      });

      selectedItem.appendChild(removeBtn);
      selectedContainer.appendChild(selectedItem);
    }
  }

  function removeFromSelectedContainer(text, item, niceSelectInstance) {
    if (selectedContainer) {

      if (selectedContainer.querySelector('[type="submit"]')) {
        selectedContainer.querySelector('[type="submit"]').classList.remove('visually-hidden')
      }

      const selectedItems = selectedContainer.querySelectorAll('.selected-item');
      selectedItems.forEach(selectedItem => {
        if (selectedItem.dataset.text === text) {
          selectedItem.remove();
          if (item.querySelector('input[type="checkbox"]')) {
            item.querySelector('input[type="checkbox"]').checked = false;
          } else if (item.querySelector('input[type="radio"]')) {
            item.querySelector('input[type="radio"]').checked = false;
          } else if (item.querySelector('input[type="text"]')) {
            item.querySelector('input[type="text"]').value = '';
          }
          if (item.querySelector('#region')) {
            const region = item.querySelector('#region');
            region.selectedIndex = -1;
            niceSelectInstance.update();
            if (niceSelectInstance) {
              niceSelectInstance.update();
              document.querySelector('.nice-select').querySelector('.current').style.color = "";
            }
          }
          if (selectedContainer.children.length === 2) {
            selectedContainer.classList.add('visually-hidden');
          }
        }
      });
    }
  }

  function removeExistingItem(itemType) {
    if (selectedContainer) {
      const existingItems = selectedContainer.querySelectorAll(`.selected-item[data-item-type="${itemType}"]`);
      existingItems.forEach(item => item.remove());
    }
  }

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

  //сортировка
  const sortToggle = document.querySelector('.competitions-list__sort-button');
  const sortOptions = document.querySelector('.competitions-list__sort-list');

  if (sortToggle && sortOptions) {
    sortToggle.addEventListener('click', () => {
      sortOptions.classList.toggle('active');
      sortToggle.querySelector('.arrow').classList.toggle('active')
    });

    if (sortOptions && sortOptions.querySelector('a.active').href.includes('sort=past')) {
      if (document.querySelector('.filter-dark-wrapper')) {
        document.querySelector('.filter-dark-wrapper').classList.add('visually-hidden')
      }
    }

    const sortLinks = sortOptions.querySelectorAll('a');
    sortLinks.forEach(link => {
      link.addEventListener('click', (event) => {
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

  window.addEventListener('resize', () => {
    const sortToggle = document.querySelector('.competitions-list__sort-button');
    const sortOptions = document.querySelector('.competitions-list__sort-list');
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

  //textarea
  function autoGrow(el) {
    el.style.height = el.scrollHeight + 'px';
  }

  const textAreas = document.querySelectorAll('textarea');
  if (textAreas) {

    textAreas.forEach(textArea => {
      textArea.style.height = '36px';
      textArea.addEventListener('input', function () {
        autoGrow(this);
      });
    })
  }

  //filter search
  const filterInput = document.querySelector('.filter-input');
  const filterList = document.querySelectorAll('.filter-item:not(.filter-item--transparent)');

  const inputDate = document.querySelector('input[data-input="range-date"]');
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  function setFormValues() {
    var urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach(function (value, key) {
      var checkboxes = document.querySelectorAll('input[type="checkbox"][name="' + key + '"]');
      var radioButtons = document.querySelectorAll('input[type="radio"][name="' + key + '"]');

      checkboxes.forEach(function (checkbox) {
        if (checkbox.value === value) {
          checkbox.checked = true;
          addToSelectedContainer(checkbox.parentNode.textContent.trim(), checkbox.parentNode, 'checkbox');
        }
      });

      radioButtons.forEach(function (radioButton) {
        if (radioButton.value === value) {
          radioButton.checked = true;
          addToSelectedContainer(radioButton.parentNode.textContent.trim(), radioButton.parentNode, 'radio');
        }
      });
    });

    const inputDate = document.querySelector('input[data-input="range-date"]');
    const dateValue = urlParams.get('input-date');
    if (inputDate && dateValue) {
      inputDate.value = dateValue;
      addToSelectedContainer(`Дата: ${dateValue}`, inputDate.parentNode, 'date');
    }

    const selectRegion = document.querySelector('select[name="region"]');
    const regionValue = urlParams.get('region');
    if (selectRegion) {
      niceSelectInstance = new NiceSelect(selectRegion, {
        searchable: true,
        placeholder: 'Регион/область',
        searchText: 'Начните поиск'
      });

      if (regionValue) {
        selectRegion.value = regionValue;
        niceSelectInstance.update();
        document.querySelector('.nice-select').querySelector('.current').style.color = "#2E2E2E";
        addToSelectedContainer(selectRegion.options[selectRegion.selectedIndex].text, selectRegion.parentNode, 'region');
      } else {
        selectRegion.value = '';
        niceSelectInstance.update();
        document.querySelector('.nice-select').querySelector('.current').style.color = "";
      }

      selectRegion.addEventListener('change', () => {
        if (selectRegion.value !== "") {
          document.querySelector('.nice-select').querySelector('.current').style.color = "#2E2E2E";
          addToSelectedContainer(selectRegion.options[selectRegion.selectedIndex].text, selectRegion.parentNode, 'region');
        } else {
          document.querySelector('.nice-select').querySelector('.current').style.color = "";
          selectRegion.value = '';
          removeFromSelectedContainer(selectRegion.options[selectRegion.selectedIndex].text, selectRegion.parentNode, niceSelectInstance);
        }
      });
    }

    if (filterList) {
      filterList.forEach(item => {
        const input = item.querySelector('input');
        if (input) {
          input.addEventListener('change', () => {
            const text = item.textContent.trim();
            if (input.checked) {
              addToSelectedContainer(text, item, input.type);
              if (input.type === 'radio') {
                removeFromSelectedContainer(`Дата: ${inputDate.value}`, inputDate.parentNode, niceSelectInstance);
              }
            } else {
              removeFromSelectedContainer(text, item, niceSelectInstance);
            }
          });
        }
      });
    }

    const textInput = document.querySelector('.filter-input');
    if (textInput && textInput.value && selectedContainer) {
      selectedContainer.classList.remove('visually-hidden');
      addToSelectedContainer(textInput.value, textInput.parentElement, 'text')
    }

    if (selectedContainer && selectedContainer.querySelector('[type="submit"]')) {
      selectedContainer.querySelector('[type="submit"]').classList.add('visually-hidden')
    }
  }

  window.addEventListener('load', setFormValues);

  //filter reset
  const select = document.getElementById('region');
  const resetButton = document.querySelector('.selected-container button[type="reset"]');

  if (resetButton) {
    resetButton.addEventListener('click', (event) => {
      const forms = document.querySelectorAll('form');
      forms.forEach((form) => {
        console.log(form.querySelectorAll('input'));
        form.querySelectorAll('input').forEach(i => i.value="")
        event.preventDefault();
        form.reset();
        select.value = '';
        if (select) {
          select.value = "";
          select.selectedIndex = -1;
          if (niceSelectInstance) {
            niceSelectInstance.update();
            document.querySelector('.nice-select').querySelector('.current').style.color = "";
          }
        }
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
    });
  }

  //filter item accordion
  setTimeout(initAccordions(), 1000);

  //фильтрация каталога
  const competitionItems = document.querySelectorAll('.competitions__item');
  const dateInput = document.querySelector('input[data-input="range-date"]');
  const pagination = document.querySelector('.pagination');

const suggestionList = document.getElementById('suggestion-list');
const competitionTitles = Array.from(document.querySelectorAll('.competitions__title')).map(title => title.textContent);

if (filterInput) {
  filterInput.addEventListener('input', function () {
    const filterText = this.value.toLowerCase();
    suggestionList.innerHTML = '';

    const matchingTitles = competitionTitles.filter(title => title.toLowerCase().includes(filterText));

    if (matchingTitles.length > 0) {
      matchingTitles.forEach(title => {
        const originalTitle = competitionTitles[competitionTitles.indexOf(title)];
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = originalTitle;
          suggestionItem.addEventListener('click', () => {
            filterInput.value = title;
            suggestionList.style.display = 'none';
          });
          suggestionList.appendChild(suggestionItem);
        });
        suggestionList.style.display = 'block';
      } else {
        suggestionList.style.display = 'none';
      }
    });
  }

  //календарь
  createCalendar();

  //клик на построннюю область
  document.addEventListener('click', (event) => {
    if (suggestionList) {
      if (!event.target.closest('.filter-container')) {
        suggestionList.style.display = 'none';
      }
    }

    if (document.querySelector('.competitions-list__sort-list')) {
      if (!event.target.closest('.competitions-list__sort-list') && !event.target.closest('.competitions-list__sort-button')) {
        document.querySelector('.competitions-list__sort-list').classList.remove('active');
        document.querySelector('.competitions-list__sort-button .arrow').classList.remove('active');
      }
    }

    if (document.querySelector('.menu')) {
      if (!event.target.closest('.menu') && !event.target.closest('header')) {
        document.querySelector('.menu').classList.remove('show');
        document.querySelector('body').classList.remove('dark');
        document.querySelector('.burger').classList.remove('active');
      }
    }
  });

  //Получаем элемент information-modal
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

  //переключатель
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

  //общий switch
  initSwitch();
  openList();

  //загрузка файла в форме регистрации на соревновании
  initFileUpload();

  //поиск людей в форме регистрации и при редактировании команды в заявке
  const search = document.querySelectorAll('.js-search');
  const peopleList = document.querySelector('.js-people-list');

  if (search && peopleList) {
    search.forEach(i => {
      const clonedList = peopleList.cloneNode(true);

      i.appendChild(clonedList);
    });
  }

  findPerson();


  //чекбоксы/радиобаттоны в форме регистрации
  initSelect();

  //редактирование фото в профиле
  const fileInput = document.querySelector('.profile-photo__input');
  const previewImg = document.querySelector('.profile-photo__preview img');
  let fileToUpload = null;

  if (fileInput) {
    fileInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        fileToUpload = file;
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
  }

  //показать пароль
  initPasswordButton();

  //маски
  initMasks();

  //таблица с возможности сортировки
  tableSort();

  //фильрация друзей и заявок
  const searchInputs = document.querySelectorAll('.switch-block');
  if (document.querySelector('.friend__list') && searchInputs) {
    searchInputs.forEach(searchInput => {
      const switchBlock = searchInput.closest('.switch-block');
      const friendList = switchBlock.querySelector('.friend__list');
      const friendItems = friendList.querySelectorAll('.friend__item');

      searchInput.addEventListener('input', filterFriends);
      function filterFriends() {
        const searchText = searchInput.querySelector('.filter-input-name').value.toLowerCase();
        friendItems.forEach(item => {
          const name = item.querySelector('.friend__name').textContent.toLowerCase();
          const date = item.querySelector('.friend__date').textContent.toLowerCase();

          if (name.includes(searchText) || date.includes(searchText)) {
            item.style.display = 'flex';
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      }
    })
  }

  //закрытие нотификейшена
  const closeAlertButtons = document.querySelectorAll('.js-alert-close');
  if (closeAlertButtons) {
    closeAlertButtons.forEach(closeAlertButton => {
      closeAlertButton.addEventListener('click', function () {
        const alert = closeAlertButton.closest('.alert');
        alert.classList.add('alert-fade-out');
        alert.addEventListener('animationend', function () {
          alert.remove();
        });
      });
    });
  }

  //текст на кнопке
  if (document.querySelectorAll('.js-text-sort-button').length > 0) {
    document.querySelectorAll('.js-text-sort-button').forEach(item => {
      item.addEventListener('click', event => {
        event.preventDefault();
        const sortValue = item.textContent;
        document.querySelector('.competitions-list__sort-button-text').textContent = sortValue;
      });
    });
  }

  //раскрывашка
  const openListButton = document.querySelector('.js-open-list');
  const switchForm = document.querySelector('.registration__switch-form');
  if (openListButton && radioButtons) {
    openListButton.addEventListener('click', function (event) {
      event.preventDefault();
      switchForm.style.display = switchForm.style.display === 'block' ? 'none' : 'block';
    });

    radioButtons.forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.checked) {
          const checkmark = this.nextElementSibling;
          const newText = checkmark.getAttribute('data-text-mobile');
          openListButton.textContent = newText;
        }
      });
    });
  }

  const tableResult = document.querySelector('.js-checkbox-listener');
  const specialResultLinks = document.querySelector('.js-visible-links');

  if (tableResult) {
    const checkboxes = tableResult.querySelectorAll('input[type="checkbox"]');

    if (checkboxes.length > 0) {
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
          const uncheckedCheckboxes = Array.from(checkboxes).filter(cb => !cb.checked);

          if (uncheckedCheckboxes.length === checkboxes.length) {
            specialResultLinks.classList.add('visually-hidden');
          } else {
            specialResultLinks.classList.remove('visually-hidden');
          }
        });
      });
    }
  }

  const splitPositionCheck = document.querySelector('.js-checkbox-more-inf');
  const splitPositionElements = document.querySelectorAll('.split-position');
  if (splitPositionCheck && splitPositionElements.length > 0) {
    splitPositionCheck.addEventListener('change', function () {
      if (splitPositionCheck.checked) {
        splitPositionElements.forEach(i => i.classList.remove('visually-hidden'));
      } else {
        splitPositionElements.forEach(i => i.classList.add('visually-hidden'));
      }
    })
  }

  //удаление человека в таблице сравнения
  const removeButtons = document.querySelectorAll('.js-table-remove-button');
  if (removeButtons.length > 0) {
    removeButtons.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        removeColumn(this);
      });
    });
  }

  function removeColumn(button) {
    const th = button.parentElement.parentElement;
    const columnIndex = th.cellIndex;
    const table = th.closest("table");
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
      rows[i].deleteCell(columnIndex);
    }
  }

  // инициализация фильтра списка клубов
  initClubsFilter();

  //поиск по таблице с результатами и участниками
  const searchInputTable = document.querySelector('.filter-input-name');
  const tableResults = document.querySelector('table');
  if (searchInputTable && tableResults) {
    searchTable();
  }

  function searchTable() {
    const thead = tableResults.querySelector('thead');
    const tbody = tableResults.querySelector('tbody');
    let columnWidths = [];

    function saveColumnWidths() {
      columnWidths = [];
      const headerRow = thead.querySelector('tr:last-child');
      const headerCells = headerRow.querySelectorAll('th');
      headerCells.forEach(cell => {
        columnWidths.push(cell.offsetWidth);
      });
    }

    function applyColumnWidths() {
      const headerRows = thead.querySelectorAll('tr');
      headerRows.forEach(row => {
        const headerCells = row.querySelectorAll('th');
        headerCells.forEach((cell, index) => {
          cell.style.width = columnWidths[index] + 'px';
        });
      });

      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
          cell.style.width = columnWidths[index] + 'px';
        });
      });
    }

    window.addEventListener('load', function () {
      saveColumnWidths();
      applyColumnWidths();
    });

    searchInputTable.addEventListener('input', function () {
      const filterText = this.value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');

      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let found = false;

        cells.forEach(cell => {
          if (cell.textContent.toLowerCase().includes(filterText)) {
            found = true;
          }
        });

        if (found) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  //открыть форму обратной связи
  initFeedback();

  //перестройка грид-контейнера
  const gridWrapper = document.querySelector('.user-form__wrapper--grid');
  if (gridWrapper) {
    if (gridWrapper.querySelectorAll('.user-form__block').length == 1) {
      gridWrapper.classList.add('user-form__wrapper--one-column');
    }
  }

  //добавление поля для ссылки
  const addLinkButton = document.querySelector('.js-add-link-field');
  let linkIndex = 1;

  if (addLinkButton) {
    addLinkButton.addEventListener('click', () => {
      const urlLabel = document.querySelector('.club-link-url').cloneNode(true);
      const textLabel = document.querySelector('.club-link-text').cloneNode(true);

      urlLabel.querySelector('input').name = `club-link-url-${linkIndex}`;
      textLabel.querySelector('input').name = `club-link-text-${linkIndex}`;

      urlLabel.querySelector('input').value = '';
      textLabel.querySelector('input').value = '';

      const fieldset = addLinkButton.closest('.user-form__fieldset');
      fieldset.insertBefore(urlLabel, addLinkButton);
      fieldset.insertBefore(textLabel, addLinkButton);

      linkIndex++;
    });
  }
});

