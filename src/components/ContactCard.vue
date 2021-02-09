<template>
  <div class="contact-card">
    <v-card :id="'contact-card-' + contact.id" class="mb-3">
      <v-card-text>
        <pre>{{ contact }}</pre>
        <v-divider></v-divider>
        <v-list>
          <v-list-item two-line class="px-0">
            <v-list-item-avatar :color="randomColor">
              <img
                v-if="contact.img.hasImg"
                :src="contact.img.src"
                :alt="contact.name.full"
              />
              <span v-else class="headline">{{ contact.name.short }}</span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ contact.name.full }}</v-list-item-title>
              <v-list-item-subtitle>
                <span v-for="(item, index) in contact.org" :key="index">{{
                  item
                }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="dialog = true">
          <v-icon left>
            mdi-pencil
          </v-icon>
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
    <ContactEdit :open="dialog" :contact="contact"/>
    
  </div>
</template>

<script>
import ContactEdit from '@/components/ContactEdit.vue';

export default {
  name: "contact-card",
  props: ["contact"],
  components: {
    ContactEdit,
  },
  data: () => {
    return {
      dialog: false,
      randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    };
  },
};
</script>
