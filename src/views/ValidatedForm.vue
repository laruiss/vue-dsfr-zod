<script lang="ts" setup>
import { computed, ref } from 'vue'
import { z } from 'zod'
import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import type { DsfrRadioButtonProps } from '@gouvminint/vue-dsfr'
import ValidatedDsfrSelect from '@/components/ValidatedDsfrSelect.vue'
import { apiClient } from '@/api/api-client'
import { useFormStore } from '@/stores/form-store'

// start of code which should be moved to a separate file
const loginDataSchema = z.object({
  email: z.string({ required_error: 'L’adresse courriel est requise' })
    .email({ message: 'L’adresse courriel n’est pas valide' }),
  password: z.string({ required_error: 'Le mot de passe est requis' })
    .refine(value => value.length > 0, { message: 'Le mot de passe est requis' }),
})

const strongEnoughPasswordRules = {
  'au moins 8 caractères': /^.{8,}$/,
  'au moins un chiffre': /.*[0-9]+/,
  'au moins une majuscule': /.*[A-Z]+/,
  'au moins une minuscule': /.*[a-z]+/,
  'au moins un caractère spécial': /.*\W+/,
} as const

const signupDataSchema = z.object({
  fileName: z.string({ required_error: 'Le fichier est requis' }).min(1, { message: 'Le fichier est requis' }),
  email: z.string({ required_error: 'L’adresse courriel est requise' })
    .email({ message: 'L’adresse courriel n’est pas valide' }).default('')
    .refine(value => value.endsWith('@interieur.gouv.fr'), { message: 'L’adresse courriel doit se terminer par @interieur.gouv.fr' }),
  password: z.string({ required_error: 'Le mot de passe est requis' })
    .superRefine((value, ctx) => {
      for (const [message, regex] of Object.entries(strongEnoughPasswordRules)) {
        if (!regex.test(value)) {
          ctx.addIssue({ code: 'custom', message: `Le mot de passe doit contenir ${message}` })
        }
      }
    }),
  phone: z.string().regex(/\+[0-9 ]+/, 'Le numéro de téléphone doit être au format +33XXXXXXXXX'),
  role: z.enum(['user', 'admin'], { required_error: 'Le rôle est requis' }),
  accept: z.boolean().refine(value => value, { message: 'Vous devez accepter les conditions' }),
  abonnement: z.enum(['mensuel', 'annuel'], { required_error: 'Vous devez choisir un abonnement' }),
})

export type Role = z.infer<typeof signupDataSchema>['role']
export type Abonnement = z.infer<typeof signupDataSchema>['abonnement']

const schemas = {
  login: loginDataSchema,
  signup: signupDataSchema,
} as const

// end of code which should be moved to a separate file

const formStates = [
  { value: 'login', label: 'authentification' },
  { value: 'signup', label: 'inscription' },
] as DsfrRadioButtonProps[]

const formState = ref<keyof typeof schemas>('signup')
const validationSchema = computed(() => toTypedSchema(schemas[formState.value]))

const formStore = useFormStore()
// const formStore = ref({ email: '', password: '', phone: '+33641414141' })

const roleOptions = [
  { value: 'user', text: 'utilisateur' },
  { value: 'admin', text: 'administrateur' },
]

const fileName = ref<string>()

const accept = ref(false)
const phone = computed({
  get: () => formStore.phone,
  set: value => formStore.phone = value,
})

const acceptErrorMessage = computed(() => accept.value ? '' : 'Vous devez accepter les conditions')

const abonnementOptions = [
  {
    id: 'mensuel',
    value: 'mensuel',
    label: 'Mensuel',
  },
  {
    id: 'annuel',
    value: 'annuel',
    label: 'Annuel',
  },
]

function saveFile(fileName) {
  console.log('saveFile', fileName)
}

function onSubmit() {
  apiClient.createUser({
    email: formStore.value.email,
    password: formStore.value.password,
    role: formStore.value.role as Role,
    abonnement: formStore.value.abonnement as Abonnement,
  })
}

onMounted(() => {
  fileName.value = 'test.csv'
})
</script>

<template>
  <div>
    <h1>Formulaire {{ formState === 'login' ? 'de connexion' : 'd’inscription' }}</h1>
    <DsfrRadioButtonSet
      v-model="formState"
      inline
      label="Choix formulaire"
      :options="formStates"
    />
    <Form
      v-slot="{ errors }"
      :validation-schema="validationSchema"
      @submit.prevent="onSubmit"
    >
      <div>
        <ValidatedTelInput
          v-model="phone"
          name="phone"
          label="Numéro de téléphone"
          @update:full-number="formStore.phone = $event"
        />
      </div>
      <!-- <p>
        <ValidatedDsfrFileInput
          name="fileName"
          label="Importer un fichier :"
          hint="Le fichier doit être au format CSV"
          :model-value="fileName"
          @update:model-value="saveFile($event)"
        />
      </p> -->
      <p>
        <ValidatedDsfrInput
          v-model="formStore.email"
          type="text"
          name="email"
          label="Adresse courriel :"
          label-visible
          placeholder="email@example.com"
          :error-message="errors.email"
        />
      </p>
      <p v-if="formState === 'login'">
        <ValidatedDsfrInput
          v-model="formStore.password"
          name="password"
          type="password"
          label="Mot de passe :"
          label-visible
          placeholder="P455w0rd"
          :error-message="errors.password"
        />
      </p>
      <template v-else>
        <p>
          <ValidatedDsfrInput
            v-model="formStore.password"
            name="password"
            type="password"
            label="Mot de passe :"
            label-visible
            placeholder="P455w0rd"
            :error-message="errors.password"
          />
        </p>
        <p>
          <ValidatedDsfrSelect
            v-model="formStore.role"
            name="role"
            label="Je veux être :"
            :options="roleOptions"
          />
        </p>
        <p class="-ml-2">
          <ValidatedDsfrCheckbox
            v-model="formStore.accept"
            name="accept"
            label="J’accepte les conditions"
            :error-message="errors.accept || acceptErrorMessage"
          />
        </p>
        <p>
          <ValidatedDsfrRadioButtonSet
            v-model="formStore.abonnement"
            inline
            name="abonnement"
            label="Choisir un abonnement"
            :options="abonnementOptions as DsfrRadioButtonProps[]"
          />
        </p>
      </template>

      <p>
        <DsfrButton type="submit">
          {{ formState === 'login' ? 'Connexion' : 'Inscription' }}
        </DsfrButton>
      </p>
      <DsfrAlert
        v-if="Object.keys(errors).length"
        title="Erreurs Vee-Validate"
      >
        <pre>{{ errors }}</pre>
      </DsfrAlert>
    </Form>
    <div class="my-4">
      <DsfrAlert
        title="Enregistré dans le store :"
      >
        <pre>{{
        {
          email: formStore.email,
          password: formStore.password,
          role: formStore.role,
          accept: formStore.accept,
          abonnement: formStore.abonnement,
        }
        }}</pre>
      </DsfrAlert>
    </div>
  </div>
</template>
