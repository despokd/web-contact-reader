<template>
  <div class="contacts">
    <v-col cols="12">
      <template>
        <v-file-input
          accept=".vcf"
          label="Import .vcf-file"
          @change="importVcf($event)"
        ></v-file-input>
      </template>
    </v-col>
    <v-col cols="12">
      <ContactCard
        v-for="(contact, index) in contacts"
        :key="index"
        :contact="contact"
        :contactsIndex="index"
        @saved="saveContact($event)"
        @deleted="deleteContact($event)"
      />
    </v-col>

    <v-snackbar v-model="snackbar.open" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          color="primary"
          v-bind="attrs"
          @click="snackbar.open = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import { openDB } from "idb/with-async-ittr.js";

export default {
  name: "contacts",
  components: {
    ContactCard,
  },
  data: () => {
    return {
      contacts: [],
      tempContacts: [],
      snackbar: {
        text: "Error",
        timeout: "3000",
        open: false,
      },
    };
  },
  created() {
    initContactsDb();
    this.getContacts();
  },
  methods: {
    importVcf: function(event) {
      // Browser is not compatible
      if (!window.FileReader) {
        this.snackbar.text = "Browser is not compatible";
        this.snackbar.open = true;
        return;
      }

      // discard if no files given
      if (event.length <= 0) {
        this.snackbar.text = "No files given";
        this.snackbar.open = true;
        return;
      }

      let fr = new FileReader();
      fr.onload = () => {
        // parse file to vCard
        let vCard = require("vcf");
        let cards = vCard.parse(fr.result);

        // add to data db
        cards.forEach((card) => {
          addContact(this.formatContact(card));
        });

        // add to data compnent
        this.getContacts();
      };
      fr.readAsText(event);
    },
    formatContact: function(card) {
      let contactObject = {
        name: {
          full: "",
          short: "",
          prefix: "",
          forename: "",
          middlenames: "",
          surname: "",
          sufix: "",
        },
        org: [],
        title: [],
        img: {
          hasImg: false,
          src: "",
        },
        tel: [],
        email: [],
        adress: [],
        url: "",
        bday: "",
      };

      console.debug(card);

      // set name
      let name = this.getFieldData(card.get("n"));
      contactObject.name.prefix = name[3] !== undefined ? name[3] : "";
      contactObject.name.forename = name[1] !== undefined ? name[1] : "";
      contactObject.name.middlenames = name[2] !== undefined ? name[2] : "";
      contactObject.name.surname = name[0] !== undefined ? name[0] : "";
      contactObject.name.sufix = name[4] !== undefined ? name[4] : "";

      // get full name
      contactObject.name.full =
        this.getFieldData(card.get("fn")) !== []
          ? this.getFieldData(card.get("fn"))[0]
          : contactObject.name.forename + " " + contactObject.name.surname;

      // get short name
      contactObject.name.short =
        contactObject.name.forename.charAt(0) +
        contactObject.name.surname.charAt(0);

      return contactObject;
    },
    getFieldData: (field) => {
      if (field == undefined) return [];
      let dataStr = field._data;
      if (dataStr == undefined) return [];

      // delete line breaks from file
      dataStr = dataStr.replace(/\r?\n|\r/g, "");

      let dataArr = dataStr.split(";");

      // decode quoted printables
      if ("charset" in field) {
        switch (field.charset) {
          case "UTF-8":
            dataArr.forEach((string, index) => {
              let decodedStr = utf8_decode(quoted_printable_decode(string));
              dataArr[index] = decodedStr.replace(/=$/, "..."); // add ellipsis, when string not long enough and end with =
            });
            break;
          default:
            dataArr[0] = "error";
        }
      }

      // return string in array
      return dataArr;
    },
    getDefaultField: function() {
      return (field) => this.getFieldData(this.contact.get(field));
    },
    getContacts: function() {
      // get entries of database
      getContactsFromDb().then((result) => {
        this.contacts = result;
      });
    },
    deleteContact(contact) {
      deleteContactDb(contact.id);

      // delete contact in vue data
      this.contacts.splice(this.getContactIndex(contact.id), 1);

      // show feedback
      this.snackbar.text = contact.name.full + " deleted";
      this.snackbar.open = true;
    },
    saveContact(updatedContact) {
      saveContactDb(updatedContact);

      // update contact in vue data
      this.contacts[this.getContactIndex(updatedContact.id)] = updatedContact;

      // show feedback
      this.snackbar.text = updatedContact.name.full + " saved";
      this.snackbar.open = true;
    },
    getContactIndex(id) {
      return this.contacts.findIndex((element) => {
        return element.id === id;
      });
    },
  },
  computed: {
    vCardContacts: function() {
      let vCard = require("vcf");
      let returnArray = new Array();
      this.contacts.forEach((contact) => {
        returnArray.push(vCard.fromJSON(contact));
      });
      return returnArray;
    },
  },
};

