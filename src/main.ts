import { createApp } from 'vue';
import router from './routes';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

import App from './App.vue';
import firebase from './includes/firebase';
import ProgressBar from './includes/progress-bar';

// Tailwind Styles
import './assets/tailwind.css';
import './assets/main.css';

//NProgress CSS
import 'nprogress/nprogress.css';

//Init Progress bar
ProgressBar(router);

//Init firebase first, then the Vue app
firebase.onAuthChange(() => {
  const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  });

  const app = createApp(App);

  //Storage Manager
  app.use(createPinia());

  // Vue Router
  app.use(router);

  // Internationalization
  app.use(i18n);

  app.mount('#app');
});
