<template>
  <form @submit.prevent="submitRegistrationForm">
    <!-- Submit Spinner -->
    <div class="text-center">
      <TheSpinner v-if="submittingForm" size="lg" />
    </div>

    <!-- Success Message -->
    <SuccessAlert
      v-if="accountCreated"
      title="Success!"
      message="Your account has been created."
    ></SuccessAlert>

    <!-- Error Message -->
    <DangerAlert v-if="errorMessage" :message="errorMessage"></DangerAlert>

    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <input
        v-model="registrationForm.name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :class="{
          border: vuelidate.name.$error,
          'border-red-500': vuelidate.name.$error,
        }"
        placeholder="Enter Name"
        @blur="vuelidate.name.$touch"
      />
      <p v-if="vuelidate.name.$error" class="text-red-500 text-xs italic">
        {{ vuelidate.name.$errors[0].$message }}
      </p>
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <input
        v-model="registrationForm.email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :class="{
          border: vuelidate.email.$error,
          'border-red-500': vuelidate.email.$error,
        }"
        placeholder="Enter Email"
        @blur="vuelidate.email.$touch"
      />
      <p v-if="vuelidate.email.$error" class="text-red-500 text-xs italic">
        {{ vuelidate.email.$errors[0].$message }}
      </p>
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <input
        v-model="registrationForm.age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :class="{
          border: vuelidate.age.$error,
          'border-red-500': vuelidate.age.$error,
        }"
        @blur="vuelidate.age.$touch"
      />
      <p v-if="vuelidate.age.$error" class="text-red-500 text-xs italic">
        {{ vuelidate.age.$errors[0].$message }}
      </p>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <input
        v-model="registrationForm.password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :class="{
          border: vuelidate.password.$error,
          'border-red-500': vuelidate.password.$error,
        }"
        placeholder="Password"
        @blur="vuelidate.password.$touch"
      />
      <p v-if="vuelidate.password.$error" class="text-red-500 text-xs italic">
        {{ vuelidate.password.$errors[0].$message }}
      </p>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <input
        v-model="registrationForm.confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :class="{
          border: vuelidate.confirm_password.$error,
          'border-red-500': vuelidate.confirm_password.$error,
        }"
        placeholder="Confirm Password"
        @blur="vuelidate.confirm_password.$touch"
      />
      <p
        v-if="vuelidate.confirm_password.$error"
        class="text-red-500 text-xs italic"
      >
        This field's value must match with the password field
      </p>
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <select
        v-model="registrationForm.country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :class="{
          border: vuelidate.country.$error,
          'border-red-500': vuelidate.country.$error,
        }"
        @change="vuelidate.country.$touch"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Russia">Russia</option>
      </select>
      <p v-if="vuelidate.country.$error" class="text-red-500 text-xs italic">
        {{ vuelidate.country.$errors[0].$message }}
      </p>
    </div>

    <!-- TOS -->
    <div class="mb-3 pl-6 flex-row">
      <div class="flex items-center justify-self-start">
        <input
          v-model="registrationForm.tos"
          type="checkbox"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded appearance-none accent-blue-500"
          :class="{
            border: vuelidate.tos.$error,
            'border-red-500': vuelidate.tos.$error,
          }"
          @change="vuelidate.tos.$touch"
        />

        <i18n-t keypath="auth.accept_terms" tag="label" class="ml-1">
          <a
            href="https://google.com"
            class="text-purple-800"
            target="_blank"
            >{{ t('auth.tos') }}</a
          >
        </i18n-t>
      </div>
      <div>
        <p v-if="vuelidate.tos.$error" class="text-red-500 text-xs italic">
          You must accept the terms of service
        </p>
      </div>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="{ 'cursor-not-allowed': submittingForm }"
      :disabled="submittingForm"
    >
      <TheSpinner v-if="submittingForm" size="xsm"></TheSpinner>
      Submit
    </button>
  </form>
</template>

<script setup lang="ts">
// Imports
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import {
  email,
  required,
  integer,
  sameAs,
  minValue,
  maxValue,
  minLength,
  maxLength,
  not,
  helpers,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import type { UserRegistrationInterface } from '../../interfaces/UserRegistrationInterface';
import TheSpinner from '../UI/TheSpinner.vue';
import SuccessAlert from '../UI/SuccessAlert.vue';
import DangerAlert from '../UI/DangerAlert.vue';
import { useAuthStore } from '../../store/authStore';
import firebase from '../../includes/firebase';
import { useSetupAuthData } from '../../composables/setupAuthData';
import { useI18n } from 'vue-i18n';

//Language
const { t } = useI18n();

/* Variables */
const authStore = useAuthStore();

/* Flags */
const submittingForm = ref<boolean>(false);
const accountCreated = ref<boolean>(false);

/* Initial form state. Down below, we use this variable along with the Object.assign to reset the form */
const initialState: UserRegistrationInterface = {
  name: '',
  email: '',
  age: null,
  password: '',
  confirm_password: '',
  country: 'USA',
  tos: false,
};

const registrationForm = reactive<UserRegistrationInterface>({
  ...initialState,
});

const errorMessage = ref<string | null>(null);

/*
Use a watcher to automatically hide the success message
*/
watch(accountCreated, (currStatus) => {
  if (currStatus) {
    setTimeout(() => (accountCreated.value = !accountCreated.value), 5000);
  }
});

// It captures the password value to compare it against the confirmation password value
const password = computed((): string => registrationForm.password);

/*
Definition of the Validation rules
*/
const rules = {
  name: {
    required,
    minLength: minLength(4),
    maxLength: maxLength(100),
  },
  email: {
    required,
    email,
  },
  age: {
    integer,
    required,
    minValue: minValue(18),
    maxValue: maxValue(110),
  },
  password: {
    required,
    minlength: minLength(5),
  },
  confirm_password: {
    sameAs: sameAs(password),
  },
  country: {
    required,
    not: helpers.withMessage(
      'Unfortunately, our service is disable for the selected country',
      not(sameAs('Russia'))
    ),
  },
  tos: {
    sameAs: sameAs(true),
  },
};

// Init the validator
const vuelidate = useVuelidate(rules, registrationForm);

/* Execute the submit action along with the Validations  */
async function submitRegistrationForm() {
  vuelidate.value.$touch();
  submittingForm.value = true;

  if (!(await vuelidate.value.$validate())) {
    submittingForm.value = false;
    return;
  }

  // Register user
  try {
    await firebase.singUp(registrationForm);
  } catch (e) {
    //console.log(error);
    submittingForm.value = false;
    errorMessage.value =
      'An unexpected error occurred. Please try again later.';
    return;
  }

  //Show Success Info
  submittingForm.value = false;
  accountCreated.value = true;

  //Reset Form
  Object.assign(registrationForm, initialState); //reset form data
  vuelidate.value.$reset(); //Reset the validation

  // Preserve auth status
  useSetupAuthData();

  //auto-close modal
  setTimeout(() => {
    authStore.toggleModalStatus();
  }, 1000);

  return;
}

/*  It resets the validations and the form data */
onBeforeUnmount(() => {
  Object.assign(registrationForm, initialState); //reset form data
  vuelidate.value.$reset();
});
</script>

<style scoped></style>
