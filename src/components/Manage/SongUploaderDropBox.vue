<template>
  <div
    class="w-full px-10 py-20 rounded text-center cursor-pointer border-4 border-dashed transition duration-500 hover:text-white hover:bg-amber-600 hover:border-amber-600"
    :class="dropboxStyle"
    @drag.prevent.stop=""
    @dragstart.prevent.stop=""
    @dragend.prevent.stop="setDraggingState(false)"
    @dragover.prevent.stop="setDraggingState(true)"
    @dragenter.prevent.stop="setDraggingState(true)"
    @dragleave.prevent.stop="setDraggingState(false)"
    @drop.prevent.stop="upload($event)"
  >
    <div class="flex flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
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
      <h5>Drop your files here</h5>
    </div>
  </div>

  <input
    type="file"
    class="file:dark:bg-slate-800 file:text-white file:dark:text-gray-400 file:py-1.5 file:px-2 file:border-none file:bg-amber-600 file:cursor-pointer block w-full text-sm text-gray-900 bg-gray-100 rounded border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-700 text-sm"
    multiple
    accept="audio/mpeg"
    @change="upload($event)"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import firebase from '../../includes/firebase';
import type { UploadInterface } from '../../interfaces/UploadInterface';
import type { SongInterface } from '../../interfaces/SongInterface';
import { useAuthStore } from '../../store/authStore';
import { FUtils, FStore } from '../../Types';
import { useNetwork } from '@vueuse/core';

/* Flags and Variables */
const isDragging = ref<boolean>(false);
const filesUploads = ref<UploadInterface[]>([]);
const authStore = useAuthStore();
const { isOnline } = useNetwork();

/* It updates the dropbox style depending on the dragging status */
const dropboxStyle = computed((): string => {
  if (isDragging.value) {
    return 'text-white bg-amber-600 border-amber-600';
  }

  return 'border-gray-400 text-gray-400';
});

/**
 * it updates the dragging status
 * @param dragging
 */
const setDraggingState = (dragging: boolean): void => {
  isDragging.value = dragging;
};

/* Emits */
const emit = defineEmits<{
  (e: 'uploading', payload: UploadInterface): void;
}>();

/**
 * Uploading action
 * @param event
 */
const upload = (event: DragEvent | Event) => {
  setDraggingState(false);
  let files: FileList | null = null;

  //Get the list of files depending on the type of event
  if (event instanceof DragEvent) {
    files = event.dataTransfer?.files ?? null;
  } else {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      files = target.files;
    }
  }

  //If the user has selected files, then start to upload them
  if (files) {
    const droppedFiles = [...files];
    droppedFiles.forEach((file: File) => {
      if (file.type !== 'audio/mpeg') {
        return;
      }

      if (!isOnline.value) {
        const uploadIndex =
          filesUploads.value.push({
            task: null,
            progress: 100,
            name: file.name,
            status: 'failed',
            errorMsg: 'You are currently offline',
          }) - 1;

        emit('uploading', filesUploads.value[uploadIndex]);

        return;
      }

      //Upload to firebase
      const task = firebase.upload(file, 'songs');

      //Store the progress
      const uploadIndex =
        filesUploads.value.push({
          task: task,
          progress: 0,
          name: file.name,
          status: 'in_progress',
        }) - 1;

      task.on(
        'state_changed',
        (snapshot) => {
          filesUploads.value[uploadIndex].progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          emit('uploading', filesUploads.value[uploadIndex]);
        },
        (e: FStore.StorageError) => {
          filesUploads.value[uploadIndex].errorMsg = `[${e.code} ${e.message}]`;
          filesUploads.value[uploadIndex].status = 'failed';
        },
        async () => {
          const song: SongInterface = {
            uid: authStore.userData?.uid,
            display_name: authStore.userData?.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name,
            genre: '',
            url: null,
          };

          song.url = await firebase.getFileURL(task.snapshot.ref);
          try {
            await firebase.putSongInfo(song);
          } catch (e) {
            if (e instanceof FUtils.FirebaseError) {
              filesUploads.value[
                uploadIndex
              ].errorMsg = `[${e.code} ${e.message}]`;
            }
          }

          filesUploads.value[uploadIndex].status = 'done';
        }
      );
    });
  }
};

/**
 * It cancels the file upload if the user leaves the page
 */
const cancelUploads = () => {
  filesUploads.value.forEach((item: UploadInterface) => {
    item.task?.cancel();
  });
};

/* Call the method cancelUploads before unmounting the component */
onBeforeUnmount(() => {
  cancelUploads();
});
</script>
