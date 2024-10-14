function findPerson() {
  const userFormFieldsets = document.querySelectorAll('.user-form__fieldset:not(.user-form__fieldset--wrapper)');

  if (userFormFieldsets) {
    userFormFieldsets.forEach(userFormFieldset => {
      const peopleListContainers = userFormFieldset.querySelectorAll('.people-list');
      const searchContainerChecked = userFormFieldset.querySelector('.search-container--checked');

      if (peopleListContainers) {
        peopleListContainers.forEach(peopleListContainer => {
          const searchInput = peopleListContainer.parentElement.querySelector('.filter-input-name');
          const people = peopleListContainer.querySelectorAll('label');
          if (peopleListContainer.querySelector('input[type=checkbox]')) {
            peopleListContainer.classList.add('filter-item--search-checkbox')
          }
          searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase().trim();
            let hasVisibleItems = false;

            people.forEach(person => {
              const name = person.querySelector('.checkmark__name').textContent.toLowerCase();
              const date = person.querySelector('.checkmark__date').textContent.toLowerCase();

              if (name.includes(searchTerm) || date.includes(searchTerm)) {
                person.style.display = '';
                hasVisibleItems = true;
              } else {
                person.style.display = 'none';
              }
            });

            if (hasVisibleItems && searchTerm !== '') {
              peopleListContainer.classList.remove('visually-hidden');
            } else {
              peopleListContainer.classList.add('visually-hidden');
            }
          });

          peopleListContainer.addEventListener('click', function (event) {
            if (event.target === peopleListContainer) {
              peopleListContainer.classList.add('visually-hidden');
            }
          });

          searchInput.addEventListener('focus', function () {
            if (this.value.trim() !== '') {
              peopleListContainer.classList.remove('visually-hidden');
            }
          });

          peopleListContainer.addEventListener('click', function (event) {

            if (event.target.closest('label')) {
              const selectedPerson = event.target.closest('label');

              const selectedInput = selectedPerson.querySelector('input[type="checkbox"], input[type="radio"]');
              selectedInput.checked = true;
              const isCheckbox = selectedInput.type === 'checkbox';
              const selectedName = selectedPerson.querySelector('.checkmark__name').textContent;
              searchInput.value = selectedName;
              peopleListContainer.classList.add('visually-hidden');

              const personClone = selectedPerson.cloneNode(true);

              personClone.classList.remove('visually-hidden');

              const buttonsWrapper = document.createElement('div');
              buttonsWrapper.classList.add('checkmark__btn-wrapper');
              personClone.querySelector('.checkmark').appendChild(buttonsWrapper);

              if (peopleListContainer.closest('.js-edit-fieldset')) {

                const editButton = document.createElement('a');
                editButton.classList.add('checkmark__edit-btn');
                editButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M4.41999 20.579C4.13948 20.5785 3.87206 20.4602 3.68299 20.253C3.49044 20.0475 3.39476 19.7695 3.41999 19.489L3.66499 16.795L14.983 5.481L18.52 9.017L7.20499 20.33L4.51099 20.575C4.47999 20.578 4.44899 20.579 4.41999 20.579ZM19.226 8.31L15.69 4.774L17.811 2.653C17.9986 2.46522 18.2531 2.35971 18.5185 2.35971C18.7839 2.35971 19.0384 2.46522 19.226 2.653L21.347 4.774C21.5348 4.96157 21.6403 5.21609 21.6403 5.4815C21.6403 5.74691 21.5348 6.00143 21.347 6.189L19.227 8.309L19.226 8.31Z" fill="#999999"/>
</svg>
              `;
                // personClone.querySelector('.checkmark').appendChild(editButton);
                buttonsWrapper.appendChild(editButton);

                editButton.addEventListener('mouseover', function () {
                  this.querySelector('path').setAttribute('fill', '#2E2E2E');
                });
                editButton.addEventListener('mouseleave', function () {
                  this.querySelector('path').setAttribute('fill', '#999999');
                });
              }



              const closeButton = document.createElement('button');
              closeButton.classList.add('checkmark__close-btn');
              closeButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="#999999" stroke-width="2" stroke-linecap="round" />
              </svg>
            `;

              buttonsWrapper.appendChild(closeButton);

              closeButton.addEventListener('mouseover', function () {
                this.querySelector('path').setAttribute('stroke', '#2E2E2E');
              });
              closeButton.addEventListener('mouseleave', function () {
                this.querySelector('path').setAttribute('stroke', '#999999');
              });
              closeButton.addEventListener('click', function () {
                personClone.remove();
                selectedInput.checked = false;
              });

              if (isCheckbox) {
                const existingItem = searchContainerChecked.querySelector(`[data-value="${selectedInput.value}"]`);
                if (!existingItem) {
                  searchContainerChecked.appendChild(personClone);
                  personClone.setAttribute('data-value', selectedInput.value);
                  selectedInput.checked = true;
                }
              }
              else {
                const selectedItems = searchContainerChecked.querySelectorAll('.filter-item');
                selectedItems.forEach(item => {
                  const radioInput = item.querySelector('input[type="radio"]');
                  if (radioInput) {
                    radioInput.checked = false;
                  }
                });
                searchContainerChecked.innerHTML = '';
                const jsSearchContainer = searchContainerChecked.closest('.js-search');
                jsSearchContainer.style.maxHeight = "200px";

                searchContainerChecked.appendChild(personClone);
                selectedInput.checked = true;
              }
            }
          });

          document.addEventListener('click', function (event) {
            if (!peopleListContainer.contains(event.target) && event.target !== searchInput) {
              peopleListContainer.classList.add('visually-hidden');
            }
          });

          peopleListContainer.classList.add('visually-hidden');
        })
      }
    });
  }
}

export { findPerson }
