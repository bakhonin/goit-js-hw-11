import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import InfiniteScroll from 'infinite-scroll'

const API_KEY = '22982350-761e7ab2cf0d045363c24f74c';
const BASE_URL = 'https://pixabay.com/api/';
const searchForm = document.getElementById('search-form');
const input = searchForm.elements.searchQuery;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let firstLoad = true;
let lightbox;
let totalHits = 0;
let loadedImages = 0;
let searchQuery = '';
let page = 1;

loadMoreBtn.style.display = 'none';


searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  searchQuery = input.value.trim();
  if (searchQuery === "") {
    Notiflix.Notify.warning('Please enter a valid search query.');
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  loadedImages = 0;
  fetchImages();
});


loadMoreBtn.addEventListener('click', fetchImages);


async function fetchImages() {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
    const images = response.data.hits;
    totalHits = response.data.totalHits;
    loadedImages += images.length;
    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      if(page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      renderImages(images);
      loadMoreBtn.style.display = 'block';
      page += 1;
      if (loadedImages >= totalHits) {
        Notiflix.Notify.info('You have reached the end of the images.');
        loadMoreBtn.style.display = 'none';
      }
      lightbox.refresh();
      if (!firstLoad) {
        smoothScrollTo(gallery.lastElementChild);
      } else {
        firstLoad = false;
      }
    
    }
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure('An error occurred while fetching images. Please try again.');
  }
}


function renderImages(images) {
  const markup = images.map(image => `
    <div class="photo-card">
      <a href="${image.webformatURL}" data-lightbox="gallery">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `).join('');
  gallery.innerHTML += markup;

 lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
  });
}

function smoothScrollTo(element) {
  const { height: cardHeight } = element.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2.75,
    behavior: 'smooth',
  });
}






// import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";
// import InfiniteScroll from 'infinite-scroll'

// const API_KEY = '22982350-761e7ab2cf0d045363c24f74c';
// const BASE_URL = 'https://pixabay.com/api/';
// const searchForm = document.querySelector('.search-form');
// const input = searchForm.elements.searchQuery;
// const gallery = document.querySelector('.gallery');
// let searchQuery = '';
// let page = 1;
// let infScroll;


// searchForm.addEventListener('submit', async (event) => {
//   event.preventDefault();
//   searchQuery = input.value;
//   page = 1;
//   gallery.innerHTML = '';
//   fetchImages();
  
//   infScroll = new InfiniteScroll('.gallery', {
//     path: function () {
//       page += 1;
//       return `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
//     },
//     append: false,
//     responseType: 'json',
//     history: false,
//     outlayer: gallery,
//   });
  
//   infScroll.on('load', function(response) {
//     const images = response.hits;
//     renderImages(images);
//   });
  
//   infScroll.loadNextPage();
// });


// async function fetchImages() {
//   try {
//     const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
//     const images = response.data.hits;
//     const totalHits = response.data.totalHits;
//     if (images.length === 0) {
//       Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//     } else {
//       renderImages(images);
//       Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     Notiflix.Notify.failure('An error occurred while fetching images. Please try again.');
//   }
// }


// function renderImages(images) {
//   const markup = images.map(image => `
//     <div class="photo-card">
//       <a href="${image.webformatURL}" data-lightbox="gallery">
//         <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//       </a>
//       <div class="info">
//         <p class="info-item">
//           <b>Likes:</b> ${image.likes}
//         </p>
//         <p class="info-item">
//           <b>Views:</b> ${image.views}
//         </p>
//         <p class="info-item">
//           <b>Comments:</b> ${image.comments}
//         </p>
//         <p class="info-item">
//           <b>Downloads:</b> ${image.downloads}
//         </p>
//       </div>
//     </div>
//   `).join('');
//   gallery.innerHTML += markup;

//   const lightbox = new SimpleLightbox('.gallery a', {
//     captions: true,
//     captionDelay: 250,
//   });
// }
