<template>
  <div class="contact-edit-url">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Website" icon="mdi-web" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-for="(urlItem, index) in url" :key="index">
            <v-col :cols="urlItem.url == '' ? 11 : 10">
              <v-text-field
                v-model="urlItem.url"
                dense
                :rules="[rules.url]"
                label="Website"
              ></v-text-field>
            </v-col>
            <v-col v-if="urlItem.url != ''" cols="1">
              <v-btn
                color="primary"
                icon
                aria-label="Open website"
                :href="urlItem.url"
                target="_blank"
                class="ml-n1"
              >
                <v-icon small>mdi-link-variant</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                aria-label="Delete website"
                @click="deleteUrl(index)"
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
                @click="addUrl()"
                text
                style="margin-top: 2px"
                :class="url.length > 0 ? 'mt-n8' : ''"
              >
                <v-icon left>mdi-plus</v-icon>
                Add website
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
  name: "contact-edit-url",
  props: {
    url: {
      default: Array,
      type: Array,
    },
  },
  components: {
    SectionIcon,
  },
  data: () => {
    return {
      rules: {
        url: (value) => {
          const pattern = /^(https?):\/\/[^\s$.?#].[^\s]*$/;
          return pattern.test(value) || "Invalid url.";
        },
      },
    };
  },
  methods: {
    addUrl() {
      this.url.push({ url: "https://" });
    },
    deleteUrl(index) {
      this.url.splice(index, 1);
    },
  },
};
</script>
