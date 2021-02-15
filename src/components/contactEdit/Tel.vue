<template>
  <div class="contact-edit-tel">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Phone" icon="mdi-phone" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-for="(telItem, index) in tel" :key="index" class="mb-n6">
            <v-col cols="5">
              <v-select
                v-model="telItem.type"
                :items="attr"
                item-text="name"
                item-value="value"
                multiple
                dense
                label="Attributes"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="telItem.number"
                dense
                label="Phone number"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                aria-label="Delete number"
                @click="deleteTel(index)"
                class="ml-n1"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" small @click="addTel()" text style="margin-top: 2px">
                <v-icon left>mdi-plus</v-icon>
                Add phone number
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
  name: "contact-edit-tel",
  props: {
    tel: {
      default: Array,
      type: Array,
    },
  },
  components: {
    SectionIcon,
  },
  data: () => {
    return {
      attr: [
        { name: "Default", value: "pref" },
        { name: "Phone", value: "cell" },
        { name: "Mobil", value: "x-mobil" },
        { name: "Voice", value: "voice" },
        { name: "Home", value: "home" },
        { name: "Work", value: "work" },
        { name: "Fax", value: "fax" },
        { name: "Pager", value: "pager" },
        { name: "Other", value: null },
      ],
    };
  },
  methods: {
    addTel() {
      this.tel.push({
        number: "",
        type: ["cell"],
      });
    },
    deleteTel(index) {
      this.tel.splice(index, 1);
    },
  },
};
</script>
