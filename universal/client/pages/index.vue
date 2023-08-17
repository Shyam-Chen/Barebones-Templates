<script lang="ts" setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <fieldset>
    <legend>/+layout.vue</legend>

    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/about">About</RouterLink></li>
    </ul>

    <h1>Home Page</h1>
  </fieldset>
</template>
