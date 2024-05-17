import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', () => {
  const email = ref('')
  const phone = ref('+33641414141')
  const password = ref('')
  const role = ref('')
  const accept = ref('')
  const abonnement = ref('')
  return { email, password, role, accept, abonnement, phone }
})
