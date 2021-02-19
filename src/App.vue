<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/img/logo/logo-small-color.png" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title"> Contact reader </v-list-item-title>
            <v-list-item-subtitle> No accounts or apps </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
.title {
  text-transform: capitalize;
}
</style>
<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: "Contacts", icon: "mdi-contacts", to: { name: "Contacts" } },
      {
        title: "About",
        icon: "mdi-information-outline",
        to: { name: "About" },
      },
    ],
  }),
};
</script>
