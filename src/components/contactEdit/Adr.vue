<template>
  <div class="contact-edit-adr">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Address" icon="mdi-map-marker" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-for="(adrItem, index) in adr" :key="index">
            <v-col cols="7">
              <v-select
                v-model="adrItem.type"
                :items="attr"
                item-text="name"
                item-value="value"
                multiple
                dense
                label="Attributes"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-btn
                text
                block
                color="primary"
                :href="'https://www.google.com/maps/place/' + toUrl(adrItem.adr)"
                target="_blank"
                aria-label="Search on Google Maps"
              >
                <v-icon left>mdi-google-maps</v-icon>Maps
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                aria-label="Delete address"
                @click="deleteAdr(index)"
                class="ml-n1"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col v-if="isExpanded" cols="10" class="mt-n5">
              <v-text-field dense label="Address line 1" v-model="adrItem.adr[0]">
              </v-text-field>
            </v-col>
            <v-col v-if="isExpanded" cols="10" class="mt-n5">
              <v-text-field dense label="Address line 2" v-model="adrItem.adr[1]">
              </v-text-field>
            </v-col>
            <v-col cols="11" class="mt-n5">
              <v-text-field dense label="Street" v-model="adrItem.adr[2]"> </v-text-field>
            </v-col>
            <v-col cols="1" class="mt-n5">
              <v-btn
                icon
                aria-label="Toggle additonal adress lines"
                @click="toggleExpansion()"
                class="ml-n1"
              >
                <v-icon>{{ isExpanded ? "mdi-chevron-up" : "mdi-chevron-left" }}</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="11" class="mt-n5">
              <v-text-field dense label="City" v-model="adrItem.adr[3]"> </v-text-field>
            </v-col>
            <v-col cols="7" class="mt-n5">
              <v-text-field dense label="State" v-model="adrItem.adr[4]"> </v-text-field>
            </v-col>
            <v-col cols="4" class="mt-n5">
              <v-text-field dense label="Zip code" v-model="adrItem.adr[5]">
              </v-text-field>
            </v-col>
            <v-col cols="11" class="mt-n5">
              <v-text-field dense label="Country" v-model="adrItem.adr[6]">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                small
                @click="addAdr()"
                text
                style="margin-top: 2px"
                :class="adr.length > 0 ? 'mt-n8' : ''"
              >
                <v-icon left>mdi-plus</v-icon>
                Add address
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
  name: "contact-edit-adr",
  props: {
    adr: {
      default: Array,
      type: Array,
    },
  },
  components: {
    SectionIcon,
  },
  data: () => {
    return {
      isExpanded: false,
      attr: [
        { name: "Default", value: "pref" },
        { name: "Home", value: "home" },
        { name: "Work", value: "work" },
        { name: "Other", value: null },
      ],
    };
  },
  methods: {
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    },
    toUrl(adr) {
      let string = "";
      adr.forEach((element) => {
        string += " " + element.toString();
      });
      return string.trim();
    },
    addAdr() {
      this.adr.push({
        adr: [],
        type: ["home"],
      });
    },
    deleteAdr(index) {
      this.adr.splice(index, 1);
    },
  },
};
</script>
