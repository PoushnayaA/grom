const initFeedback = () => {
  const openFormModalButton = document.querySelector('.js-open-modal');
  const closeFormModalButtons = document.querySelectorAll('.js-close-modal');
  if (closeFormModalButtons.length > 0) {
    closeFormModalButtons.forEach(closeFormModalButton => {
      closeFormModalButton.addEventListener('click', function () {
        closeFormModalButton.closest('.modal').classList.remove('active');
        document.querySelector('body').classList.remove('dark-modal');
      })
    })
  }
  if (openFormModalButton) {
    if (openFormModalButton.dataset.open) openFeedbackModalForm();
    openFormModalButton.addEventListener('click', function () {
      openFeedbackModalForm();
    })
  }
};

const openFeedbackModalForm = () => {
  document.querySelector('.modal').classList.add('active')
  document.querySelector('body').classList.add('dark-modal');
};


export {initFeedback};
