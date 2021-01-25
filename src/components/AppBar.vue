<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

    <v-toolbar-title>Page title</v-toolbar-title>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
    drawer: false
}
</script>