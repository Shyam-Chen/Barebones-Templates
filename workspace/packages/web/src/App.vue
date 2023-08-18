<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { XButton, XSwitch } from '@x/ui';

const status = ref(false);
</script>

<template>
  <RouterView />
  <XButton color="info">X UI</XButton>
  <XSwitch v-model:value="status" />
</template>
