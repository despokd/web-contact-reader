<template>
  <div class="contact-edit-note">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Notes" icon="mdi-note-text" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <v-row v-if="noteD.length > 0">
            <v-col cols="11">
              <v-textarea
                v-model="noteD"
                rows="1"
                auto-grow
                dense
                label="Notes"
              ></v-textarea>
            </v-col>
            <v-col cols="1">
              <v-btn
                color="error"
                icon
                aria-label="Delete note"
                @click="deleteNote()"
                class="ml-n1"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="noteD.length <= 0">
            <v-col>
              <v-btn
                color="primary"
                small
                @click="addNote()"
                text
                style="margin-top: 2px"
                :class="noteD.length > 0 ? 'mt-n8' : ''"
              >
                <v-icon left>mdi-plus</v-icon>
                Add note
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
  name: "contact-edit-note",
  props: {
    note: {
      default: String,
      type: String,
    },
  },
  data: () => {
    return {
      noteD: "",
    };
  },
  components: {
    SectionIcon,
  },
  mounted: function () {
    this.noteD = this.note;
  },
  methods: {
    addNote() {
      this.noteD = " ";
    },
    deleteNote() {
      this.noteD = "";
    },
  },
};
</script>
