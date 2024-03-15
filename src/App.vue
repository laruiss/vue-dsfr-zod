<script setup lang="ts">
import { RouterView } from 'vue-router'

const serviceTitle = 'Bureau des ressources de réalisation'
const serviceDescription = 'Le bureau des ressources de réalisation est un service de la direction des systèmes d’information.'
const logoText = ['Ministère', 'de l’intérieur', 'et des Outre-mer']
</script>

<template>
  <DsfrHeader
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
    show-search
    :quick-links="[
      { label: 'Code source de cette démo', href: 'https://github.com/laruiss/vue-dsfr-zod', icon: 'ri-github-fill' },
    ]"
  >
    <DsfrNavigation>
      <DsfrNavigationItem>
        <DsfrNavigationMenuLink
          to="/"
          text="Accueil"
        />
      </DsfrNavigationItem>
      <DsfrNavigationItem>
        <DsfrNavigationMenuLink
          to="/about"
          text="About"
        />
      </DsfrNavigationItem>
    </DsfrNavigation>
  </DsfrHeader>

  <main class="fr-container mt-4">
    <RouterView />
  </main>
</template>
