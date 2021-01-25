<template>
  <v-app>
    <NavigationDrawer />
    <AppBar />

    <!-- Sizes your content based upon application components -->
    <v-main>
      <QuickStart />

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<style lang="scss"></style>
<script>
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import AppBar from "@/components/AppBar.vue";
import Footer from "@/components/Footer.vue";
import QuickStart from "@/components/QuickStart.vue";

export default {
  components: {
    NavigationDrawer,
    AppBar,
    Footer,
    QuickStart,
  },
};
</script>
