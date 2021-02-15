<template>
  <div class="contact-edit">
    <v-btn color="primary" text @click="dialog = true">
      <v-icon left> mdi-pencil </v-icon>
      Edit
    </v-btn>

    <v-dialog v-model="dialog" max-width="500px" :fullscreen="isMobile">
      <v-card>
        <v-toolbar v-if="isMobile">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ cachedContact.name.full }}</v-toolbar-title>
          <v-spacer> </v-spacer>
          <v-btn color="primary" @click="save()">
            <v-icon left> mdi-content-save </v-icon>Save
          </v-btn>
        </v-toolbar>

        <v-card-title class="mt-6">
          <EditImg :contact="cachedContact" :color="color" />
        </v-card-title>

        <v-card-text>
          <EditName :name="cachedContact.name" />
          <EditTel :tel="cachedContact.tel" />
          <EditEmail :email="cachedContact.email" />
        </v-card-text>

        <v-card-actions>
          <v-btn
            :block="isMobile"
            color="error"
            :text="!isMobile"
            @click="deleteContact()"
          >
            <v-icon left> mdi-delete </v-icon>
            Delete
          </v-btn>
          <v-spacer v-if="!isMobile"></v-spacer>
          <v-btn v-if="!isMobile" color="primary" text @click="cancel()"> Cancel </v-btn>
          <v-btn v-if="!isMobile" color="primary" @click="save()">
            <v-icon left> mdi-content-save </v-icon>Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EditImg from "@/components/contactEdit/Img.vue";
import EditName from "@/components/contactEdit/Name.vue";
import EditTel from "@/components/contactEdit/Tel.vue";
import EditEmail from "@/components/contactEdit/Email.vue";

export default {
  name: "contact-edit",
  components: {
    EditImg,
    EditName,
    EditTel,
    EditEmail,
  },
  props: {
    contact: Object,
    color: {
      type: String,
      default: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    },
  },
  data: () => {
    return {
      dialog: false,
      cachedContact: {},
    };
  },
  created() {
    this.setCachedContact();
  },
  computed: {
    isMobile: () => {
      // show dialog as fullscreen for mobile screens
      return (
        Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) <=
        960
      );
    },
  },
  methods: {
    setCachedContact() {
      this.cachedContact = JSON.parse(JSON.stringify(this.contact)); // dirty, but 'this.cachedContact = { ...this.contact };' doesn't worked for cloning
    },
    save() {
      this.dialog = false;
      this.$emit("saved", this.cachedContact);
    },
    cancel() {
      this.dialog = false;
      this.setCachedContact();
    },
    deleteContact() {
      this.dialog = false;
      this.$emit("deleted", this.contact);
    },
  },
};
</script>
