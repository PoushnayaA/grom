import AirDatepicker from 'air-datepicker';

function createCalendar() {
  const selectedContainer = document.querySelector('.selected-items');

function addToSelectedContainerCalendar(text, item, itemType) {
  if (selectedContainer) {
    if (itemType === 'radio' || itemType === 'region' || itemType === 'date') {
      removeExistingItem(itemType);
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
      removeFromSelectedContainerCalendar(text, item);
      if (itemType === 'text') {
        radioButtons.forEach(radio => {
          radio.checked = false;
          removeFromSelectedContainerCalendar(radio.parentNode.textContent.trim(), radio.parentNode);
        });
      } else if (itemType === 'radio') {
        removeFromSelectedContainerCalendar(`Дата: ${inputDate.value}`, inputDate.parentNode);
      }
    });

    selectedItem.appendChild(removeBtn);
    selectedContainer.appendChild(selectedItem);
    console.log('функция addToSelectedContainerCalendar отработала');
  }
}

function removeFromSelectedContainerCalendar(text, item) {
  if (selectedContainer) {
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
        if (selectedContainer.children.length === 1) {
          selectedContainer.classList.add('visually-hidden');
        }
      }

    });
    console.log('функция removeFromSelectedContainerCalendar отработала');
  }
}
function removeExistingItem(itemType) {
  if (selectedContainer) {
    const existingItems = selectedContainer.querySelectorAll(`.selected-item[data-item-type="${itemType}"]`);
    existingItems.forEach(item => item.remove());
  }
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}

  const rangeDateInput = document.querySelectorAll('[data-input="range-date"]');
  const dateInput = document.querySelectorAll('[data-input="simple-date"]');

  if (rangeDateInput.length > 0) {
    rangeDateInput.forEach(date => {
      if (date.dataset.initialized === "true") return;

      let startDate = null;
      let endDate = null;

      const datePicker = new AirDatepicker(date, {
        range: true,
        multipleDatesSeparator: ' – ',
        position: 'top right',
        autoClose: true,
        container: '.date-picker',
        selectedDates: startDate && endDate ? [startDate, endDate] : [],
        onSelect: function () {
          console.log(date.value);
          if (date.value !== "") {
            addToSelectedContainerCalendar(`Дата: ${date.value}`, date.parentNode, 'date');
            const filterList = document.querySelectorAll('.filter-item');
            if (filterList) {
              filterList.forEach(item => {
                const input = item.querySelector('input[type="radio"]');
                if (input) {
                  input.checked = false;
                  const text = item.textContent.trim();
                  removeFromSelectedContainerCalendar(text, item, input.type);
                }
              });
            }
          }

          date.dispatchEvent(new Event('change'));
          date.dispatchEvent(new Event('input'));
        },
      });

      // Обработчик для обновления календаря при изменении радио-кнопки
      const filterList = document.querySelectorAll('.filter-item');
      if (filterList) {
        filterList.forEach(item => {
          const input = item.querySelector('input[type="radio"]');
          if (input) {
            input.addEventListener('change', function () {
              input.checked = true;
              const valueToAdd = parseInt(input.value, 10);
              const today = new Date();
              const newDate = new Date(today);
              newDate.setDate(today.getDate() + valueToAdd);

              const formattedToday = formatDate(today);
              const formattedNewDate = formatDate(newDate);

              datePicker.clear();
              date.value = `${formattedToday} – ${formattedNewDate}`;
              datePicker.selectDate([today, newDate]);

            });
          }
        });
      }

      date.dataset.initialized = "true";
    });
  }

  // Функция для форматирования даты в нужный формат (дд.мм.гггг)
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  if (dateInput.length > 0) {
    dateInput.forEach(date => {
      if (date.dataset.initialized !== "true") {
        const datePicker = new AirDatepicker(date, {
          position: 'top right',
          autoClose: true,
          container: '.date-picker',
          onSelect: function () {
            date.dispatchEvent(new Event('change'));
            date.dispatchEvent(new Event('input'));
          }
        });
        date.dataset.initialized = "true";
      }
    });
  }
}

export { createCalendar };
