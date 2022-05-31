<template>
  <div class="border border-gray-200 dark:border-slate-600 p-3 mb-4 rounded">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      :duration="200"
    >
      <div v-if="!showForm">
        <h4 class="inline-block text-lg font-bold">
          {{ props.song.modified_name }}
        </h4>
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-700 float-right"
          :class="{ 'cursor-not-allowed': deleting }"
          :disabled="deleting"
          @click.prevent="remove"
        >
          <TheSpinner v-if="deleting" size="xsm" fill-color="fill-white" />
          <i v-else class="fa fa-times"></i>
        </button>
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-slate-700 float-right"
          :class="{ 'cursor-not-allowed': deleting }"
          :disabled="deleting"
          @click.prevent="toggleForm"
        >
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>

      <div v-else>
        <form @submit.prevent="submit">
          <!-- Submit Spinner -->
          <div class="text-center">
            <TheSpinner v-if="submittingForm" />
          </div>

          <SuccessAlert
            v-if="showSuccessAlert"
            title="Success!"
            message="The song has been successfully edited."
          ></SuccessAlert>

          <!-- Error Message -->
          <DangerAlert
            v-if="errorMessage"
            :message="errorMessage"
          ></DangerAlert>

          <div class="mb-3">
            <label class="inline-block mb-2">Song Title</label>
            <input
              v-model="form.modified_name"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded dark:bg-gray-700 dark:border-slate-600 dark:placeholder:text-gray-400 dark:text-gray-100"
              :class="{
                border: vuelidate.modified_name.$error,
                'border-red-500': vuelidate.modified_name.$error,
              }"
              placeholder="Enter Song Title"
              @blur="vuelidate.modified_name.$touch"
            />
            <p
              v-if="vuelidate.modified_name.$error"
              class="text-red-500 text-xs italic"
            >
              {{ vuelidate.modified_name.$errors[0].$message }}
            </p>
          </div>
          <div class="mb-3">
            <label class="inline-block mb-2">Genre</label>
            <input
              v-model="form.genre"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded dark:bg-gray-700 dark:border-slate-600 dark:placeholder:text-gray-400 dark:text-gray-100"
              :class="{
                border: vuelidate.genre.$error,
                'border-red-500': vuelidate.genre.$error,
              }"
              placeholder="Enter Genre"
              @blur="vuelidate.genre.$touch"
            />
            <p
              v-if="vuelidate.genre.$error"
              class="text-red-500 text-xs italic"
            >
              {{ vuelidate.genre.$errors[0].$message }}
            </p>
          </div>
          <div class="flex flex-row space-x-2 justify-end">
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-700"
              :class="{ 'cursor-not-allowed': submittingForm }"
              :disabled="submittingForm"
            >
              <TheSpinner v-if="submittingForm" size="xsm"></TheSpinner>
              {{ updateLabel }}
            </button>
            <button
              type="button"
              class="py-1.5 px-3 rounded text-white bg-slate-700"
              @click="toggleForm"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { SongFirebaseDocInterface } from '../../interfaces/SongFirebaseDocInterface';
import { computed, reactive, ref } from 'vue';
import {
  alphaNum,
  helpers,
  maxLength,
  minLength,
  required,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import TheSpinner from '../UI/TheSpinner.vue';
import type { SongEditionInterface } from '../../interfaces/SongEditionInterface';
import SuccessAlert from '../UI/SuccessAlert.vue';
import DangerAlert from '../UI/DangerAlert.vue';
import { useSongsStore } from '../../store/songsStore';

// Component Properties
const props = defineProps<{
  song: SongFirebaseDocInterface;
}>();

// Component Emits
const emit = defineEmits<{
  (e: 'error', message: string): void;
}>();

//Flags and Variables
const showForm = ref<boolean>(false);
const submittingForm = ref<boolean>(false);
const showSuccessAlert = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const songsStore = useSongsStore();
const deleting = ref<boolean>(false);

/* Computed Properties */
const updateLabel = computed((): string => {
  if (submittingForm.value) return 'Updating...';

  return 'Update';
});

/* Init form data */
const initialState: SongEditionInterface = {
  modified_name: props.song.modified_name,
  genre: props.song.genre,
};

const form = reactive<SongEditionInterface>({ ...initialState });

/* Validations */
const rules = {
  modified_name: {
    required: helpers.withMessage(
      'Please provide a customized song name',
      required
    ),
    minLength: minLength(3),
    maxLength: maxLength(60),
  },
  genre: {
    minLength: minLength(3),
    maxLength: maxLength(20),
    alpha: alphaNum,
  },
};

const vuelidate = useVuelidate(rules, form);

/* Actions */

// Update song data
const submit = async () => {
  vuelidate.value.$touch();
  submittingForm.value = true;

  //Check validations
  if (!(await vuelidate.value.$validate())) {
    submittingForm.value = false;
    return;
  }

  try {
    await songsStore.updateSong(form, props.song.docId);
  } catch (error) {
    errorMessage.value = 'Something went wrong, please try again later!';

    //Clean the error message after 5 seconds
    setTimeout((): void => {
      errorMessage.value = null;
    }, 5000);

    submittingForm.value = false;
    return;
  }

  showSuccessAlert.value = true;
  errorMessage.value = null;
  submittingForm.value = false;

  //Clean the success message after 5 seconds
  setTimeout((): void => {
    showSuccessAlert.value = false;
  }, 5000);

  return;
};

//Remove a song
const remove = async () => {
  deleting.value = true;
  try {
    await songsStore.removeSong(props.song);
  } catch (e) {
    emit(
      'error',
      'Something went wrong while deleting the song. Please try again later!'
    );
  }

  deleting.value = false;
};

const toggleForm = (): boolean => (showForm.value = !showForm.value);
</script>
