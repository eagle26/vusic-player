<template>
  <BaseAlert
    text-color="text-red-700"
    bg-color="bg-red-100"
    dark-text-color="dark:text-white"
    dark-bg-color="dark:bg-red-700"
  >
    <template v-if="props.title" #title>
      {{ props.title }}
    </template>

    <template #default>
      {{ props.message }}
    </template>
  </BaseAlert>
</template>

<script setup lang="ts">
import BaseAlert from './BaseAlert.vue';

interface Props {
  title?: string;
  message: string;
}

const props = defineProps<Props>();
</script>

<style scoped></style>
