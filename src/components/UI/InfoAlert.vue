<template>
  <BaseAlert
    text-color="text-blue-700"
    bg-color="bg-blue-100"
    dark-text-color="dark:text-blue-800"
    dark-bg-color="dark:bg-blue-200"
  >
    <template v-if="props.title" #title> {{ props.title }}&nbsp; </template>

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
