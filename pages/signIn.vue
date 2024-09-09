<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-crust rounded-xl m-20 p-6 w-1/5">
      <p class="text-4xl pb-5">Sign in</p>
      <form @submit="signIn">
        <div class="mb-3 mt-1">
          <label>Email<span class="text-red">*</span></label>
          <input v-model="email" @input="initializeValidation" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !emailErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red': emailErrorMessage
            }
          ]" type="email" placeholder="you@example.com" />
          <p class="mt-2 text-red">{{ emailErrorMessage }}</p>
        </div>
        <div class="mb-3 mt-1">
          <label>Password<span class="text-red">*</span></label>
          <input v-model="password" @input="initializeValidation" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !passwordErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red': passwordErrorMessage
            }
          ]" type="password" placeholder="password">
          <p class="mt-2 text-red">{{ passwordErrorMessage }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-5">
          <a href="/signUp" class="text-sm self-center text-sapphire">I don't have an account!</a>
          <btn :is-disabled="!canSignUp" text="Sign in" additional-classes="w-full" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router';

const auth = getAuth();
const router = useRouter();

let email = ref('');
let emailErrorMessage = ref('');

let password = ref('');
let passwordErrorMessage = ref('');

definePageMeta({
  layout: 'not-signed-in'
})

useHead({
  title: 'Sign in - Tasky'
})

const initializeValidation = () => {
  validateEmail();
  passwordErrorMessage.value = '';
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value) && email.value !== '') {
    emailErrorMessage.value = "Email is not valid";
  } else {
    emailErrorMessage.value = '';
  }
}

const canSignUp = computed(() => {
  return !(emailErrorMessage.value || passwordErrorMessage.value) && email.value && password.value;
})

const signIn = async (event) => {
  event.preventDefault();

  if (email.value && password.value && !emailErrorMessage.value) {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      router.push('/')
    }
    catch (error) {
      console.error(error.message);

      emailErrorMessage.value = 'Email or password is incorrect'
      passwordErrorMessage.value = 'Email or password is incorrect'
    }
  }
}
</script>