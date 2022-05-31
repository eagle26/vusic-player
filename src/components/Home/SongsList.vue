<template>
  <div
    class="bg-white dark:bg-slate-800 dark:border-slate-600 rounded border border-gray-200 relative flex flex-col dark:text-white"
  >
    <div
      class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 dark:border-slate-600"
    >
      <span class="card-title">Songs</span>
      <!-- Icon -->
      <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
    </div>
    <!-- Playlist -->
    <div v-if="loading" class="h-80 flex items-center justify-center w-full">
      <TheSpinner size="lg" />
    </div>
    <ol v-else id="playlist">
      <SongsListItem
        v-for="song in songs"
        :key="song.docId"
        :song="song"
      ></SongsListItem>
    </ol>
    <!-- .. end Playlist -->
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useSongsStore } from '../../store/songsStore';
import { storeToRefs } from 'pinia';
import SongsListItem from './SongsListItem.vue';
import TheSpinner from '../UI/TheSpinner.vue';

const { loading, songs } = storeToRefs(useSongsStore());
const { fetchSongs } = useSongsStore();

//Flags and variables
const pendingRequests = ref<boolean>(false);

//Actions
const handleScroll = () => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    loadSongs();
  }
};

const loadSongs = async () => {
  //Avoid multiple requests
  if (pendingRequests.value) {
    return;
  }

  pendingRequests.value = true;
  await fetchSongs();
  pendingRequests.value = false;
};

//Life cycle
onBeforeUnmount((): void => {
  window.removeEventListener('scroll', handleScroll);
});

onMounted(async (): Promise<void> => {
  await loadSongs();
  window.addEventListener('scroll', handleScroll);
});
</script>
