import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/app.scss';
import axios from 'axios';

const app = createApp(App).use(router).mount('#app');

const isDevelopment = import.meta.env.VITE_APP_NODE_ENV !== 'production';

axios.defaults.withCredentials = true;
if (isDevelopment) {
  axios.defaults.baseURL = 'http://localhost:3000'; // 개발
} else {
  axios.defaults.baseURL = 'https://www.sentenceu.co.kr'; // 배포
}
