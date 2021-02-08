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
  </div>
</template>

<script>
export default {
  methods: {
    importVcf: function(event) {
      // Browser is not compatible
      if (!window.FileReader) return;

      console.log(event);

      // discard if no files given
      if (event.length <= 0) return;

      let fr = new FileReader();
      fr.onload = function() {
        // parse file to vCard
        let vCard = require("vcf");
        let cards = vCard.parse(fr.result);
        console.log(cards);
      };
      fr.readAsText(event[0]);
    },
  },
};
</script>
