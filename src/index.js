import './sass/main.scss';
// Импорт библиотеки просмотра карточек
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
// Импорт HTTP клиента
import axios from 'axios';
// Импорт библиотеки уведомлений
import Notiflix from 'notiflix';

const searchInput = document.querySelector('.search__input');
const searchForm = document.querySelector('.search__form');

let page = 1;
let searchText;
let lightbox;
let ticking = false;
let counterLoad = 0;
let firstLoad = true;
const limit = 40;
const FETCH_URL = 'https://pixabay.com/api/';
const API_KEY = '24909321-421e53eed99bbb069ae01ec93';

function requestChanged() {
  return searchText !== searchInput.value;
}

function handleSubmit(event) {
  event.preventDefault();
  if (requestChanged()) {
    page = 1;
    searchText = searchInput.value;
  }

  getImages(searchText);
}

searchForm.addEventListener('submit', handleSubmit);

async function getImages(text) {
  document.body.classList.add('content-loading');
  const params = {
    key: API_KEY,
    q: text,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: limit,
  };
  try {
    const response = await axios.get(FETCH_URL, { params });
    if (response.data.totalHits != 0) {
      let maxPages = Math.floor(response.data.totalHits / limit);
      if (response.data.totalHits % limit > 0) {
        maxPages += 1;
      }
      if (page == 1 && firstLoad) {
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} Images`);
        Notiflix.Notify.info(`Total pages: ${maxPages} `);
        firstLoad = false;
      } else {
        if (page != maxPages) {
          Notiflix.Notify.info(`Page ${page}`);
        }
      }
      renderGallery(response.data.hits);
      if (page != maxPages) {
        page += 1;
      } else {
        Notiflix.Notify.info(`Page ${page} is last page`);
        page = 1;
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function addLightbox() {
  return new SimpleLightbox('.gallery .gallery__link', {
    captions: true,
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    captionClass: 'gallery__caption',
  });
}

function loadContent(insertHTML) {
  //если полоса прокрутки в нижней части, загружаем нижний блок, если блоки закончились-верхний
  //добавляем блок вниз и выгружаем первый блок
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = insertHTML;
}

function renderGallery(galleryItems) {
  const insertHTML = galleryItems.reduce((divs, image, index) => {
    return (
      divs +
      `<div class="gallery__item">
            <a href="${image.largeImageURL}" class="gallery__link">
                <image class="gallery__image" src="${image.webformatURL}" alt="${image.tags}">
                <ul class="gallery__info">
                    <li class="gallery__info-item">
                        <b>Likes</b>${image.likes}
                    </li>
                    <li class="gallery__info-item">
                        <b>Views</b>${image.views}
                    </li>
                    <li class="gallery__info-item">
                        <b>Comments</b>${image.comments}
                    </li>
                    <li class="gallery__info-item">
                        <b>Downloads</b>${image.downloads}
                    </li>
                </ul>
            </a>
		</div>`
    );
  }, '');

  loadContent(insertHTML);

  if (lightbox == null) {
    lightbox = addLightbox();
  } else {
    lightbox.refresh();
  }

  onImgLoad();
}

function onImgLoad() {
  const images = document.querySelectorAll('.gallery>.gallery__item .gallery__image');
  counterLoad = images.length;
  images.forEach(image => {
    image.onload = () => {
      counterLoad -= 1;
      if (counterLoad == 0) {
        scrollTo(0, 0);
        document.body.classList.remove('content-loading');
        ticking = true;
      }
    };
  });
}

function loadMore() {
  getImages(searchText);
}

function changePage(event) {
  const container = event.target.body;
  const { clientHeight, scrollHeight, scrollY: scrollTop } = container;
  if (maxPages > 1 && ticking && clientHeight + scrollY >= scrollHeight) {
    window.requestAnimationFrame(function () {
      ticking = false;
      console.log('clientHeight %s ', clientHeight);
      console.log('scrollY %s ', scrollY);
      console.log('scrollHeight  %s ', scrollHeight);
      loadMore();
    });
  }
}

window.addEventListener('scroll', changePage);
