import './assets/main.css'

import 'vue-tel-input/vue-tel-input.css'

import 'uno.css'

import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@gouvminint/vue-dsfr/styles'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import * as icons from './icons'

addIcons(...Object.values(icons))

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
