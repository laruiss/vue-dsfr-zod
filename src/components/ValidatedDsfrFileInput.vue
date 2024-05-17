<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps<{
  errorMessage?: string
  hint?: string
  label: string
  modelValue?: string
  name: string
  placeholder?: string
  successMessage?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// use `toRef` to create reactive references to `name` prop which is passed to `useField`
// this is important because vee-validte needs to know if the field name changes
// https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
const name = toRef(() => props.name)

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
const {
  errorMessage,
  handleBlur,
  handleChange,
} = useField(name)

const fileUpload = ref<HTMLDivElement>()

watch(() => props.modelValue, async (fileName?: string) => {
  if (!fileName || !fileUpload.value) {
    return
  }
  setFileName(fileName)
})

function setFileName(fileName: string) {
  const myFile = new File(['Dummy content'], fileName, {
    type: 'text/plain',
    lastModified: new Date().getTime(),
  })
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(myFile)
  const fileInput = fileUpload.value!.querySelector('input[type=file]')! as HTMLInputElement
  fileInput.files = dataTransfer.files
  handleChange(fileName, true)
}

function setFileUpload(el: HTMLDivElement) {
  fileUpload.value = el.$el
  if (props.modelValue) {
    setFileName(props.modelValue)
  }
}

function onChange(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <input
    type="hidden"
    :name="name"
    :value="modelValue"
  >
  <DsfrFileUpload
    :ref="el => setFileUpload(el)"
    v-bind="$attrs"
    :label="label"
    :hint="hint"
    label-visible
    :placeholder="placeholder"
    :error="errorMessage"
    :success-message="successMessage"
    @update:model-value="onChange($event)"
    @blur="handleBlur"
  />
</template>
