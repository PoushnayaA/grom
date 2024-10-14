function initPasswordButton() {
  const showPasswordButtons = document.querySelectorAll('.show-password-js');
  if (showPasswordButtons) {
    showPasswordButtons.forEach(showPasswordButton => {
      const svgElements = showPasswordButton.querySelectorAll('svg');
      const inputElement = showPasswordButton.parentElement.querySelector('input');
      showPasswordButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (inputElement.type === 'text') {
          inputElement.type = 'password';
          svgElements[1].classList.add('visually-hidden');
          svgElements[0].classList.remove('visually-hidden');
        }
        else {
          inputElement.type = 'text';
          svgElements[0].classList.add('visually-hidden');
          svgElements[1].classList.remove('visually-hidden');
        }
      })

      const passwordInput = showPasswordButton.parentElement.querySelector('input[type="password"]');
      passwordInput.addEventListener('input', function () {
        if (passwordInput.value !== '') {
          svgElements[0].classList.remove('visually-hidden');
        } else {
          svgElements[0].classList.add('visually-hidden');
        }
      })
    })
  }
}

export { initPasswordButton }
