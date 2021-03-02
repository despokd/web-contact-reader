<template>
  <div class="contact-list">
    <v-card class="mb-3">
      <v-card-text>
        <v-row align="center">
          <v-col cols="8" sm="4" class="d-flex align-center">
            <div class="mr-3">
              <v-avatar :color="randomColor">
                <img
                  v-if="contact.img.length !== 0"
                  :src="this.img.src"
                  :alt="contact.name.full"
                />
                <span v-else class="text-h6 white--text">{{ contact.name.short }}</span>
              </v-avatar>
            </div>

            <div>
              <h2 class="text-body-1">{{ contact.name.full }}</h2>
              <span class="text-subtitle-2 d-none d-sm-block">
                {{ contact.org.length > 0 ? contact.org.slice(-1).pop().org : ""
                }}{{
                  contact.org.length > 0 && contact.org.title
                    ? ", " + contact.org.slice(-1).pop().title
                    : ""
                }}
              </span>
            </div>
          </v-col>
          <v-col cols="12" sm="3" class="d-none d-sm-flex">
            {{ contact.tel.length > 0 ? contact.tel.slice(-1).pop().number : "" }}
          </v-col>
          <v-col cols="12" sm="3" class="d-none d-sm-flex">
            {{ contact.email.length > 0 ? contact.email.slice(-1).pop().email : "" }}
          </v-col>
          <v-col cols="4" sm="2" align="right">
            <ContactEdit
              :open="dialog"
              :contact="contact"
              :color="randomColor"
              @saved="saveContact($event)"
              @deleted="deleteContact($event)"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import ContactEdit from "@/components/contactEdit/ContactEdit.vue";

export default {
  name: "contact-list",
  props: ["contact"],
  components: {
    ContactEdit,
  },
  data: () => {
    return {
      dialog: false,
    };
  },
  computed: {
    img: function () {
      return this.contact.img.slice(-1).pop();
    },
    randomColor: function () {
      let color;
      if (this.contact.img.length !== 0) return "transparent";
      while (
        color === undefined ||
        color === "#ffffff" ||
        color === "#000000" ||
        color.length !== 7
      ) {
        color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      }
      return color;
    },
  },
  methods: {
    deleteContact() {
      this.$emit("deleted", this.contact);
    },
    saveContact(savedContact) {
      this.$emit("saved", savedContact);
    },
  },
};
</script>
