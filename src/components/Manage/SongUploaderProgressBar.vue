<template>
  <!-- Task Title -->
  <div class="font-bold text-sm">
    <div class="flex items-center space-x-2">
      <!-- Icon -->
      <div>
        <transition
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__zoomOut"
          :duration="500"
        >
          <TheSpinner
            v-if="props.uploadTask.status === 'in_progress'"
            size="xsm"
          ></TheSpinner>
          <svg
            v-else-if="props.uploadTask.status === 'done'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </transition>
      </div>

      <!-- Title -->
      <div>
        {{ props.uploadTask.name }}
      </div>
    </div>
  </div>

  <!-- Task Progress -->
  <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
    <div
      class="transition-all progress-bar"
      :class="barColor"
      :style="{ width: barWidth + '%' }"
    ></div>
  </div>

  <!-- Backend Error Message -->
  <p v-if="uploadTask.errorMsg" class="text-red-600 text-base font-semibold">
    {{ uploadTask.errorMsg }}
  </p>
</template>

<script setup lang="ts">
import type { UploadInterface } from '../../interfaces/UploadInterface';
import { computed, watch } from 'vue';
import TheSpinner from '../UI/TheSpinner.vue';

//Component Properties
const props = defineProps<{
  uploadTask: UploadInterface;
}>();

/* Emits */
const emit = defineEmits<{
  (e: 'done', payload: string): void;
}>();

/* Watchers */
watch(props.uploadTask, (taskStatus: UploadInterface) => {
  if (taskStatus.status === 'failed' || taskStatus.status === 'done') {
    setTimeout(() => {
      emit('done', taskStatus.name);
    }, 4000);
  }
});

//Dynamic Bar Color
const barColor = computed((): string => {
  const progress = props.uploadTask.progress;

  if (props.uploadTask.status === 'failed') return 'bg-red-400';

  if (progress >= 40 && progress < 79) {
    return 'bg-blue-400';
  } else if (progress >= 0 && progress <= 39) {
    return 'bg-amber-400';
  }

  return 'bg-green-400';
});

/**
 * Dynamic Bar width.
 * When the upload fails, then fill the bar manually
 */
const barWidth = computed((): number => {
  if (props.uploadTask.status === 'failed') return 100;

  return props.uploadTask.progress;
});
</script>
