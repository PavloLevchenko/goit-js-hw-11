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
const searchBtn = document.querySelector('.search__btn');
const searchMore = document.querySelector('.search__more');
let isSearchMore = false;

let page = 1;
let searchText;
let lightbox;
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
      if (page == 1) {
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} Images`);
        Notiflix.Notify.info(`Total pages: ${maxPages} `);
      } else {
        Notiflix.Notify.info(`Page ${page}`);
      }
      renderGallery(response.data.hits);

      if (page < maxPages) {
        page += 1;
      } else if (page != 1) {
        Notiflix.Notify.info(`Page ${page} is last page`);
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(error);
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

function scroll() {
  const { height: cardHeight, width: cardWidth } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  const imagesPerPage = Math.floor(document.documentElement.clientWidth / cardWidth);
  console.log(imagesPerPage);
  window.scrollBy({
    top: (cardHeight * limit * (page - 1)) / imagesPerPage,
    behavior: 'smooth',
  });
}

function renderGallery(galleryItems) {
  const insertHTML = galleryItems.reduce((divs, image) => {
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

  const gallery = document.querySelector('.gallery');
  gallery.insertAdjacentHTML('beforeend', `${insertHTML}`);
  if (lightbox == null) {
    lightbox = addLightbox();
  } else {
    lightbox.refresh();
    scroll();
  }
}
