<template>
  <div class="section-icon">
    <v-icon class="mt-4" color="primary" :aria-label="sectionName + ' section'" role="img"
      >{{ icon }}
    </v-icon>
  </div>
</template>

<script>
export default {
  name: "section-icon",
  props: ["sectionName", "icon"],
};
</script>
