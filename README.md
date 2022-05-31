# vusic-player

This is a [Vue](https://vuejs.org/) application created during the certification course by ZTM at [Udemy](https://www.udemy.com/course/complete-vue-js-developer-zero-to-mastery-vuex).

## Technologies and Packages

I am using several packages and plugins, but the more important are the ones below.

- [Vite](https://vitejs.dev/)
- [Firebase 9](https://firebase.google.com/docs/web/setup)
- [Typescript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vue i18n](https://vue-i18n.intlify.dev/)
- [Vuelidate](https://vuelidate-next.netlify.app/)
- [TailwindCSS](https://tailwindcss.com/)
- [HeadlessUI](https://headlessui.dev/)
- [VueUse](https://vueuse.org/)
- [PWA for Vite](https://vite-plugin-pwa.netlify.app/)

## Installation and Development

- Move the **.env.example** file to **.env**.
- Configure the **.env** file with your Firebase credentials.
- Install the dependencies with the command below.
```shell
yarn install
```
- Run the application on devel mode with the command below.
```shell
yarn run dev
  ```
- If you want to analyze your code with [Eslint](https://eslint.org/) and fix the detected issues, run the command below.
```shell
yarn run lint
```
- For type checking using [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc), execute the command below.
```shell
yarn run typecheck
```

## Build Project

To create the static files, you have to run the command below.
```shell
yarn run build
```

## To Do
- [ ] Integrate [Vitest](https://vitest.dev/)