<template>
  <div class="contact-card">
    <v-card class="mb-3">
      <v-card-text>
        <v-list>
          <v-list-item two-line class="px-0">
            <v-list-item-avatar :color="randomColor">
              <img
                v-if="Object.keys(contact.img).length !== 0"
                :src="contact.img"
                :alt="contact.name.full"
              />
              <span v-else class="text-h6 white--text">{{ contact.name.short }}</span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ contact.name.full }}</v-list-item-title>
              <v-list-item-subtitle>
                <span v-for="(item, index) in contact.org" :key="index">{{ item }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <ContactEdit
          @saved="saveContact($event)"
          :open="dialog"
          :contact="contact"
          :color="randomColor"
        />

        <v-btn color="error" text @click="deleteContact()">
          <v-icon left> mdi-delete </v-icon>
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import ContactEdit from "@/components/ContactEdit.vue";

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
  methods: {
    deleteContact() {
      this.$emit("deleted", this.contact);
    },
    saveContact(savedContact) {
      this.$emit("saved", savedContact);
    },
  },
};
</script>
