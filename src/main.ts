import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router/index';
import './styles/app.scss';

const app = createApp(App).use(router);

router.isReady().then(() => {
  app.mount('#app');
});

const isDevelopment = import.meta.env.VITE_APP_NODE_ENV !== 'production';

axios.defaults.withCredentials = true;
if (isDevelopment) {
  axios.defaults.baseURL = 'http://localhost:15000'; // 개발
} else {
  axios.defaults.baseURL = 'http://192.168.1.49:15000'; // 배포
}
