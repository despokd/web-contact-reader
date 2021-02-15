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
          <v-btn color="primary" text @click="save()">
            <v-icon left> mdi-content-save </v-icon>Save
          </v-btn>
        </v-toolbar>

        <v-card-title class="mt-6">
          <v-row justify="center">
            <v-col cols="12" class="d-flex justify-center">
              <EditImg :contact="cachedContact" :color="color" />
            </v-col>
            <v-col class="d-flex justify-center">
              <p>{{ cachedContact.name.full }}</p>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <EditName :name="cachedContact.name" />
          <v-divider class="mb-5"></v-divider>
          <EditTel :tel="cachedContact.tel" />
        </v-card-text>

        <v-card-actions v-if="!isMobile">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel()"> Cancel </v-btn>
          <v-btn color="primary" @click="save()">
            <v-icon left> mdi-content-save </v-icon>Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EditName from "@/components/contactEdit/Name.vue";
import EditTel from "@/components/contactEdit/Tel.vue";
import EditImg from "@/components/contactEdit/Img.vue";

export default {
  name: "contact-edit",
  components: {
    EditName,
    EditTel,
    EditImg,
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
  },
};
</script>
