import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

export function renderImages(images, gallery, loadMoreBtn) {
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

export function showMessage(message, gallery) {
  gallery.innerHTML = '';
  Notiflix.Notify.info(message);
}

// export { renderImages, showMessage };
