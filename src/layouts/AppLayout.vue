<template>
  <TheHeader />

  <!-- Render the Routes -->
  <router-view v-slot="{ Component, route }">
    <transition name="scale" mode="out-in">
      <div :key="route.name" class="w-full min-h-full">
        <component :is="Component"></component>
      </div>
    </transition>
  </router-view>

  <transition
    name="m-player"
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
    :duration="500"
  >
    <div v-if="playerStore.isPlaying">
      <MusicPlayer />
    </div>
  </transition>

  <AuthModal />
</template>

<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue';
import AuthModal from '../components/AuthModal.vue';
import MusicPlayer from '../components/MusicPlayer.vue';
import { useMusicPlayerStore } from '../store/playerStore';

const playerStore = useMusicPlayerStore();
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
