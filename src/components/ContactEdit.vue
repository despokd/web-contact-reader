<template>
  <div class="contact-edit">
    <v-btn icon text @click="dialog = true" aria-label="Edit contact">
      <v-icon> mdi-pencil </v-icon>
    </v-btn>
    <v-btn icon text @click="deleteContact()" aria-label="Delete contact">
      <v-icon> mdi-delete </v-icon>
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
          <EditOrg :org="cachedContact.org" />
        </v-card-text>

        <v-card-actions :class="[isMobile, 'pb-3 ']">
          <v-btn color="error" text :block="isMobile" @click="deleteContact()">
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
import EditOrg from "@/components/contactEdit/Org.vue";

export default {
  name: "contact-edit",
  components: {
    EditImg,
    EditName,
    EditTel,
    EditEmail,
    EditOrg,
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
