<template>
  <div class="contact-edit">
    <v-btn color="primary" text @click="dialog = true">
      <v-icon left> mdi-pencil </v-icon>
      Edit
    </v-btn>

    <v-dialog v-model="dialog" max-width="600px" :fullscreen="isMobile">
      <v-card>
        <v-toolbar v-if="isMobile">
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ cachedContact.name.full }}</v-toolbar-title>
        </v-toolbar>
        <v-card-title>
          <v-row justify="center">
            <v-col cols="12" class="d-flex justify-center">
              <v-avatar :color="color" size="100" class="mt-6">
                <img
                  v-if="cachedContact.img.hasImg"
                  :src="cachedContact.img.src"
                  :alt="cachedContact.name.full"
                />
                <span v-else class="text-h4">{{ cachedContact.name.short }}</span>
              </v-avatar>
            </v-col>
            <v-col class="d-flex justify-center">
              <p>{{ cachedContact.name.full }}</p>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4" sm="4" md="4">
                <v-text-field
                  label="Prefix"
                  v-model="cachedContact.name.prefix"
                ></v-text-field>
              </v-col>
              <v-col cols="8" sm="8" md="8">
                <v-text-field
                  label="Forename"
                  v-model="cachedContact.name.forename"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="7">
                <v-text-field
                  label="Middle names"
                  v-model="cachedContact.name.middlenames"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Surname"
                  v-model="cachedContact.name.surname"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel()"> Cancel </v-btn>
          <v-btn color="success" text @click="save()">
            <v-icon left> mdi-content-save </v-icon>Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "contact-edit",
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
