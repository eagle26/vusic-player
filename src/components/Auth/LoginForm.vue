<template>
  <form @submit.prevent="submit">
    <!-- Success Message -->
    <SuccessAlert
      v-if="userAuthorized"
      title="Success!"
      message="You are now logged in."
    ></SuccessAlert>

    <!-- Error Message -->
    <DangerAlert v-if="errorMessage" :message="errorMessage"></DangerAlert>

    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <input
        v-model="loginForm.email"
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
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <input
        v-model="loginForm.password"
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
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="{ 'cursor-not-allowed': submittingForm | userAuthorized }"
      :disabled="submittingForm || userAuthorized"
    >
      <TheSpinner v-if="submittingForm" size="xsm"></TheSpinner>
      Submit
    </button>
  </form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue';
import TheSpinner from '../UI/TheSpinner.vue';
import type { UserLoginInterface } from '../../interfaces/UserLoginInterface';
import SuccessAlert from '../UI/SuccessAlert.vue';
import DangerAlert from '../UI/DangerAlert.vue';
import firebase from '../../includes/firebase';
import { useAuthStore } from '../../store/authStore';
import { useSetupAuthData } from '../../composables/setupAuthData';

// Flags
const userAuthorized = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

// Store
const authStore = useAuthStore();

const initialState: UserLoginInterface = {
  email: '',
  password: '',
};

const loginForm = reactive<UserLoginInterface>({ ...initialState });

const submittingForm = ref<boolean>(false);

/* Define the Validations */
const rules = {
  email: {
    required: helpers.withMessage(
      'Please provide your email address',
      required
    ),
    email: helpers.withMessage('Please provide a valid email address', email),
  },
  password: {
    required: helpers.withMessage('Please provide your password', required),
  },
};

const vuelidate = useVuelidate(rules, loginForm);

/* Execute the submit action along with the Validations  */
async function submit() {
  vuelidate.value.$touch();
  submittingForm.value = true;

  //Check validations
  if (!(await vuelidate.value.$validate())) {
    submittingForm.value = false;
    return;
  }

  //Login using firebase
  try {
    await firebase.signIn(loginForm);
  } catch (e) {
    //console.log(e);
    errorMessage.value = 'Your email or password are invalid';
    submittingForm.value = false;
    return;
  }

  //If everything went well, the reset some variables
  submittingForm.value = false;
  userAuthorized.value = true;
  errorMessage.value = null;
  Object.assign(loginForm, initialState); //reset form data
  vuelidate.value.$reset();

  // Preserve auth status
  useSetupAuthData();

  //auto-close modal
  setTimeout(() => {
    authStore.toggleModalStatus();
    userAuthorized.value = false;
    vuelidate.value.$reset();
  }, 1000);

  return;
}

/*  It resets the validations and the form data */
onBeforeUnmount(() => {
  Object.assign(loginForm, initialState); //reset form data
  vuelidate.value.$reset();
});

onBeforeMount(() => {
  Object.assign(loginForm, initialState); //reset form data
  vuelidate.value.$reset();
});
</script>

<style scoped></style>