// indexedDb version
const dbVersion = 5;

async function initContactsDb() {
  await openDB("ContactReader", dbVersion, {
    upgrade(db) {
      db.createObjectStore("contacts", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
}

async function addContact(contact) {
  const db = await openDB("ContactReader", dbVersion);

  // add contact
  await db.add("contacts", contact);
}

async function deleteContactDb(id) {
  const db = await openDB("ContactReader", dbVersion);

  // delete entry
  await db.delete("contacts", id);
}

async function saveContactDb(savedContact) {
  const db = await openDB("ContactReader", dbVersion);

  // update contact
  await db.put("contacts", savedContact);
}

async function getContactsFromDb() {
  const db = await openDB("ContactReader", dbVersion);
  return await db.getAll("contacts");
}

function quoted_printable_decode(str) {
  //       discuss at: http://phpjs.org/functions/quoted_printable_decode/
  //      original by: Ole Vrijenhoek
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Theriault
  // reimplemented by: Theriault
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //        example 1: quoted_printable_decode('a=3Db=3Dc');
  //        returns 1: 'a=b=c'
  //        example 2: quoted_printable_decode('abc  =20\r\n123  =20\r\n');
  //        returns 2: 'abc   \r\n123   \r\n'
  //        example 3: quoted_printable_decode('012345678901234567890123456789012345678901234567890123456789012345678901234=\r\n56789');
  //        returns 3: '01234567890123456789012345678901234567890123456789012345678901234567890123456789'
  //        example 4: quoted_printable_decode("Lorem ipsum dolor sit amet=23, consectetur adipisicing elit");
  //        returns 4: 'Lorem ipsum dolor sit amet#, consectetur adipisicing elit'

  var RFC2045Decode1 = /=\r\n/gm,
    // Decodes all equal signs followed by two hex digits
    RFC2045Decode2IN = /=([0-9A-F]{2})/gim,
    // the RFC states against decoding lower case encodings, but following apparent PHP behavior
    // RFC2045Decode2IN = /=([0-9A-F]{2})/gm,
    RFC2045Decode2OUT = function(sMatch, sHex) {
      return String.fromCharCode(parseInt(sHex, 16));
    };
  return str
    .replace(RFC2045Decode1, "")
    .replace(RFC2045Decode2IN, RFC2045Decode2OUT);
}

function utf8_decode(str_data) {
  //  discuss at: http://phpjs.org/functions/utf8_decode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Norman "zEh" Fuchs
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: kirilloid
  //   example 1: utf8_decode('Kevin van Zonneveld');
  //   returns 1: 'Kevin van Zonneveld'

  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0,
    c4 = 0;

  str_data += "";

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 <= 191) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 <= 223) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else if (c1 <= 239) {
      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(
        ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
      );
      i += 3;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      c4 = str_data.charCodeAt(i + 3);
      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      c1 -= 0x10000;
      tmp_arr[ac++] = String.fromCharCode(0xd800 | ((c1 >> 10) & 0x3ff));
      tmp_arr[ac++] = String.fromCharCode(0xdc00 | (c1 & 0x3ff));
      i += 4;
    }
  }

  return tmp_arr.join("");
}
</script>
