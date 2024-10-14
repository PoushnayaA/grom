import NiceSelect from './../../../js/vendor/nice-select2';

let customNiceSelects = [];

function updateSelect(customNiceSelect) {
  customNiceSelect.update();
}

function updateInitializedSelects() {
  if (customNiceSelects.length > 0) {
    customNiceSelects.forEach(customSelectInitialized => {
      customSelectInitialized.update();
    });
  }
}

function initSelect() {
  const customSelects = document.querySelectorAll('select.js-custom-select');

  if (customSelects.length > 0) {
    customSelects.forEach(customSelect => {
      customSelect.style.width = "0"
      if (customSelect.dataset.initialized === "true") {
        return
      } else {
        const customNiceSelect = new NiceSelect(customSelect, {
          searchable: false,
        });
        customSelect.dataset.initialized = "true";
        customNiceSelects.push(customNiceSelect)

        customSelect.addEventListener('change', function() {
          updateSelect(customNiceSelect);
        });

        const niceSelect = customSelect.nextElementSibling;

        // const selectedOption = customSelect.querySelector('option[selected]:not([disabled])');
        // const selectedOptionNice = niceSelect.querySelector('.selected:not(.disabled)');
        // if (selectedOptionNice) {
        //   niceSelect.querySelector('.multiple-options, .current').style.color = "#000000";
        //   customNiceSelect.update();
        //   // customSelect.closest('.custom-select').querySelector('.current').style.color = "#000000";
        // }

        setTimeout(() => {
          const selectedOption = customSelect.querySelector('option[selected]:not([disabled])');
          const selectedOptionNice = niceSelect.querySelector('.selected:not(.disabled)');
          
          if (selectedOption) {
              niceSelect.querySelector('.multiple-options, .current').style.color = "#000000";
          }
      }, 0);

        customSelect.addEventListener('change', function () {
          const selectedOptions = Array.from(customSelect.selectedOptions).map(option => option.text);
          const niceSelect = customSelect.nextElementSibling;
          console.log(niceSelect);
          
          niceSelect.querySelector('.multiple-options, .current').style.color = "#000000";

          //для мультиселекта
          if (niceSelect.querySelector('.multiple-options')) {
            niceSelect.querySelector('.multiple-options').textContent = selectedOptions.join(', ');
          }

        });
      }

    });
  }
}

export {initSelect, updateInitializedSelects}
