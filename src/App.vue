<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- -->
    </v-navigation-drawer>


    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
    <BottomNavigation/>
  </v-app>
</template>

<style lang="scss">

</style>
<script>
import BottomNavigation from '@/components/BottomNavigation.vue'

export default {
  components: {
    BottomNavigation
  }
}
</script>