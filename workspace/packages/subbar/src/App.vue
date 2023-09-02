<script lang="ts" setup>
import { RouterView } from 'vue-router';

window.addEventListener('message', (event) => {
  // Check the origin of the message to ensure security
  if (event.origin === 'http://localhost:5173') {
    // Parse the data and store it in LocalStorage
    const receivedData = JSON.parse(event.data) as { accessToken: string };
    localStorage.setItem('accessToken', receivedData.accessToken);

    // Do something with the synced data
    console.log('Received data:', receivedData);
  }
});
</script>

<template>
  <RouterView />
</template>
