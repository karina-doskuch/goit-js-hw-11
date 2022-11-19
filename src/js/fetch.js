import axios from 'axios';
export async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '31398355-3de4a215bf6ef872baef1a2d4';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}${filter}`).then(response => response.data);
}
