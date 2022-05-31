<template>
  <!-- PWA -->
  <Teleport to="body">
    <ReloadPWA></ReloadPWA>
  </Teleport>

  <!-- Render Routes -->
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSetupAuthData } from './composables/setupAuthData';
import { useSetupDarkMode } from './composables/setupDarkMode';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import ReloadPWA from './components/ReloadPWA.vue';

const { locale } = useI18n({ useScope: 'global' });
const appLocale = useStorage('app-locale', 'en');

onMounted(() => {
  useSetupAuthData();
  useSetupDarkMode();
  locale.value = appLocale.value;
});
</script>
