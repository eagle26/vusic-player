<script setup lang="ts">
import type { ICommentFirebase } from '../../interfaces/IComment';

defineProps<{
  comment: ICommentFirebase;
}>();
</script>

<template>
  <li
    class="p-6 bg-gray-50 border border-gray-200 dark:text-white dark:bg-slate-800 dark:border-slate-600"
  >
    <!-- Comment Author -->
    <div class="mb-5">
      <div class="font-bold">{{ comment.author }}</div>
      <time>{{ comment.postedAt }}</time>
    </div>

    <p>{{ comment.comment }}</p>
  </li>
</template>
