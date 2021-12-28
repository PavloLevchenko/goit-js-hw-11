// Импорт библиотеки пагинации
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
//функция добавления навигации
export function createPagination(totalItems, itemsPerPage, visiblePages, currentPage, callback) {
  const options = {
    totalItems: totalItems,
    itemsPerPage: itemsPerPage,
    visiblePages: visiblePages,
    page: currentPage,
  };
  const pagination = new Pagination('pagination', options);
  pagination.on('beforeMove', callback);
  return pagination;
}
