<template>
  <HeroSection>
    <template #title>About</template>
    <template #default>
      The music app is a demo app created during a
      <a :href="courseLink" target="_blank" class="project-link">
        training course by ZTM at Udemy</a
      >. <br /><br />
      The instructor used Vue CLI, Vue UI, Vuex, and Javascript during the
      course. However, I used
      <a :href="piniaLink" target="_blank" class="project-link">Pinia</a>,
      <a :href="viteLink" target="_blank" class="project-link">Vite</a>, and
      <a :href="tsLink" target="_blank" class="project-link">Typescript</a>
      because those are the recommended tools/plugins by the Vue framework.
    </template>
  </HeroSection>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue';
import { ref } from 'vue';

const courseLink = ref<string>(
  'https://www.udemy.com/course/complete-vue-js-developer-zero-to-mastery-vuex'
);
const piniaLink = ref<string>('https://pinia.vuejs.org/');
const viteLink = ref<string>('https://vitejs.dev/');
const tsLink = ref<string>('https://www.typescriptlang.org/');
</script>

<style scoped>
.project-link {
  @apply text-amber-400 underline cursor-pointer;
}
</style>
