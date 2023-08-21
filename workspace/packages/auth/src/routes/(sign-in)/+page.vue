<script lang="ts" setup>
import { ref } from 'vue';
import { XButton } from '@x/ui';

// import TextField from '~/components/TextField.vue';
// import Button from '~/components/Button.vue';
// import Spinner from '~/components/Spinner.vue';
// import Link from '~/components/Link.vue';

// import useStore from './store';
// import useLocale from './locales';
// import useSchema from './schema';

// const { state, actions, $reset } = useStore();
// const locale = useLocale();
// const schema = useSchema();

const sub = ref<HTMLIFrameElement>();

function signIn() {
  // if (schema.validate()) {
  //   actions.signIn();
  // }

  const data = { accessToken: 'foobar' };

  sub.value?.contentWindow?.postMessage(JSON.stringify(data), 'http://127.0.0.1:5174');

  location.assign('http://127.0.0.1:5174');
}

// onUnmounted(() => {
//   $reset();
// });
</script>

<template>
  <iframe ref="sub" src="http://127.0.0.1:5174" class="hidden"></iframe>

  <div class="w-full max-w-sm">
    <form class="bg-white dark:bg-slate-800 shadow-md rounded px-8 pt-6 pb-8">
      <div class="mb-8">
        <div class="text-slate-900 dark:text-white font-bold text-xl mb-2">
          Sign in to our platform
        </div>

        <div>Login here using your username and password</div>
      </div>

      <div class="mb-4">
        Username
        <input class="border" />
      </div>

      <div class="mb-8">
        Password
        <input type="password" class="border" />
      </div>

      <XButton @click="signIn">Sign in</XButton>
    </form>
  </div>
</template>
