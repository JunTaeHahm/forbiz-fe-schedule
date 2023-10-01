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
  axios.defaults.baseURL = 'https://port-0-forbiz-fe-schedule-1b5xkk2fldd5874v.gksl2.cloudtype.app'; // TODO: 배포URL 수정
}
