<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="p-4">
    <ul class="list">
      <li><RouterLink to="/" class="link" data-testid="home">Home</RouterLink></li>
      <li><RouterLink to="/about" class="link" data-testid="about">About</RouterLink></li>
      <li><RouterLink to="/contact" class="link" data-testid="contact">Contact</RouterLink></li>
    </ul>

    <main class="py-4">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.list {
  @apply w-48 text-sm font-medium border rounded-lg;
  @apply text-gray-900 bg-white border-gray-200;
  @apply dark:bg-gray-700 dark:border-gray-600 dark:text-white;
}

.link {
  @apply block w-full px-4 py-2 cursor-pointer;
  @apply hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700;
  @apply dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white;
}
</style>
