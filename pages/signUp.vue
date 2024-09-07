<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-crust rounded-xl m-20 p-6 w-1/5">
      <p class="text-4xl pb-5">Sign up</p>
      <form @submit="signUp">
        <div class="mb-3 mt-1">
          <label>Email<span class="text-red">*</span></label>
          <input v-model="email" @input="validateEmail" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !emailErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red': emailErrorMessage
            }
          ]" type="email" placeholder="you@example.com" />
          <p class="mt-2 text-red">{{ emailErrorMessage }}</p>
        </div>
        <div class="mb-3 mt-1">
          <label>Username<span class="text-red">*</span></label>
          <input v-model="username" @input="validateUsername" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none', 
            {
              'focus:border-sky focus:ring-sky border-text': !usernameErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red ': usernameErrorMessage
            }
          ]" type="text" placeholder="username">
        </div>
        <div class="mb-3 mt-1">
          <label>Password<span class="text-red">*</span></label>
          <input v-model="password" @input="validatePassword" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !passwordErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red': passwordErrorMessage
            }
          ]" type="password" placeholder="password">
          <p class="mt-2 text-red">{{ passwordErrorMessage }}</p>
        </div>
        <div class="mb-3 mt-1">
          <label>Confirm password<span class="text-red">*</span></label>
          <input v-model="confirmPassword" @input="validateConfirmPassword" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !confirmPasswordErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red ': confirmPasswordErrorMessage
            }
          ]" type="password" placeholder="confirm password">
          <p class="mt-2 text-red">{{ confirmPasswordErrorMessage }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-5">
          <a href="/signIn" class="text-sm self-center text-sapphire">I already have an account!</a>
          <button @click="signUp" class="rounded-xl bg-blue text-base p-2">Sign up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'not-signed-in'
})

useHead({
  title: 'Sign up - Tasky'
})

// Validation
let email = ref('');
let emailErrorMessage = ref('');

let username = ref('');
let usernameErrorMessage = ref('');

let password = ref('');
let passwordErrorMessage = ref('');

let confirmPassword = ref('');
let confirmPasswordErrorMessage = ref('');

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value) && email.value !== '') {
    emailErrorMessage.value = "Email is not valid";
  } else {
    emailErrorMessage.value = '';
  }
}

function validateUsername() {
  if((username.value.length < 3 || username.value.length > 20) && username.value !== ''){
    usernameErrorMessage.value = 'Username must be between 3 and 20 characters';
  } else{
    usernameErrorMessage.value = '';
  }
}

function validatePassword() {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;'"<>,.?/`~-]).+$/;

  if ((password.value.length < 8 || password.value.length > 20) && password.value !== '') {
    passwordErrorMessage.value = 'Password must be between 8 and 20 characters';
    return;
  }
  if (!passwordRegex.test(password.value) && password.value !== '') {
    passwordErrorMessage.value = 'Password must contain capital letters, small letters, numbers, and special characters';
  } else {
    passwordErrorMessage.value = '';
  }
}

function validateConfirmPassword() {
  if (password.value !== confirmPassword.value && confirmPassword.value !== '') {
    confirmPasswordErrorMessage.value = 'Passwords do not match'
  }
  else {
    confirmPasswordErrorMessage.value = '';
  }
}

// Signing up

const auth = getAuth();
const router = useRouter()


async function signUp(event) {
  event.preventDefault();

  if(email.value === ''){
    emailErrorMessage.value = 'Email is required';
  }
  if(username.value === ''){
    usernameErrorMessage.value = 'Username is required';
  }
  if(password.value === ''){
    passwordErrorMessage.value = 'Password is required'
  }
  if(confirmPassword.value === ''){
    confirmPasswordErrorMessage = 'Confirm your password'
  }

  if (!(emailErrorMessage.value || !usernameErrorMessage.value || !passwordErrorMessage.value || !confirmPasswordErrorMessage.value )) {
    try{
      const userCredentials = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredentials.user;

      await updateProfile(user, {displayName: username.value});

      router.push('/');
    }
    catch(error){
      console.error(error.message);
    }
  }
}
</script>