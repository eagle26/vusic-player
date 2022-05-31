<template>
  <!-- Introduction -->
  <TheHeader v-if="!loading" :song="song" />
  <CommentsForm
    v-if="!loading"
    :song="song"
    :comments-counter="commentsCounter"
    :sort-mode="sort"
    @comment-added="loadComments"
    @update-sorting-mode="updateCommentsSorting"
  />

  <CommentsList v-if="!loading" :comments="sortedComments" />

  <!-- Main Content -->
  <section class="container mx-auto mb-24"></section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { useSongsStore } from '../store/songsStore';
import { storeToRefs } from 'pinia';
import TheHeader from '../components/Song/TheHeader.vue';
import CommentsForm from '../components/Song/CommentsForm.vue';
import CommentsList from '../components/Song/CommentsList.vue';
import type { ICommentFirebase } from '../interfaces/IComment';
import firebase from '../includes/firebase';

// Flags and Variables
const route = useRoute();
const router = useRouter();
const { loading, song } = storeToRefs(useSongsStore());
const store = useSongsStore();
const comments = ref<ICommentFirebase[]>([]);
const commentsCounter = ref<number>(0);
const sort = ref<number>(1); // 0 - Oldest to Newest, 1- Newest to Oldest

//Computed
const sortedComments = computed((): ICommentFirebase[] => {
  return comments.value
    .slice()
    .sort((a: ICommentFirebase, b: ICommentFirebase): number => {
      if (sort.value === 1) {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      }

      return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
    });
});

// Methods
const updateCommentsSorting = (sortMode: number): void => {
  sort.value = sortMode;
};

const loadComments = async (songID: string): Promise<void> => {
  comments.value = await firebase.getSongComments(songID);
  commentsCounter.value = comments.value.length;
};

//Watchers
watch(sort, (currentSort: number): void => {
  if ('sort' in route.query) {
    const querySort = Number(route.query.sort);

    if (querySort === currentSort) return;
  }

  router.push({
    query: {
      sort: currentSort,
    },
  });
});

// Hooks
onMounted(async (): Promise<void> => {
  const docID = route.params.id as string;
  const result = await store.getSong(docID);

  //If the song doesn't exist, then redirect to the Not Found page
  if (!result) await router.push({ name: 'not-found' });

  // Configure sort method from browser query parameters
  if ('sort' in route.query) {
    const querySort = String(route.query.sort);
    const validSortValues = ['1', '2'];
    sort.value = validSortValues.includes(querySort) ? Number(querySort) : 1;
  }

  await loadComments(docID);
});
</script>
