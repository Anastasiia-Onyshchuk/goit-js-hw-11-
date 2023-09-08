import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
});

const lightbox = new SimpleLightbox('.gallery a');
loadMoreBtn.style.display = "none";

let page = 1;
let currentQuery = '';


async function fetchImages(query, pageNum) {
  try {
    const apiKey = '39225934-550637513b3cbac3c28ca7e05'; 
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNum,
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
            <img src="${image.webformatURL}" alt="${image.tags}" width ="280" height="280" loading="lazy" />
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
if (images.length >= 40) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
  gallery.innerHTML = markup;
//   loadMoreBtn.style.display = 'block';
  lightbox.refresh();
}

function showMessage(message) {
  gallery.innerHTML = '';
  Notiflix.Notify.info(message);
}


searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();
  if (!searchQuery) return;

  page = 1;
  currentQuery = searchQuery;
  loadMoreBtn.style.display = 'none';

  const data = await fetchImages(searchQuery, page);
  if (data.hits.length === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else {
    renderImages(data.hits);
    showMessage(`Hooray! We found ${data.totalHits} images.`);
    if (data.totalHits > 40) {
      loadMoreBtn.style.display = 'block';
    }
  }
});


loadMoreBtn.addEventListener('click', async function () {
    page++;
      loadMoreBtn.style.display = 'none';
  const data = await fetchImages(currentQuery, page);
  if (data.hits.length === 0) {
    loadMoreBtn.style.display = 'none';
    showMessage("We're sorry, but you've reached the end of search results.");
  } else {
      renderImages(data.hits);
        loadMoreBtn.style.display = 'none';
  }
});