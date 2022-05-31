<template>
  <AppModal ref="modal" vertical-align="top" horizontal-align="center">
    <div class="p-5 flex gap-2.5">
      <!-- Icon -->
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        :class="iconBackgroundColor"
      >
        <svg
          v-if="status === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 fill-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>

        <svg
          v-else-if="status === 'info'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white fill-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg
          v-else-if="status === 'danger'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white fill-red-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white fill-amber-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <div>
        <!-- Title/Header -->
        <div class="mb-2">
          <div
            class="font-semibold text-slate-800 text-base leading-6 -tracking-[0.01em]"
          >
            {{ title }}
          </div>
        </div>

        <!-- Content -->
        <div class="text-sm mb-10 text-slate-700">
          <slot name="body">
            <p>
              Semper eget duis at tellus at urna condimentum mattis pellentesque
              lacus suspendisse faucibus interdum.
            </p>
          </slot>
        </div>

        <div class="flex flex-wrap justify-end">
          <slot name="footer">
            <button
              type="button"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-slate-800 bg-transparent border border-slate-200 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              @click="close"
            >
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue';
import type IAppModal from './AppModal.vue';
import { computed, ref } from 'vue';
import type { Status } from '../../Types';

/* Properties */
const props = withDefaults(
  defineProps<{
    title: string;
    status?: Status;
  }>(),
  {
    status: 'success',
  }
);

/* Flags and Variables */
const modal = ref<InstanceType<typeof IAppModal> | null>(null);

/* Computed Properties */
const iconBackgroundColor = computed((): string => {
  switch (props.status) {
    case 'success':
      return 'bg-green-500';
    case 'danger':
      return 'bg-red-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-amber-500';
  }
});

/* Methods */
const close = () => {
  modal.value?.close();
};

const open = () => {
  modal.value?.open();
};

/*Expose*/
defineExpose({
  open,
  close,
});
</script>

<style scoped></style>
