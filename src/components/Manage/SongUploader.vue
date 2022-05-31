<template>
  <div class="col-span-1">
    <div
      class="bg-white dark:bg-slate-800 dark:text-white rounded border border-gray-200 dark:border-slate-600 shadow relative flex flex-col transition duration-500"
    >
      <div
        class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 dark:border-slate-600"
      >
        <span class="card-title">Upload</span>
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <div class="p-6">
        <!-- Upload Dropbox -->
        <DropBox @uploading="updateProgressBars"></DropBox>
        <hr
          v-if="uploadsInProgress.length"
          class="my-6 dark:border-slate-600"
        />
        <!-- Progress Bars -->
        <div
          v-for="uploadTask in uploadsInProgress"
          :key="uploadTask.name"
          class="mb-4"
        >
          <!-- File Name -->
          <ProgressBar
            :upload-task="uploadTask"
            @done="removeProgressBar"
          ></ProgressBar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DropBox from './SongUploaderDropBox.vue';
import ProgressBar from './SongUploaderProgressBar.vue';
import { ref, watch } from 'vue';
import type { UploadInterface } from '../../interfaces/UploadInterface';
import { useSongsStore } from '../../store/songsStore';

const uploadsInProgress = ref<UploadInterface[]>([]);
const songsStore = useSongsStore();

/**
 * Watcher to update the songs list after completing all the uploading tasks.
 */
watch(
  uploadsInProgress,
  async (current: UploadInterface[], previous: UploadInterface[]) => {
    if (previous.length > 0 && current.length === 0) {
      await songsStore.fetchSongs();
      await songsStore.fetchUserSongs();
      songsStore.updateUploadingStatus(false);
    }
  }
);

/**
 * Method to update the list of progress bars to show in the GUI.
 * @param file
 */
const updateProgressBars = (file: UploadInterface) => {
  const index = uploadsInProgress.value.findIndex((f) => f.name === file.name);
  if (index === -1) {
    songsStore.updateUploadingStatus(true);
    uploadsInProgress.value.push(file);
  } else {
    uploadsInProgress.value[index] = file;
  }
};

/**
 * It removes a progress bar from the GUI
 * @param task
 */
const removeProgressBar = async (task: string) => {
  uploadsInProgress.value = uploadsInProgress.value.filter(
    (e) => e.name !== task
  );
};
</script>
