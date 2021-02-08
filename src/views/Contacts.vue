<template>
  <div class="contacts">
    <h1>Contacts</h1>
    <template>
      <v-file-input
        accept=".vcf"
        label="Import .vcf-file"
        @change="importVcf($event)"
        multiple
      ></v-file-input>
    </template>

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
export default {
  data: function() {
    return {
      contacts: [],
      snackbar: {
        text: "Error",
        timeout: "3000",
        open: false,
      },
    };
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
      fr.onload = function() {
        // parse file to vCard
        let vCard = require("vcf");
        let cards = vCard.parse(fr.result);

        // add to data list
        cards.forEach((card) => {
          // TODO add do indexed db, may use https://github.com/jakearchibald/idb
          console.debug(card.toJSON()[1]);
        });
      };
      fr.readAsText(event[0]);
    },
  },
};
</script>
