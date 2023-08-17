<script lang="ts" setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" :key="$route.path" />
    </Suspense>
  </RouterView>
</template>
