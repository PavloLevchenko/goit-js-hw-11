//код показывает и скрывает меню при нажатии на "бургер"
(() => {
  const menuBtnRef = document.querySelector('.menu__button');
  const mobileMenuRef = document.querySelector('.menu__container');

  menuBtnRef.addEventListener('click', () => {
    const expanded = menuBtnRef.getAttribute('aria-expanded') === 'true' || false;

    menuBtnRef.classList.toggle('is-open');
    menuBtnRef.setAttribute('aria-expanded', !expanded);

    document.body.classList.toggle('menu-open');
    mobileMenuRef.classList.toggle('is-open');
  });
})();
