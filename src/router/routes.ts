import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/cart',
        component: () => import('pages/CartPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/payment',
        name: 'payment',
        component: () => import('pages/PaymentPage.vue'),
        props: true, // allow route props
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
];

export default routes;
