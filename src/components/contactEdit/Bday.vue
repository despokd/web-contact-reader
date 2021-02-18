<template>
  <div class="contact-edit-bday">
    <v-row>
      <v-col cols="1">
        <SectionIcon section="Birthday" icon="mdi-calendar" />
      </v-col>
      <v-col cols="11">
        <v-container>
          <BdayInput
            v-for="(bdayItem, index) in bday"
            :bday="bdayItem"
            :key="index"
            @deleted="deleteBday(index)"
          ></BdayInput>
          <v-spacer :class="bday.length > 0 ? 'mb-n6' : ''"></v-spacer>
          <v-row v-if="bday.length < 1">
            <v-col>
              <v-btn
                color="primary"
                small
                @click="addBday()"
                text
                style="margin-top: 2px"
                :class="bday.length > 0 ? 'mt-n8' : ''"
              >
                <v-icon left>mdi-plus</v-icon>
                Add birthday
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
import BdayInput from "@/components/contactEdit/helper/BdayInput.vue";

export default {
  name: "contact-edit-bday",
  props: {
    bday: {
      default: Array,
      type: Array,
    },
  },
  components: {
    SectionIcon,
    BdayInput,
  },
  methods: {
    addBday() {
      this.bday.push({ bday: null });
    },
    deleteBday(index) {
      this.bday.splice(index, 1);
    },
  },
};
</script>
