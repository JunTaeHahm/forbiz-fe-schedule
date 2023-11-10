import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:part',
    name: 'Home',
    component: () => import('../App.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
