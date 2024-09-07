<template>
  <div class=" py-20 px-72">
    <div class="container mx-auto">
      <p class="text-3xl font-bold mb-16">Your profile</p>
      <div class="mb-10">
        <p class="text-xl pb-5">Profile picture</p>
        <div class="flex items-end">
          <div class="w-40 h-40 rounded-full overflow-hidden">
            <img v-if="user.photoURL" :src="user.photoURL" class="h-full w-full object-cover">
            <Icon v-if="!user.photoURL" name="mdi:user-circle" size="160" />
          </div>
          <div class="ml-4">
            <button class="rounded-xl bg-green w-20 text-base p-2" @click="triggerFileInput">
              <p v-if="user.photoURL">Edit</p>
              <p v-if="!user.photoURL">Add</p>
            </button>

            <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">

          </div>
          <div class="ml-4">
            <button @click="deleteProfilePicture" v-if="user.photoURL"
              class="rounded-xl bg-red w-20 text-base p-2">Remove</button>
          </div>
        </div>
      </div>
      <div class="mb-10">
        <p class="text-xl pb-3">Username</p>
        <div class="flex">
          <input v-model="username" @input="validateUsername" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !usernameErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red ': usernameErrorMessage
            }
          ]" type="text" placeholder="username">
          <div>
            <button @click="updateUsername" :hidden="!usernameShowSaveButton"
              class="rounded-xl bg-green w-20 text-base p-2 ml-4">Save</button>
          </div>
        </div>
        <p class="mt-2 text-red">{{ usernameErrorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";

const fileInput = ref(null);

useHead({
  title: 'Profile - Tasky'
})

const getUser = () => {
  const auth = getAuth();
  return auth.currentUser;
}

const user = ref(getUser());

let usernameShowSaveButton = ref(false);
let username = ref(user.value.displayName);
let usernameErrorMessage = ref('');

function validateUsername() {
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

function updateUsername() {
  if (!usernameErrorMessage.value && usernameShowSaveButton.value === true) {
    updateProfile(user.value, { displayName: username.value })
  }
}

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

  const fileRef = storageRef(storage, `profilePictures/${user.value.uid}`)

  try {
    await uploadBytes(fileRef, file);
  } catch (error) {
    console.error(error.message)
  }

  const downloadURL = await getDownloadURL(fileRef);

  await updateUserProfile(downloadURL)

}
const updateUserProfile = async (photoURL) => {
  await updateProfile(user.value, { photoURL: photoURL })
}

const deleteProfilePicture = async () => {
  const storage = getStorage();

  // Remove the old profile picture from Firebase Storage
  if (user.value.photoURL) {
    const fileRef = storageRef(storage, `profilePictures/${user.value.uid}`);
    try {
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error removing the profile picture:", error.message);
    }
  }

  // Update the user profile to remove the photoURL
  await updateUserProfile('');
  user.value = getUser();
};

</script>