<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { User } from '../api/users'
import { getUsers } from '../api/users'

const isLoading = ref(true)
const users = ref<User[]>([])

onMounted(async () => {
  users.value = await getUsers()
  isLoading.value = false
})
</script>

<template>
  <h1>Users</h1>

  <div v-if="isLoading">
    <p>Loading...</p>
  </div>

  <div v-else>
    <ul>
      <li
        v-for="user in users"
        :key="user.name"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
