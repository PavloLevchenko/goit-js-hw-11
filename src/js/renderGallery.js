//функция создаёт разметку галереи
export function renderGallery(galleryItems, onRender = null) {
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
  if (onRender) {
    onRender(insertHTML);
  }
  return insertHTML;
}
