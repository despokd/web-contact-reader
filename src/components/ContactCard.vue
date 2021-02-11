<template>
  <div class="contact-card">
    <v-card v-if="!deleted" :id="'contact-card-' + contact.id" class="mb-3">
      <v-card-text>
        <v-list>
          <v-list-item two-line class="px-0">
            <v-list-item-avatar :color="randomColor">
              <img
                v-if="contact.img.hasImg"
                :src="contact.img.src"
                :alt="contact.name.full"
              />
              <span v-else class="text-h6">{{ contact.name.short }}</span>
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
        <pre>
          {{ contact }}
        </pre>
      </v-card-text>
      <v-card-actions>
        <ContactEdit @saved="saveContact()" :open="dialog" :contact="contact" :color="randomColor" />

        <v-btn color="error" text @click="deleteContact()">
          <v-icon left>
            mdi-delete
          </v-icon>
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.open" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          color="primary"
          v-bind="attrs"
          @click="snackbar.open = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ContactEdit from "@/components/ContactEdit.vue";
import { openDB } from "idb/with-async-ittr.js";

export default {
  name: "contact-card",
  props: ["contact"],
  components: {
    ContactEdit,
  },
  data: () => {
    return {
      dialog: false,
      deleted: false,
      randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
      snackbar: {
        text: "Error",
        timeout: "3000",
        open: false,
      },
    };
  },
  methods: {
    deleteContact() {
      let id = this.contact.id;
      let name = this.contact.name.full;

      deleteContactDb(id);
      this.deleted = true;
      this.snackbar.text = name + " deleted";
      this.snackbar.open = true;
    },
    saveContact() {
      alert('save');
    }
  },
};

// indexedDb version
const dbVersion = 5;

async function deleteContactDb(id) {
  const db = await openDB("ContactReader", dbVersion);

  // add contact
  await db.delete("contacts", id);
}
</script>
