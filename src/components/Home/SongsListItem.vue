<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 dark:hover:bg-slate-700"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docId } }"
        class="font-bold block text-gray-600 dark:text-white"
        >{{ song.modified_name }}</router-link
      >
      <span class="text-gray-500 text-sm dark:text-gray-400">
        {{ song.display_name }}
      </span>
    </div>

    <div class="text-gray-600 text-lg dark:text-gray-400">
      <router-link
        v-slot="{ navigate }"
        custom
        :to="{
          name: 'song',
          params: { id: props.song.docId },
          hash: '#comments',
        }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600 dark:text-gray-400"></i>
          {{ comments }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { SongFirebaseDocInterface } from '../../interfaces/SongFirebaseDocInterface';
import { onMounted, ref } from 'vue';
import firebase from '../../includes/firebase';

//Component properties
const props = defineProps<{
  song: SongFirebaseDocInterface;
}>();

//Variables and Flags
const comments = ref<number>(0);

//Hooks
onMounted(async () => {
  const data = await firebase.getSongComments(props.song.docId);
  comments.value = data.length;
});
</script>
