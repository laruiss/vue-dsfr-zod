<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps<{
  type: string
  modelValue: string
  name: string
  label: string
  successMessage?: string
  errorMessage?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// use `toRef` to create reactive references to `name` prop which is passed to `useField`
// this is important because vee-validte needs to know if the field name changes
// https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
const name = toRef(props, 'name')

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
} = useField(name, undefined, {
  initialValue: props.modelValue,
})

function onChange(value: string) {
  handleChange(value, true)
  emit('update:modelValue', value)
}
</script>

<template>
  <DsfrInputGroup
    :name="name"
    :model-value="inputValue"
    :type="type"
    :label="label"
    label-visible
    :placeholder="placeholder"
    :error-message="errorMessage"
    :success-message="successMessage"
    @update:model-value="onChange($event)"
    @blur="handleBlur"
  />
</template>
