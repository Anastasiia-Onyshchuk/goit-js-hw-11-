import axios from 'axios';

const apiKey = '39225934-550637513b3cbac3c28ca7e05';

 async function fetchImages(query, page) {
  try {
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

export { fetchImages };
