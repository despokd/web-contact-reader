<template>
  <div class="contacts">
    <v-col cols="12">
      <template>
        <v-file-input
          accept=".vcf"
          label="Import .vcf-file"
          @change="importVcf($event)"
        ></v-file-input>
      </template>
    </v-col>
    <v-col>
      <pre>{{ contacts }}</pre>
      <pre>{{ vCardContacts }}</pre>
    </v-col>

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
import { openDB } from "idb/with-async-ittr.js";

export default {
  name: "contacts-component",
  data: () => {
    return {
      contacts: [],
      snackbar: {
        text: "Error",
        timeout: "3000",
        open: false,
      },
    };
  },
  created() {
    initContactsDb();
    this.getContacts();
  },
  methods: {
    importVcf: function(event) {
      // Browser is not compatible
      if (!window.FileReader) {
        this.snackbar.text = "Browser is not compatible";
        this.snackbar.open = true;
        return;
      }

      // discard if no files given
      if (event.length <= 0) {
        this.snackbar.text = "No files given";
        this.snackbar.open = true;
        return;
      }

      let fr = new FileReader();
      fr.onload = () => {
        // parse file to vCard
        let vCard = require("vcf");
        let cards = vCard.parse(fr.result);

        // add to data db
        cards.forEach((card) => {
          saveContact(card.toJSON());
        });

        // add to data compnent
        this.getContacts();
      };
      fr.readAsText(event);
    },
    getContacts: function() {
      // get entries of database
      getContactsFromDb().then((result) => {
        this.contacts = result;
      });
    },
  },
  computed: {
    vCardContacts: function() {
      let vCard = require("vcf");
      return vCard.fromJSON(this.contacts[0]);
    },
  },
};

// indexedDb version
const dbVersion = 3;

async function initContactsDb() {
  await openDB("ContactReader", dbVersion, {
    upgrade(db) {
      db.createObjectStore("contacts", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
}

async function saveContact(contact) {
  const db = await openDB("ContactReader", dbVersion);

  // add contact
  await db.add("contacts", contact);
}

async function getContactsFromDb() {
  const db = await openDB("ContactReader", dbVersion);
  return await db.getAll("contacts");
}
</script>
