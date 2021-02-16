<template>
  <div class="contact-edit-email">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="E-mail" icon="mdi-email" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-for="(emailItem, index) in email" :key="index">
            <v-col cols="5">
              <v-select
                v-model="emailItem.type"
                :items="attr"
                item-text="name"
                item-value="value"
                multiple
                dense
                label="Attributes"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="emailItem.email" dense label="E-mail"></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                aria-label="Delete e-mail"
                @click="deleteEmail(index)"
                class="ml-n1"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                small
                @click="addEmail()"
                text
                style="margin-top: 2px"
                :class="email.length > 0 ? 'mt-n8' : ''"
              >
                <v-icon left>mdi-plus</v-icon>
                Add e-mail
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
  name: "contact-edit-email",
  props: {
    email: {
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
        { name: "Home", value: "home" },
        { name: "Work", value: "work" },
        { name: "Other", value: null },
      ],
    };
  },
  methods: {
    addEmail() {
      this.email.push({
        email: "",
        type: ["home"],
      });
    },
    deleteEmail(index) {
      this.email.splice(index, 1);
    },
  },
};
</script>
