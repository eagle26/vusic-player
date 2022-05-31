<template>
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        @click="playSong"
      >
        <i v-if="!musicPlayer.isPlaying" class="fas fa-play"></i>
        <i v-else class="fas fa-stop"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song?.modified_name }}</div>
        <div>{{ song?.genre }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SongFirebaseDocInterface } from '../../interfaces/SongFirebaseDocInterface';
import { useMusicPlayerStore } from '../../store/playerStore';
import { onMounted } from 'vue';

//Component Properties
const props = defineProps<{
  song: SongFirebaseDocInterface | null;
}>();

// Flags and Variables
const musicPlayer = useMusicPlayerStore();

//Methods
const playSong = (): void => {
  if (!musicPlayer.isPlaying) {
    musicPlayer.song = props.song;
    musicPlayer.isPlaying = true;
  } else {
    musicPlayer.song = null;
    musicPlayer.isPlaying = false;
  }
};

//Hooks
onMounted((): void => {
  //Reset music player store after selecting a new song
  musicPlayer.song = null;
  musicPlayer.isPlaying = false;
});
</script>
