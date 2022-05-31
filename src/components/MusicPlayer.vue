<script setup lang="ts">
import { Howl } from 'howler';
import { useMusicPlayerStore } from '../store/playerStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import formatTime from '../helpers/formatTime';

const { song, isPlaying } = storeToRefs(useMusicPlayerStore());

const audio = ref<Howl | null>(null);
const duration = ref<string>('00:00');
const timer = ref<string>('00:00');
const pauseTrack = ref<boolean>(false);
const step = ref<number>(0);
const progressBar = ref<HTMLDivElement | null>(null);

//Methods
const pause = (): void => {
  if (audio.value !== null && audio.value.playing()) {
    audio.value.pause();
  }
};

const play = (): void => {
  if (audio.value === null) {
    audio.value = new Howl({
      src: [song.value?.url as string],
      html5: true,
      format: ['mp3', 'aac'],
      onplay: (): void => {
        pauseTrack.value = true;
        duration.value = formatTime(
          audio.value !== null ? audio.value.duration() : 0
        );
        requestAnimationFrame(updatePlayingProgress.bind(this));
      },
      onpause: (): void => {
        pauseTrack.value = false;
      },
      onend: (): void => {
        pauseTrack.value = false;
      },
      onseek: (): void => {
        window.requestAnimationFrame(updatePlayingProgress.bind(this));
      },
    });
  }

  audio.value.play();
};

const updatePlayingProgress = (): void => {
  if (audio.value !== null) {
    const sound: Howl = audio.value;
    const seek: number = sound.seek();
    timer.value = formatTime(Math.round(seek));
    step.value = (seek * 100) / sound.duration();

    if (sound.playing())
      requestAnimationFrame(updatePlayingProgress.bind(this));
  }
};

const seek = (event: MouseEvent): void => {
  if (progressBar.value && audio.value) {
    const position = event.offsetX / progressBar.value.clientWidth;
    const sound: Howl = audio.value;

    sound.seek(sound.duration() * position);

    if (sound.playing()) {
      sound.pause();
      sound.play();
    }
  }
};

//Watchers
watch(isPlaying, (playing) => {
  if (!playing) {
    if (audio.value !== null) audio.value.stop();
  }
});

// Hooks
onMounted(() => {
  play();
});
</script>

<template>
  <!-- Player -->
  <div
    class="fixed bottom-0 left-0 bg-stone-100 dark:bg-gray-700 p-2 pb-4 text-left align-top w-full h-16 border-t border-t-neutral-300 dark:border-slate-600"
  >
    <div class="md:container md:mx-auto">
      <div class="flex justify-center space-x-4 items-center">
        <!-- Play Controls  -->
        <div class="flex space-x-3 p-2">
          <!-- Play Button -->
          <button
            v-if="!pauseTrack"
            class="hover:bg-amber-600 hover:text-white hover:ring-amber-500 transition-all rounded-full w-8 h-8 flex items-center justify-center pl-0.5 ring-2 ring-slate-700 dark:ring-gray-200 focus:outline-none"
            @click.prevent="play"
          >
            <svg
              class="w-5 h-5 dark:fill-amber-600 dark:text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>

          <!-- Pause Button -->
          <button
            v-else
            class="hover:bg-amber-600 hover:text-white hover:ring-amber-500 transition-all rounded-full w-8 h-8 flex items-center justify-center ring-2 ring-slate-700 dark:ring-gray-200 focus:outline-none"
            @click.prevent="pause"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 dark:fill-amber-600 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        <!-- Progress Bar -->
        <div
          class="flex justify-start space-x-2 items-center text-xs font-semibold text-gray-500 dark:text-white w-3/4"
        >
          <div class="text-amber-600">{{ timer }}</div>
          <div class="flex w-full">
            <div
              ref="progressBar"
              class="relative w-full bg-gray-200 rounded-full h-1.5 dark:bg-slate-800 cursor-pointer"
              @click="seek($event)"
            >
              <div
                class="absolute h-full bg-green-500 flex items-center justify-end"
                :style="{ width: step + '%' }"
              >
                <div class="rounded-full w-3 h-3 bg-white shadow"></div>
              </div>
            </div>
          </div>
          <div>{{ duration }}</div>
        </div>

        <!-- Artist Info  -->
        <div class="flex justify-start items-center space-x-4 text-left">
          <div class="p-2 bg-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 dark:text-white">
              {{ song.modified_name }}
            </div>
            <div class="text-xs font-semibold text-gray-500 dark:text-white">
              Uploaded By {{ song.display_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
