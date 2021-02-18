<template>
  <div class="contact-edit-bday-input">
    <v-row>
      <v-col cols="11">
        <v-menu
          v-model="datepicker"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              readonly
              :value="formattedBday"
              :suffix="bday.hint"
              label="Birthday"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="bday.bday"
            :max="max"
            :min="min"
            @input="
              formatToVcf();
              datepicker = false;
              getAge();
            "
            color="primary"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="1">
        <v-btn
          color="error"
          icon
          aria-label="Delete birthdate"
          @click="deleteBday()"
          class="ml-n1"
        >
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from "moment";

let vcfDateFormat = "YYYY-MM-DD";

export default {
  name: "contact-edit-bday-input",
  props: { bday: Object },
  data: () => ({
    datepicker: false,
    max: moment().format(vcfDateFormat),
    min: "0001-01-01",
  }),
  computed: {
    formattedBday() {
      return this.bday && this.bday.bday
        ? moment(this.bday.bday, vcfDateFormat).format("DD.MM.YYYY")
        : "";
    },
  },
  methods: {
    deleteBday() {
      this.$emit("deleted");
    },
    formatToVcf() {
      let bdayStr = this.bday.bday;
      moment(bdayStr, "Y-MM-DD").format(vcfDateFormat);
    },
    getAge() {
      let bdayStr = this.bday.bday;

      // empty input
      if (!bdayStr || bdayStr === "") {
        this.bday.hint = "";
        return;
      }

      // default year, if no year provided
      if (moment(bdayStr, vcfDateFormat).year() == 1) {
        this.bday.hint = "Year missing";
        return;
      }

      // calc age
      this.bday.hint =
        moment(moment()).diff(moment(bdayStr, vcfDateFormat), "years") + " years";
      return;
    },
  },
};
</script>
