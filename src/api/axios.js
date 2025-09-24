import axios from 'axios';
//TMDB API
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/movie/',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  }
})


//Flask API
const chatApi=axios.create({
  baseURL:'https://backend-movie-dr57.onrender.com',
  headers:{
    'Content-Type':'application/json'
  }
})
export {chatApi};

export default api;