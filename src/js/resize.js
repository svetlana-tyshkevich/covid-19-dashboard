/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const resizeButton = document.querySelectorAll('.resize-button');

resizeButton.forEach((item) =>
  item.addEventListener('click', (e) => {
    e.currentTarget.parentNode.classList.toggle('expanded');
    e.currentTarget.classList.toggle('pressed');
  }),
);
