<template>
  <div class="contacts">
    <h1>Contacts</h1>
    <template>
      <v-file-input
        accept=".vcf,.txt"
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
    importVcf: function(files) {
      // Browser is not compatible
      if (!window.FileReader) return;

      // discard if no files given
      if (files.length <= 0) return;

      // get files content
      files.forEach((file) => {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          console.log(event.target.result);
        });
        reader.readAsText(file);
      });

      // convert to json

    },
  },
};
</script>
