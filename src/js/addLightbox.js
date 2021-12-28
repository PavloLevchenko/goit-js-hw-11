// Импорт библиотеки просмотра карточек
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

//функция добавления просмотрщика галереи
export function addLightbox() {
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
