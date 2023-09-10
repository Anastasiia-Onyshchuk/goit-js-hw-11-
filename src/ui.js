import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api';

const lightbox = new SimpleLightbox('.gallery a');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.getElementById('search-form');

loadMoreBtn.style.display = "none";
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

function renderImages(images) {

  const markup = images
    .map((image) => {
      return `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" width="280" height="280" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes</b> ${image.likes}</p>
            <p class="info-item"><b>Views</b> ${image.views}</p>
            <p class="info-item"><b>Comments</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
          </div>
        </div>
      `;
    })
    .join('');
    gallery.insertAdjacentHTML("beforeend", markup)
  if (totalHits > currentPage * 40) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
  lightbox.refresh();
}

function showMessage(message, gallery) {
  gallery.innerHTML = '';
  Notiflix.Notify.info(message);
}

async function loadImages(query, page) {
  const data = await fetchImages(query, page);
  if (data.hits.length === 0) {
    loadMoreBtn.style.display = 'none';
    showMessage("We're sorry, but you've reached the end of search results.");
  } else {
      renderImages(data.hits);
      loadMoreBtn.style.display = 'block';
  }
}

const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', async function () {
  const searchQuery = searchForm.searchQuery.value.trim();
  if (!searchQuery) return;
  currentPage = 1;
  currentQuery = searchQuery;
  const data = await fetchImages(searchQuery, currentPage);
     totalHits = data.totalHits;
    renderImages(data.hits);
});
export { renderImages, showMessage, loadImages };
