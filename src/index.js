import Notiflix, { Notify } from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderImages, showMessage, loadImages} from './ui';
import { fetchImages } from './api';

const searchForm = document.getElementById('search-form');


const loadMoreBtn = document.querySelector('.load-more');
Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
});
// const lightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;


searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();
  if (!searchQuery) return;
  currentPage = 1;
  currentQuery = searchQuery;
//   const data = await fetchImages(searchQuery, currentPage);
//   if (data.hits.length === 0) {
//     Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//   } else {
//     totalHits = data.totalHits;
//     renderImages(data.hits);
//   }
});
loadMoreBtn.addEventListener('click', async function () {
  currentPage++;
  await loadImages(currentQuery, currentPage);
});
