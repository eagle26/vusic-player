import { createRouter, createWebHistory } from 'vue-router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '../store/authStore';

const AppLayout = () => import('../layouts/AppLayout.vue');
const Home = () => import('../views/TheHome.vue');
const About = () => import('../views/TheAbout.vue');
const Manage = () => import('../views/TheManage.vue');
const NotFound = () => import('../views/NotFound.vue');
const Song = () => import('../views/TheSong.vue');

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: AppLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'about',
        name: 'about',
        component: About,
      },
      {
        path: 'manage-music',
        // alias: 'manage',
        name: 'manage',
        component: Manage,
        meta: { requiresAuth: true },
      },
      {
        // When entering manage, redirect the user to manage-music
        path: 'manage',
        redirect: { name: 'manage' },
        meta: { requiresAuth: true },
      },
      {
        path: 'song/:id',
        name: 'song',
        component: Song,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: '',
  linkExactActiveClass: 'menu-active',
});

/* Global Guard */
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();
    if (to.meta?.requiresAuth && !authStore.isUserLoggedIn) {
      next('/');
    } else {
      next();
    }
  }
);

export default router;
