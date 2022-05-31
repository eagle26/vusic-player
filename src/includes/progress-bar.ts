import NProgress from 'nprogress';
import type { Router } from 'vue-router';

const progressBar = (router: Router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
};

export default progressBar;
