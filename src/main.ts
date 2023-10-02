import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/app.scss';
import axios from 'axios';

createApp(App).use(router).mount('#app');

const isDevelopment = import.meta.env.VITE_APP_NODE_ENV !== 'production';

axios.defaults.withCredentials = true;
if (isDevelopment) {
  axios.defaults.baseURL = 'http://localhost:3000'; // 개발
} else {
  axios.defaults.baseURL = 'https://port-0-forbiz-fe-schedule-12fhqa2bln7c6j5b.sel5.cloudtype.app'; // TODO: 배포URL 수정
}
