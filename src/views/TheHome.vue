<template>
  <!-- Introduction -->
  <HeroSection>
    <template #title> Listen to Great Music! </template>

    <template #default>
      Fill your world with the songs, albums, and artists that define you. Get
      unlimited access to millions of tracks, curated playlists and original
      content from the artists you know and love. Experience Lossless Audio, and
      hear sound all around you with Spatial Audio featuring Dolby Atmos.
    </template>
  </HeroSection>

  <!-- Main Content -->
  <section class="container mx-auto mb-24">
    <SongsList />
  </section>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue';
import SongsList from '../components/Home/SongsList.vue';
</script>
