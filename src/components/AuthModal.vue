<template>
  <!-- Auth Modal -->
  <div
    id="modal"
    class="fixed z-[2000] inset-0 overflow-y-auto"
    :class="authModalShow"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div
          class="absolute inset-0 bg-gray-700 opacity-75"
          @click.prevent="authStore.toggleModalStatus"
        ></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-transform origin-top scale-y-100 ease-out duration-200 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <div
              class="modal-close cursor-pointer z-50"
              @click.prevent="authStore.toggleModalStatus"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition hover:text-white hover:bg-blue-400"
                :class="{
                  'text-white': showLoginTab,
                  'bg-blue-600': showLoginTab,
                }"
                href="#"
                @click.prevent="setCurrentTab('login')"
              >
                Login
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition hover:text-white hover:bg-blue-400"
                :class="{
                  'text-white': !showLoginTab,
                  'bg-blue-600': !showLoginTab,
                }"
                href="#"
                @click.prevent="setCurrentTab('register')"
              >
                Register
              </a>
            </li>
          </ul>

          <!-- Login Form -->
          <LoginForm v-if="showLoginTab"></LoginForm>

          <!-- Registration Form -->
          <RegistrationForm v-else></RegistrationForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/authStore';
import { computed, ref } from 'vue';
import LoginForm from './Auth/LoginForm.vue';
import RegistrationForm from './Auth/RegistrationForm.vue';

// Store Management
const authStore = useAuthStore();

const authModalShow = computed(() => {
  return {
    hidden: !authStore.showAuthModal,
  };
});

// Authorization Tabs
const currentTab = ref<string>('login');

function setCurrentTab(tab: string) {
  currentTab.value = tab;
}

const showLoginTab = computed((): boolean => currentTab.value === 'login');
</script>
