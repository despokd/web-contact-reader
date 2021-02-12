<template>
  <div class="contact-edit-tel">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Phone" icon="mdi-phone" />
      </v-col>
      <v-col cols="10">
        <v-container>
          <v-row v-for="(telItem, index) in tel" :key="index" class="mb-n6">
            <v-col cols="5">
              <v-select
                v-model="telItem.type"
                :items="types"
                item-text="name"
                item-value="value"
                dense
                label="Type"
              ></v-select>
            </v-col>
            <v-col cols="7">
              <v-text-field
                v-model="telItem.number"
                dense
                label="Phone number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn small @click="addTel()" text class="mt-1">
                <v-icon left>mdi-plus</v-icon>
                Add phone number
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="1">
        <template v-for="(telItem, index) in tel">
          <div :key="index">
            <v-btn
              color="error"
              icon
              aria-label="Delete number"
              @click="deleteTel(index)"
              class="mt-3 ml-n3 mb-3"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
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
      types: [
        {
          name: "Default",
          value: "cell",
        },
        {
          name: "Mobil",
          value: "x-mobil",
        },
        {
          name: "Home",
          value: ["home", "voice"],
        },
        {
          name: "Work",
          value: "work",
        },
        {
          name: "Fax Home",
          value: ["home", "fax"],
        },
        {
          name: "Fax Work",
          value: ["work", "fax"],
        },
        {
          name: "Pager",
          value: "pager",
        },
        {
          name: "Other",
          value: "pref",
        },
      ],
    };
  },
  methods: {
    addTel() {
      this.tel.push({
        number: "",
        type: "cell",
      });
    },
    deleteTel(index) {
      this.tel.splice(index, 1);
    },
  },
};
</script>
