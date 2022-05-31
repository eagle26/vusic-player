<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
} from '@headlessui/vue';
import { computed, ref } from 'vue';

/* Properties */
interface Props {
  verticalAlign?: 'top' | 'bottom' | 'center';
  horizontalAlign?: 'left' | 'right' | 'center';
}

const props = withDefaults(defineProps<Props>(), {
  verticalAlign: 'center',
  horizontalAlign: 'center',
});

const verticalAlign = computed((): string => {
  switch (props.verticalAlign) {
    case 'top':
      return 'items-start';
    case 'bottom':
      return 'items-end';
    default:
      return 'items-center';
  }
});

const horizontalAlign = computed((): string => {
  switch (props.horizontalAlign) {
    case 'left':
      return 'justify-start';
    case 'right':
      return 'justify-end';
    default:
      return 'justify-center';
  }
});

/* Variables and Flags */
const isOpen = ref(false);

/* Actions */
const open = (): void => {
  isOpen.value = true;
};

const close = (): void => {
  isOpen.value = false;
};

/* Expose Actions or Variables */
defineExpose({
  open,
  close,
});
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="close">
      <div
        class="fixed flex h-full left-0 overflow-x-hidden overflow-y-auto right-0 top-0 w-full z-50"
        :class="[verticalAlign, horizontalAlign]"
      >
        <div
          class="px-4 text-center relative p-4 w-full max-w-2xl h-full md:h-auto"
        >
          <!-- Modal Backdrop -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-slate-900/70" />
          </TransitionChild>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="relative text-left transition-all transform bg-white dark:bg-slate-800 dark:text-white shadow-xl rounded overflow-auto"
            >
              <!-- Modal -->
              <slot></slot>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
