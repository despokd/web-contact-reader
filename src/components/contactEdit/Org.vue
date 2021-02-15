<template>
  <div class="contact-edit-org">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Organization" icon="mdi-office-building" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-for="(orgItem, index) in org" :key="index" class="mb-n6">
            <v-col cols="11">
              <v-text-field
                v-model="orgItem.org"
                dense
                label="Organization"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                aria-label="Delete organization"
                @click="deleteOrg(index)"
                class="ml-n1"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="11" class="mt-n5">
              <v-text-field v-model="orgItem.title" dense label="Title"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" small @click="addOrg()" text style="margin-top: 2px">
                <v-icon left>mdi-plus</v-icon>
                Add organization
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionIcon from "@/components/contactEdit/helper/SectionIcon.vue";

export default {
  name: "contact-edit-org",
  props: {
    org: {
      default: Array,
      type: Array,
    },
  },
  components: {
    SectionIcon,
  },
  methods: {
    addOrg() {
      this.org.push({
        org: "",
        title: "",
      });
    },
    deleteOrg(index) {
      this.org.splice(index, 1);
    },
  },
};
</script>
