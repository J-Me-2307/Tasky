<template>
  <div class="py-20 px-72 w-full">
      <p class="text-3xl font-bold mb-16">Your profile</p>
      <div class="mb-10">
        <p class="text-xl pb-5">Profile picture</p>
        <div class="flex items-end">
          <div class="w-40 h-40 rounded-full overflow-hidden">
            <img alt="profile picture" v-if="user.photoURL" :src="user.photoURL" class="h-full w-full object-cover">
            <Icon v-if="!user.photoURL" name="mdi:user-circle" size="160" />
          </div>
          <div class="ml-4">
            <btn :text="user.photoURL ? 'Change' : 'Add'" color="green" @click="triggerFileInput"
              additional-classes="w-20" :loading="addLoading"/>
            <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
          </div>
          <div class="ml-4">
            <btn v-if="user.photoURL" text="Remove" color="red" @click="deleteProfilePicture"
              additional-classes="w-20"/>
          </div>
        </div>
      </div>
      <div class="mb-10">
        <p class="text-xl pb-3">Username</p>
        <div class="flex">
          <input v-model="username" @input="validateUsername" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-96 text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !usernameErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red ': usernameErrorMessage
            }
          ]" type="text" placeholder="username">
          <div>
            <btn text="Update" :is-disabled="!canChangeUsername" color="green" @click="updateUsername" additional-classes="w-20 ml-4" :loading="usernameLoading"/>
          </div>
        </div>
        <p class="mt-2 text-red">{{ usernameErrorMessage }}</p>
      </div>
      <div>
        <p class="text-xl pb-3">Theme</p>
        <select v-model="selectedTheme" @change="changeTheme" class="rounded-xl bg-surface0 px-4 py-2 text-text border focus:ring-1 focus:outline-none
           focus:border-sky focus:ring-sky border-text transition-opacity duration-300 ease-in-out hover:opacity-80">
          <option class=" hover:bg-surface1" value="Latte">Latte</option>
          <option value="Frappe">Frappe</option>
          <option value="Macchiato">Macchiato</option>
          <option value="Mocha">Mocha</option>
        </select>
      </div>
    </div>
</template>

<script setup>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";

const fileInput = ref(null);
let addLoading = ref(false);

let usernameLoading = ref(false);

useHead({
  title: 'Profile - Tasky'
})

const { $setTheme } = useNuxtApp()
const selectedTheme = ref('')

onMounted(() => {
  selectedTheme.value = localStorage.getItem('theme') || 'Latte'
})

const changeTheme = () => {
  $setTheme(selectedTheme.value)
}

const getUser = () => {
  const auth = getAuth();
  return auth.currentUser;
}

const user = ref(getUser());

let usernameShowSaveButton = ref(false);
let username = ref(user.value.displayName);
let usernameErrorMessage = ref('');

const validateUsername = () => {
  if ((username.value.length < 3 || username.value.length > 20) && username.value !== '') {
    usernameErrorMessage.value = 'Username must be between 3 and 20 characters';
  } else {
    usernameErrorMessage.value = '';
  }

  if (username.value !== user.value.displayName) {
    usernameShowSaveButton.value = true;
  } else {
    usernameShowSaveButton.value = false;
  }
}

const canChangeUsername = computed(() => {
  return !usernameErrorMessage.value && username.value && username.value !== user.value.displayName;
})


const updateUsername = async () => {
  if (!usernameErrorMessage.value && usernameShowSaveButton.value === true) {
    usernameLoading.value = true;  // Start loading
    try {
      await updateProfile(user.value, { displayName: username.value });
      user.value.displayName = username.value;  // Update the local user object
    } catch (error) {
      console.error(error.message);
    } finally {
      usernameLoading.value = false;  // Stop loading after the update
    }
  }
};


const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  await uploadFile(file);
};

const uploadFile = async (file) => {
  const storage = getStorage();
  const fileRef = storageRef(storage, `profilePictures/${user.value.uid}`);

  addLoading.value = true;  // Start loading
  try {
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    await updateUserProfile(downloadURL);
  } catch (error) {
    console.error(error.message);
  } finally {
    addLoading.value = false;  // Stop loading after the process is complete
  }
};


const updateUserProfile = async (photoURL) => {
  await updateProfile(user.value, { photoURL: photoURL })
}

const deleteProfilePicture = async () => {
  const storage = getStorage();

  if (user.value.photoURL) {
    const fileRef = storageRef(storage, `profilePictures/${user.value.uid}`);
    try {
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error removing the profile picture:", error.message);
    }
  }

  await updateUserProfile('');
  user.value = getUser();
};

</script>