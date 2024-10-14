// import IMask from 'imask';

const phoneElements = document.querySelectorAll('[data-input="phone"]');
const dateElements = document.querySelectorAll('[data-input="simple-date"]');
const rangeDateElements = document.querySelectorAll('[data-input="range-date"]');

function initMasks() {
  if (phoneElements) {
    phoneElements.forEach(phoneElement => {
      const mask = IMask(
        phoneElement,
        {
          mask: '+{7}(000)000-00-00'
        }
      )

      phoneElement.addEventListener('input change', () => {
        mask.updateValue();
      });
    })
  }

  if (dateElements) {
    dateElements.forEach(dateElement => {
      const mask = IMask(dateElement, {
        mask: Date,
        min: new Date(1900, 0, 1),
        max: new Date(2200, 0, 1),
        lazy: true,
        placeholderChar: '_',
        placeholder: 'dd.mm.yyyy'
      });

      dateElement.value = mask.value;
      dateElement.addEventListener('input', () => {
        mask.updateValue();
      });
      dateElement.addEventListener('change', () => {
        if (mask.value < mask.min || mask.value > mask.max) {
          alert('Введена недопустимая дата. Пожалуйста, введите дату в диапазоне от 01.01.1900 до 01.01.2200.');
          dateElement.value = mask.value;
        } else {
          mask.updateValue();
        }
      });
    })
  }

  if (rangeDateElements) {
    rangeDateElements.forEach(rangeDateElement => {
      rangeDateElement.setAttribute('readonly', true);
    })
  }

  applyUniversalMasks();

function applyUniversalMasks() {
  const allInputs = document.querySelectorAll('input');

  allInputs.forEach(input => {
    const dataInput = input.getAttribute('data-input');

    if (dataInput && !['phone', 'simple-date', 'range-date', 'only-letters'].includes(dataInput)) {
      createMask(input, dataInput);
    }
  });
}

function createMask(input, maskPattern) {
  const placeholder = input.getAttribute('placeholder');
  const currentValue = input.value;

  let mask;

  if (maskPattern.startsWith('/') && maskPattern.endsWith('/')) {
    mask = IMask(input, {
      mask: new RegExp(maskPattern.slice(1, -1)),
      lazy: false,
      placeholderChar: '_'
    });
  } else {
    mask = IMask(input, {
      mask: maskPattern,
      lazy: false,
      placeholderChar: '_'
    });
  }

  input.value = '';
  mask.updateValue(currentValue);

  function updatePlaceholder() {
    if (input.value === '') {
      input.setAttribute('placeholder', placeholder);
    } else {
      input.removeAttribute('placeholder');
    }
  }

  input.addEventListener('input change', () => {
    updatePlaceholder();
  });

  updatePlaceholder();
}
}

export { initMasks }
