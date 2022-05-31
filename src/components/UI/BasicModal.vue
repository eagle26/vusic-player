<template>
  <AppModal ref="modal" vertical-align="top" horizontal-align="center">
    <!-- Modal Title -->
    <div
      class="pl-5 pr-5 pt-3 pb-3 border-b border-slate-200 dark:border-slate-600"
    >
      <div class="flex justify-between items-center">
        <div class="font-semibold text-slate-800 dark:text-white">
          {{ props.title }}
        </div>
        <button class="text-slate-200" @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 fill-current hover:fill-slate-600 transition-all duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <form @submit.prevent="emits('submit', $event)">
      <!-- Modal Body -->
      <div class="pt-4 pb-4 pl-5 pr-5">
        <slot name="body">
          <p class="text-sm text-gray-500">
            Jeez! You forgot to add some text to your modal body!
          </p>
        </slot>
      </div>

      <!-- Modal Footer -->
      <div
        v-if="!hideFooter"
        class="pt-4 pb-4 pl-5 pr-5 border-t dark:border-slate-600"
      >
        <div class="flex flex-wrap justify-end space-x-2">
          <slot name="footer">
            <button
              type="button"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-slate-800 bg-transparent border border-slate-200 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:text-white"
              @click="close"
            >
              Got it, thanks!
            </button>
          </slot>
        </div>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue';
import type IAppModal from './AppModal.vue';
import { ref } from 'vue';

/* Emits */
const emits = defineEmits<{
  (e: 'submit', payload: Event): void;
}>();

/* Properties */
const props = withDefaults(
  defineProps<{
    title: string;
    hideFooter?: boolean;
  }>(),
  {
    hideFooter: false,
  }
);

/* Flags and Variables */
const modal = ref<InstanceType<typeof IAppModal> | null>(null);

const close = () => {
  modal.value?.close();
};

const open = () => {
  modal.value?.open();
};

/*Expose*/
defineExpose({
  close,
  open,
});
</script>

<style scoped></style>
