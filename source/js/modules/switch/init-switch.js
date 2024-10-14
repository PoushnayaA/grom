const switchList = document.querySelector('.switch__list');
const contentSections = document.querySelectorAll('.switch-block');
const switchButton = document.querySelector('.switch__open-list-js');

function initSwitch() {
  if (switchList && switchButton) {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      switchSection(hash);
    });

    if (contentSections.length > 0) {
      contentSections[0].classList.remove('visually-hidden');
    }

    if (switchList.querySelector('.active.switch__button')) {
      const hash = window.location.hash.slice(1) || switchList.querySelector('.active.switch__button').getAttribute('data-button');
      switchSection(hash);
    }


    switchButton.addEventListener('click', function (event) {
      event.preventDefault();
      switchList.classList.toggle('active');
      switchButton.classList.toggle('active');
    });

    if (switchList.querySelector('button')) {
      switchList.querySelectorAll('button').forEach((buttonSwitch, index) => {
        buttonSwitch.addEventListener('click', function () {
          const dataButton = this.getAttribute('data-button');
          window.location.hash = dataButton;
          switchButton.querySelector('.switch__button-mobile').textContent = this.textContent.trim();
          switchList.classList.remove('active');
          switchButton.classList.remove('active');
          switchSection(dataButton);
        });
      });
    }
  }
}

function switchSection(section) {
  const buttons = switchList.querySelectorAll('button');
  if (buttons) {
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeButton = Array.from(buttons).find(btn => btn.getAttribute('data-button') === section);
    if (activeButton) {
      activeButton.classList.add('active');
      switchButton.querySelector('.switch__button-mobile').textContent = activeButton.textContent.trim();

      const index = Array.from(buttons).indexOf(activeButton);
      contentSections.forEach((sectionEl, idx) => {
        if (idx === index) {
          sectionEl.classList.remove('visually-hidden');
        } else {
          sectionEl.classList.add('visually-hidden');
        }
      });
    } else {
      buttons[0].classList.add('active');
      switchButton.querySelector('.switch__button-mobile').textContent = buttons[0].textContent.trim();
      contentSections.forEach((sectionEl, idx) => {
        if (idx === 0) {
          sectionEl.classList.remove('visually-hidden');
        } else {
          sectionEl.classList.add('visually-hidden');
        }
      });
    }
  }
}

function openList() {
  const openListButtons = document.querySelectorAll('.open-list-js');
if (openListButtons) {
  openListButtons.forEach(openListButton => {
    openListButton.addEventListener('click', function (event) {
      event.preventDefault();
      openListButton.closest('.switch').querySelector('.switch__list').classList.toggle('active');
      openListButton.classList.toggle('active');
    });
  })
}
}


export { initSwitch, openList };
