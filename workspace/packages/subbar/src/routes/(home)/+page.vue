<script lang="ts" setup>
import { XButton } from '@x/ui';

function signOut() {
  location.replace('http://localhost:5173');
}
</script>

<template>
  <h1>Home Page</h1>
  <XButton @click="signOut">Sign out</XButton>
</template>
