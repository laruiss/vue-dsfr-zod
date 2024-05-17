<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'
import { VueTelInput } from 'vue-tel-input'

const props = defineProps<{
  modelValue: string
  name: string
  label: string
  successMessage?: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:fullNumber': [value: string]
}>()

// use `toRef` to create reactive references to `name` prop which is passed to `useField`
// this is important because vee-validte needs to know if the field name changes
// https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
const name = toRef(props, 'name')

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
const {
  value: inputValue,
  handleChange,
  errorMessage,
  setErrors,
} = useField(name, undefined, {
  initialValue: props.modelValue,
})

watch(() => props.modelValue, (newValue) => {
  handleChange(newValue, true)
})

const phoneNumber = ref('')

let timeoutId = 0
function onValidate(phoneObject: { valid: boolean }) {
  clearTimeout(timeoutId)
  if (phoneObject.valid !== undefined && !phoneObject.valid) {
    timeoutId = window.setTimeout(() => {
      setErrors('Ce numéro semble invalide')
    }, 100)
  }
  else {
    setErrors('')
  }
}
function getFormattedNumber(e: string, phoneObject: { number: string }) {
  phoneNumber.value = phoneObject.number
  emit('update:fullNumber', phoneObject.number)
}
</script>

<template>
  <DsfrInputGroup
    required
    :error-message="errorMessage"
  >
    <label class="fr-label">
      Numéro de téléphone
    </label>
    <VueTelInput
      :model-value="inputValue"
      default-country="fr"
      class="fr-input tel-input"
      @validate="onValidate($event)"
      @on-input="getFormattedNumber"
    />
  </DsfrInputGroup>
  <input
    type="hidden"
    :model-value="phoneNumber"
    :name="name"
  >
</template>

<style scoped>
.tel-input {
  border: none;
  border-radius: 0;
}

.label-tel-input {
  margin-bottom: 1rem;
}

:deep(.vue-tel-input) {
  display: flex;
}
</style>
