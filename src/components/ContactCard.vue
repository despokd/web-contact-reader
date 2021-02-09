<template>
  <div class="contact-card">
    <v-card :id="'contact-card-' + contact.id" class="mb-3">
      <v-card-text>
        <pre>{{ contact }}</pre>
        <v-divider></v-divider>
        <v-list>
          <v-list-item two-line>
            <v-list-item-avatar :color="randomColor">
              <img v-if="contact.img.hasImg" :src="contact.img.src" :alt="contact.name.full" />
              <span v-else class="headline">{{ contact.name.short }}</span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ contact.name.full }}</v-list-item-title>
              <v-list-item-subtitle>
                <span
                  v-for="(item, index) in contact.org"
                  :key="index"
                  >{{ item }}</span
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "contact-card",
  props: ["contact"],
  data: () => {
    return {
      randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    };
  },
};

</script>
