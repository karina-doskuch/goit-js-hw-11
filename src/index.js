import { fetchImages } from './js/fetch';
import { cardGalleryTemplate } from './js/markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const noMoreImgesText = document.querySelector('.no-more-imges-text');

function galleryCardImage(array) {
  const markupGallery = array.map(item => cardGalleryTemplate(item)).join('');
  gallery.insertAdjacentHTML('beforeend', markupGallery);
}

let simpleLightBox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;
  if (response.totalHits > 40) {
    btnLoadMore.classList.remove('is-hidden');
  } else {
    btnLoadMore.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      galleryCardImage(response.hits);
      simpleLightBox.refresh();

      noMoreImgesText.classList.add('is-hidden');
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.classList.add('is-hidden');
      noMoreImgesText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

btnLoadMore.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  galleryCardImage(response.hits);
  simpleLightBox.refresh();
  currentHits += response.hits.length;

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 + 60,
    behavior: 'smooth',
  });

  if (currentHits >= response.totalHits) {
    btnLoadMore.classList.add('is-hidden');
    noMoreImgesText.classList.remove('is-hidden');
  }
}
