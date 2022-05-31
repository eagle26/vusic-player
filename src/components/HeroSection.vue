<template>
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg animate-slide will-change-bg-position -z-[1] dark:bg-slate-800 dark:mix-blend-luminosity"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">
          <slot name="title"></slot>
        </h1>
        <p class="w-full md:w-8/12 mx-auto">
          <slot></slot>
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.introduction-bg {
  background-image: url('/assets/img/header.png');
}
</style>
