<template>
  <BasicModal ref="modal" :title="t('modals.change_language')" @submit="submit">
    <template #body>
      <SuccessAlert
        v-if="langUpdated"
        :message="t('notifications.locale_updated')"
      />
      <div class="mb-3">
        <label class="inline-block mb-2">{{ t('menu.language') }}</label>
        <select
          v-model="appLocale"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded dark:bg-gray-700 dark:border-slate-600 dark:placeholder:text-gray-400 dark:text-gray-100"
        >
          <option
            v-for="lang in languages"
            :key="`locale-${lang.key}`"
            :value="lang.key"
          >
            {{ lang.displayname }}
          </option>
        </select>
      </div>
    </template>

    <template #footer>
      <button
        type="button"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-slate-800 bg-transparent border border-slate-200 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:text-white dark:hover:bg-slate-700"
        @click="close"
      >
        {{ t('modals.close') }}
      </button>

      <button
        type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium bg-green-800 text-white border border-slate-200 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      >
        {{ t('forms.update') }}
      </button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
import BasicModal from './BasicModal.vue';
import type IBasicModal from './BasicModal.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import SuccessAlert from './SuccessAlert.vue';

//Interfaces
interface ILanguages {
  key: string;
  displayname: string;
}

//Language Variables
const { t, locale, availableLocales } = useI18n({ useScope: 'global' });

//Flags and Variables
const modal = ref<InstanceType<typeof IBasicModal> | null>(null);
const appLocale = useStorage('app-locale', 'en');
const langUpdated = ref<boolean>(false);

//Computed Properties
const languages = computed((): ILanguages[] => {
  const languageNames = new Intl.DisplayNames([locale.value], {
    type: 'language',
  });
  const languageList: ILanguages[] = [];
  for (const lang of availableLocales) {
    languageList.push({
      key: lang,
      displayname: languageNames.of(lang) ?? lang.toUpperCase(),
    });
  }

  return languageList;
});

// Methods
const submit = () => {
  langUpdated.value = true;
  locale.value = appLocale.value;

  //Reset some flags after 6 seconds
  setTimeout((): void => {
    langUpdated.value = false;
  }, 6000);
};

const close = () => {
  modal.value?.close();
};

const open = () => {
  modal.value?.open();
};

// Exposing methods to parent components
defineExpose({
  open,
});
</script>
