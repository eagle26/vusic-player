<script setup lang="ts">
import { reactive, ref } from 'vue';
import { helpers, required, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import TheSpinner from '../UI/TheSpinner.vue';
import SuccessAlert from '../UI/SuccessAlert.vue';
import DangerAlert from '../UI/DangerAlert.vue';
import firebase from '../../includes/firebase';
import { useAuthStore } from '../../store/authStore';
import type { SongFirebaseDocInterface } from '../../interfaces/SongFirebaseDocInterface';
import { FUtils } from '../../Types';
import { useI18n } from 'vue-i18n';

//Language
const { t } = useI18n();

//Events
const emits = defineEmits<{
  (e: 'commentAdded', id: string): void;
  (e: 'updateSortingMode', sort: number): void;
}>();

//Properties
const props = defineProps<{
  song: SongFirebaseDocInterface | null;
  commentsCounter: number;
  sortMode: number;
}>();

//Variables and Flags
const userStore = useAuthStore();

interface Props {
  comment: string;
}

const initialState: Props = {
  comment: '',
};

const form = reactive<Props>({ ...initialState });
const submitting = ref<boolean>(false);
const doneWithSuccess = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

/* Validation Rules */
const rules = {
  comment: {
    required: helpers.withMessage(
      'Please provide some content for your comment',
      required
    ),
    minLength: helpers.withMessage(
      'Your comment has to contain at least 10 characters.',
      minLength(10)
    ),
  },
};

const vuelidate = useVuelidate(rules, form);

/* actions/methods */
const sortUpdated = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emits('updateSortingMode', parseInt(target.value));
};

const submit = async (): Promise<void> => {
  vuelidate.value.$touch();
  submitting.value = true;

  //Check validations
  if (!(await vuelidate.value.$validate())) {
    submitting.value = false;
    return;
  }

  const uid = userStore.userData?.uid as string;
  const songID = props.song?.docId as string;
  const author = userStore.userData?.displayName as string;

  try {
    await firebase.addSongComment({
      comment: form.comment,
      userID: uid,
      songID: songID,
      author: author,
      postedAt: new Date().toString(),
    });
  } catch (e: unknown) {
    submitting.value = false;
    let error = 'An unexpected error occurred. Please try again later.';

    if (e instanceof FUtils.FirebaseError) {
      error = e.message;
    }

    errorMessage.value = error;
    return;
  }

  //Update Flags
  doneWithSuccess.value = true;
  submitting.value = false;

  //Reset Form
  Object.assign(form, initialState);
  vuelidate.value.$reset();

  //Update list of Comments
  emits('commentAdded', songID);

  //Hide Success Info
  setTimeout(() => {
    doneWithSuccess.value = false;
  }, 6000);

  return;
};
</script>

<template>
  <section class="container mx-auto mt-6 dark:text-white">
    <div
      id="comments"
      class="bg-white dark:bg-slate-800 dark:border-slate-600 rounded border border-gray-200 relative flex flex-col"
    >
      <div
        class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 dark:border-slate-600"
      >
        <!-- Comment Count -->
        <span class="card-title">{{
          t('song.comments', { count: commentsCounter })
        }}</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          v-if="submitting"
          class="flex justify-center items-center w-full mb-4"
        >
          <TheSpinner size="md"></TheSpinner>
        </div>

        <!-- Success Message -->
        <SuccessAlert
          v-if="doneWithSuccess"
          title="Success!"
          message="The comment has been added."
        ></SuccessAlert>

        <!-- Error Message -->
        <DangerAlert v-if="errorMessage" :message="errorMessage"></DangerAlert>

        <form v-if="userStore.isUserLoggedIn" @submit.prevent="submit">
          <textarea
            v-model="form.comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4 dark:bg-gray-700 dark:border-slate-600 dark:placeholder:text-gray-400 dark:text-gray-100"
            :class="{
              border: vuelidate.comment.$error,
              'border-red-500 dark:border-red-600 mb-2':
                vuelidate.comment.$error,
            }"
            placeholder="Your comment here..."
            @blur="vuelidate.comment.$touch"
          ></textarea>
          <p
            v-if="vuelidate.comment.$error"
            class="text-red-500 text-sm italic mb-4"
          >
            {{ vuelidate.comment.$errors[0].$message }}
          </p>

          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :class="{ 'cursor-not-allowed': submitting }"
            :disabled="submitting"
          >
            <TheSpinner v-if="submitting" size="xsm"></TheSpinner>
            Add Comment
          </button>
        </form>
        <!-- Sort Comments -->
        <select
          class="block mt-4 py-1.5 px-3 w-40 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded dark:bg-gray-700 dark:border-slate-600 dark:placeholder:text-gray-400 dark:text-gray-100"
          @change="sortUpdated"
        >
          <option value="1" :selected="sortMode === 1">Latest</option>
          <option value="2" :selected="sortMode === 2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
</template>
