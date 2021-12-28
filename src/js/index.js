import '../sass/main.scss';

// Импорт библиотеки уведомлений
import Notiflix from 'notiflix';

import { getImages } from './getImages.js';
import { onImgLoad } from './onImgLoad.js';
import { renderGallery } from './renderGallery.js';
import { addLightbox } from './addLightbox.js';
import { createPagination } from './createPagination.js';

const searchInput = document.querySelector('.search__input');
const searchForm = document.querySelector('.search__form');
const backdrop = document.querySelector('.backdrop');

//глобальные переменные
let page = 1;
let maxPages = 1;
const LIMIT = 40;
const VISIBLE_PAGE_BUTTONS = 5;
let loaded = false;
let firstLoad = true;
let lightbox;
let pagination;

//функция проверки изменился ли текст запроса
let searchText;
function requestChanged() {
  return searchText !== searchInput.value;
}
//функция загрузки изображений из API
function loadImages() {
  showLoadBackdrop();
  getImages(searchText, page, LIMIT, onLoad, Notiflix.Notify.failure);
}
//функция вызывается при отправке формы (нажатии на кнопку поиска)
function handleSubmit(event) {
  event.preventDefault();
  if (searchInput.value == '') {
    Notiflix.Notify.info('Input is empty');
    return;
  }

  if (requestChanged()) {
    page = 1;
    searchText = searchInput.value;
  }

  loadImages();
}

function showLoadBackdrop() {
  loaded = false;
  backdrop.classList.remove('is-hidden');
  document.body.classList.add('content-loading');
}

function hideLoadBackdrop() {
  document.body.classList.remove('content-loading');
  backdrop.classList.add('is-hidden');
  loaded = true;
}
//события после загрузки галереи
function onRenderGallery(insertHTML) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = insertHTML;

  if (lightbox == null) {
    lightbox = addLightbox();
  } else {
    lightbox.refresh();
  }

  onImgLoad('.gallery>.gallery__item .gallery__image', () => {
    scrollTo(0, 0);
    hideLoadBackdrop();
  });
}
//загрузка изображений при смене страницы в навигации
function changePage(eventData) {
  page = eventData.page;
  if (loaded && page) {
    loadImages();
  }
}

//события после получения ответа от API
function onLoad(galleryItems, total) {
  maxPages = Math.floor(total / LIMIT);
  if (total % LIMIT > 0) {
    maxPages += 1;
  }
  if (page == 1 && firstLoad) {
    Notiflix.Notify.info(`Hooray! We found ${total} Images`);
    Notiflix.Notify.info(`Total pages: ${maxPages} `);
    firstLoad = false;
  } else {
    if (page != maxPages) {
      Notiflix.Notify.info(`Page ${page}`);
    }
  }

  renderGallery(galleryItems, onRenderGallery);

  if (maxPages != 1) {
    if (!pagination) {
      pagination = createPagination(total, LIMIT, VISIBLE_PAGE_BUTTONS, page, changePage);
    } else {
      pagination.reset(total);
      pagination.movePageTo(page);
    }
    document.getElementById('pagination').classList.remove('hidden');
  } else {
    document.getElementById('pagination').classList.add('hidden');
  }

  if (page != maxPages) {
    page += 1;
  } else {
    Notiflix.Notify.info(`Page ${page} is last page`);
    page = 1;
  }
}
searchForm.addEventListener('submit', handleSubmit);

//функция загрузки изображений после скрола вниз страницы
function listPage(event) {
  const container = event.target.body;
  const { clientHeight, scrollHeight, scrollY: scrollTop } = container;
  if (maxPages > 1 && loaded && clientHeight + scrollY >= scrollHeight) {
    window.requestAnimationFrame(function () {
      loadImages();
    });
  }
}

window.addEventListener('scroll', listPage);
