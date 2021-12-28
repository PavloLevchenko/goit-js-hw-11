//код делает запрос на сервер и возвращает массив ссылок на изображения с описанием

// Импорт HTTP клиента
import axios from 'axios';

const FETCH_URL = 'https://pixabay.com/api/';
const API_KEY = '24909321-421e53eed99bbb069ae01ec93';

export async function getImages(text, page, limit, onLoad, onFailture) {
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
      onLoad(response.data.hits, response.data.totalHits);
    } else {
      onFailture('Sorry, there are no images matching your search query. Please try again.');
    }
  } catch (error) {
    onFailture(error.message);
  }
}
