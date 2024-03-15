import './assets/main.css'

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

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
