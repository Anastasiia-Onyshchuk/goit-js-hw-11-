import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import { renderImages, showMessage } from './ui';
// import { fetchImages } from './api';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
});
const lightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
async function fetchImages(query, page) {
  try {
    const apiKey = '39225934-550637513b3cbac3c28ca7e05';
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
function renderImages(images) {
  gallery.innerHTML = '';
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
  gallery.innerHTML = markup;
  if (totalHits > currentPage * 40) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
  lightbox.refresh();
}
function showMessage(message) {
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
  }
}
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();
  if (!searchQuery) return;
  currentPage = 1;
  currentQuery = searchQuery;
  const data = await fetchImages(searchQuery, currentPage);
  if (data.hits.length === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else {
    totalHits = data.totalHits;
    renderImages(data.hits);
  }
});
loadMoreBtn.addEventListener('click', async function () {
  currentPage++;
  await loadImages(currentQuery, currentPage);
});
// Додайте обробник кліку на кнопку search-btn
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', async function () {
  const searchQuery = searchForm.searchQuery.value.trim();
  if (!searchQuery) return;
  currentPage = 1;
  currentQuery = searchQuery;
  const data = await fetchImages(searchQuery, currentPage);
  if (data.hits.length === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else {
    totalHits = data.totalHits;
    renderImages(data.hits);
  }
});