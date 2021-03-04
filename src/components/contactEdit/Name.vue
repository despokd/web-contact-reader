<template>
  <div class="contact-edit-name">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Name" icon="mdi-account" />
      </v-col>
      <v-col cols="10">
        <v-container v-if="!isExpanded">
          <v-row
            ><v-col cols="12" sm="5">
              <v-text-field
                dense
                label="Forename"
                v-model="name.forename"
                @input="getNameCombinations()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="7">
              <v-text-field
                dense
                label="Surname"
                v-model="name.surname"
                @input="getNameCombinations()"
              ></v-text-field> </v-col
          ></v-row>
        </v-container>
        <v-container v-else class="mt-5">
          <v-row>
            <v-col cols="12" sm="4" md="4" class="mt-n5">
              <v-text-field
                dense
                label="Prefix"
                v-model="name.prefix"
                @input="getNameCombinations()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="8" md="8" class="mt-n5">
              <v-text-field
                dense
                label="Forename"
                v-model="name.forename"
                @input="getNameCombinations()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n5">
              <v-text-field
                dense
                label="Middle names"
                v-model="name.middlenames"
                @input="getNameCombinations()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="8" md="8" class="mt-n5">
              <v-text-field
                dense
                label="Surname"
                v-model="name.surname"
                @input="getNameCombinations()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4" class="mt-n5">
              <v-text-field
                dense
                label="Suffix"
                v-model="name.suffix"
                @input="getNameCombinations()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="1">
        <v-btn
          icon
          aria-label="Toggle detailed name form"
          @click="toggleExpansion()"
          class="mt-5 ml-n3"
        >
          <v-icon>{{ isExpanded ? "mdi-chevron-down" : "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionIcon from "@/components/contactEdit/helper/SectionIcon.vue";

export default {
  name: "contact-edit-name",
  props: {
    name: Object,
  },
  components: {
    SectionIcon,
  },
  data: () => {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    },
    getNameCombinations() {
      // get full name
      this.name.full = "";
      if (this.name.prefix != "") this.name.full += this.name.prefix + " ";
      if (this.name.forename != "") this.name.full += this.name.forename + " ";
      if (this.name.middlenames != "") this.name.full += this.name.middlenames + " ";
      if (this.name.surname != "") this.name.full += this.name.surname;
      if (this.name.suffix != "") this.name.full += ", " + this.name.suffix;

      // get short name
      this.name.short = this.name.forename.charAt(0) + this.name.surname.charAt(0);
    },
  },
};
</script>
