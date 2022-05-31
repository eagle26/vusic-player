<template>
  <!-- Header -->
  <header
    id="header"
    class="bg-gray-100 dark:bg-slate-800 shadow transition duration-500"
  >
    <div
      class="flex items-center container mx-auto w-full justify-between px-2"
    >
      <!-- App Name -->
      <router-link
        class="text-slate-900 dark:text-white font-bold uppercase text-2xl mr-4 hover:text-amber-600 dark:hover:text-amber-600 flex items-center absolute top-6 left-1 md:static md:top-auto md:left-auto"
        to="/"
        exact-active-class="no-active"
      >
        <img src="/music.png" class="mr-3 h-6 sm:h-9" alt="Music App Logo" />
        Music
      </router-link>

      <div class="flex items-center w-full relative">
        <!-- Navigation Links -->
        <Disclosure
          as="nav"
          class="flex flex-wrap justify-end items-center py-5 w-full pr-16 md:pr-0"
        >
          <div class="flex items-center md:order-2">
            <!-- Profile dropdown -->
            <Menu
              v-if="authStore.isUserLoggedIn"
              as="div"
              class="ml-3 relative"
            >
              <div>
                <MenuButton
                  class="max-w-xs p-0.5 rounded-full flex items-center text-sm border-2 border-slate-300 hover:border-amber-600 transition duration-200 dark:bg-slate-800 dark:border-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <img class="h-6 w-6 rounded-full" :src="avatar" alt="" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white border-gray-200 dark:bg-slate-800 border dark:border-slate-600 shadow ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.href"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-slate-600' : '',
                        'block px-4 py-2 text-sm text-slate-800 dark:text-white',
                      ]"
                      @click.prevent="item.action"
                    >
                      {{ t(item.name) }}
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Mobile Menu Button -->
            <button
              type="button"
              class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu"
              aria-expanded="false"
              @click.prevent="toggleMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                class="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div
            class="justify-between items-center w-full md:flex md:w-auto md:order-1"
            :class="{ hidden: isMobileMenuHidden }"
          >
            <!-- Primary Navigation -->
            <ul
              class="flex flex-col mt-4 md:flex-row md:space-x-4 md:mt-0 md:text-sm md:font-medium"
            >
              <!-- Navigation Links -->
              <li>
                <router-link
                  class="px-2 text-slate-900 hover:text-amber-600 dark:text-white dark:hover:text-amber-600"
                  to="/"
                  >{{ t('menu.home') }}</router-link
                >
              </li>

              <li>
                <router-link
                  class="px-2 text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-600"
                  :to="{ name: 'about' }"
                  >{{ t('menu.about') }}</router-link
                >
              </li>

              <li v-if="!authStore.isUserLoggedIn">
                <a
                  class="px-2 text-slate-900 dark:text-white hover:text-amber-600"
                  href="#"
                  @click.prevent="authStore.toggleModalStatus()"
                  >{{ t('menu.login') }}</a
                >
              </li>
              <template v-else>
                <li>
                  <router-link
                    class="px-2 text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-600"
                    :to="{ name: 'manage' }"
                    >{{ t('menu.manage') }}</router-link
                  >
                </li>
              </template>
            </ul>
          </div>
        </Disclosure>

        <!-- DarkMode -->
        <div
          class="flex items-center border-l border-slate-300 dark:border-slate-700 ml-6 pl-6 absolute top-7 right-0 md:static md:right-auto md:top-auto"
        >
          <button type="button" @click.prevent="toggleDarkMode">
            <span class="dark:hidden">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6"
              >
                <path
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  class="fill-sky-400/20 stroke-amber-500"
                ></path>
                <path
                  d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                  class="stroke-amber-600"
                ></path>
              </svg>
            </span>
            <span class="hidden dark:inline">
              <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
                  class="fill-sky-400/20"
                ></path>
                <path
                  d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                  class="fill-sky-500"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                  class="fill-sky-500"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <LanguageModal ref="languageModal"></LanguageModal>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../store/authStore';
import firebase from '../includes/firebase';
import { useSetupDarkMode } from '../composables/setupDarkMode';
import { useRoute, useRouter } from 'vue-router';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Disclosure,
} from '@headlessui/vue';
import LanguageModal from './UI/LanguageModal.vue';
import type ILanguageModal from './UI/LanguageModal.vue';

import { useI18n } from 'vue-i18n';

//Language
const { t } = useI18n({ useScope: 'global' });

/* Variables */
const authStore = useAuthStore();
const isMobileMenuHidden = ref<boolean>(true);
const darkMode = ref<boolean>(false);
const isDarkModeEnabled: string | null = localStorage.getItem('dark-mode');
const router = useRouter();
const route = useRoute();
const userNavigation = [
  { name: 'menu.language', href: '#', action: openModal },
  { name: 'menu.logout', href: '#', action: signOut },
];
const avatar = ref('/music.png');
const languageModal = ref<InstanceType<typeof ILanguageModal> | null>(null);

/*Initial DarkMode Value*/
darkMode.value = isDarkModeEnabled === 'yes';

/* Actions */
const toggleMobileMenu = (): boolean =>
  (isMobileMenuHidden.value = !isMobileMenuHidden.value);
const toggleDarkMode = (): void => {
  darkMode.value = !darkMode.value;
  localStorage.setItem('dark-mode', darkMode.value ? 'yes' : 'no');
  useSetupDarkMode();
};

/* User's navigation action */
async function openModal() {
  languageModal.value?.open();
}

/**
 * It ends up the user's session
 */
async function signOut() {
  // Sign-out from firebase
  await firebase.signOut();

  // Clean store
  authStore.toggleUserAuthStatus();
  authStore.userData = null;

  // Redirect
  if (route.meta?.requiresAuth) {
    await router.push('/');
  }
}
</script>

<style scoped>
.menu-active,
.dark .menu-active {
  @apply text-amber-600;
}
</style>
