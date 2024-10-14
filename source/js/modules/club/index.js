var selected_club_letter = '';
var search_club_title = '';

const initClubsFilter = () => {
  inputFilter();
  letterFilter();
};

const inputFilter = () => {
  const search_input = document.querySelector('.js-search-input');
  if (search_input) {
    search_input.addEventListener('input', function () {
      search_club_title = (this.value.length > 2) ? this.value : '';
      reloadClubList();
    });
  }
};

const letterFilter = () => {
  const openAlphabetButton = document.querySelector('.js-alphabet');
  const alphabetList = document.querySelector('.alphabet');
  const alphabetButtonText = document.querySelector('.alphabet__text-button');
  if (openAlphabetButton && alphabetList) {
    openAlphabetButton.addEventListener('click', function (event) {
      event.preventDefault();
      alphabetList.classList.toggle('visible');
      openAlphabetButton.querySelector('.arrow').classList.toggle('active');
    });

    const windowWidth = window.innerWidth;
    if (windowWidth >= 768) {
      alphabetList.classList.add('visible');
      openAlphabetButton.querySelector('.arrow').classList.add('active');
    }

    window.addEventListener('resize', () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 768) {
        alphabetList.classList.add('visible');
        openAlphabetButton.querySelector('.arrow').classList.add('active');
      } else {
        alphabetList.classList.remove('visible');
        openAlphabetButton.querySelector('.arrow').classList.remove('active');
      }
    });
    const radios = document.querySelectorAll('input[name="letter"]');
    let selectedRadio = null;

    radios.forEach(radio => {
      radio.addEventListener('change', function () {
        if (selectedRadio !== this) {
          selected_club_letter = radio.value;
          alphabetButtonText.textContent = this.value;
          alphabetButtonText.style.textTransform = "uppercase";
          alphabetButtonText.style.color = "#2E2E2E";
          reloadClubList();
        }
        selectedRadio = this;
      });

      radio.addEventListener('click', function () {
        if (selectedRadio === this) {
          selected_club_letter = '';
          selectedRadio = null;
          this.checked = false;
          alphabetButtonText.textContent = 'Выберите букву';
          alphabetButtonText.style.textTransform = "none";
          alphabetButtonText.style.color = "#999999";
          reloadClubList();
        }
      });
    });
  }
};

const reloadClubList = () => {
  const clubs_list = document.querySelector('.js-clubs-list');
  if (clubs_list) {
    const url = new URL(window.location.href);
    if (search_club_title.trim() !== '') {
      url.searchParams.set('title', search_club_title.trim());
      if (url.searchParams.has('page')) url.searchParams.delete('page');
    }
    if (selected_club_letter.trim() !== '') {
      url.searchParams.set('letter', selected_club_letter.trim());
      if (url.searchParams.has('page')) url.searchParams.delete('page');
    }
    fetch(url, {
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {
      return response.text()
    }).then((res) => {
      const newNode = document.createElement('div');
      newNode.innerHTML = res;
      // clubs_list.outerHTML = newNode.innerHTML;
      clubs_list.parentNode.replaceChild(newNode, clubs_list);
    }).catch((error) => {
      console.log(error)
    })
  }
}

export {initClubsFilter, reloadClubList};
