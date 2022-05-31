<script setup lang="ts">
import type { ICommentFirebase } from '../../interfaces/IComment';
import CommentsListItem from './CommentsListItem.vue';

defineProps<{
  comments: ICommentFirebase[];
}>();
</script>

<template>
  <ul class="container mx-auto dark:text-white dark:bg-slate-800">
    <CommentsListItem
      v-for="comment in comments"
      :key="comment.docID"
      :comment="comment"
    />
  </ul>
</template>
