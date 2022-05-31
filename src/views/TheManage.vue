<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <SongUploader></SongUploader>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col dark:bg-slate-800 dark:border-slate-600 dark:text-white transition duration-500"
        >
          <div
            class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 dark:border-slate-600"
          >
            <span class="card-title">My Songs</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 float-right"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div class="p-6">
            <!-- Loader -->
            <div class="text-center">
              <TheSpinner v-if="loading" size="lg"></TheSpinner>
            </div>

            <DangerAlert
              v-if="errorMessage"
              :message="errorMessage"
              title="Oops, "
            />

            <!-- Composition Items -->
            <SongItem
              v-for="song in userSongs"
              :key="song.docId"
              :song="song"
              @error="showError"
            ></SongItem>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SongUploader from '../components/Manage/SongUploader.vue';
import { storeToRefs } from 'pinia';
import { useSongsStore } from '../store/songsStore';
import { onMounted, ref } from 'vue';
import TheSpinner from '../components/UI/TheSpinner.vue';
import SongItem from '../components/Manage/SongItem.vue';
import DangerAlert from '../components/UI/DangerAlert.vue';
import { onBeforeRouteLeave } from 'vue-router';

// Variables and Flags
const { unsavedChanges, loading, userSongs } = storeToRefs(useSongsStore());
const songsStore = useSongsStore();
const errorMessage = ref<string | null>(null);

// Actions
const showError = (error: string) => {
  errorMessage.value = error;

  //hide error message after 5 seconds
  setTimeout((): void => {
    errorMessage.value = null;
  }, 7000);
};

//Routes
onBeforeRouteLeave(() => {
  if (unsavedChanges.value) {
    const answer = window.confirm(
      'Do you really want to leave? you have unsaved changes!'
    );

    // cancel the navigation and stay on the same page
    if (!answer) return false;
  }
});

// Life cycle
onMounted(async () => {
  await songsStore.fetchUserSongs();
});
</script>

<style scoped></style>
