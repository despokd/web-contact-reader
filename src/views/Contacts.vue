<template>
  <div class="contacts">
    <ContactEdit
      v-show="false"
      ref="editNewContact"
      :contact="this.contactTemplate"
      @saved="saveNewContact($event)"
    />

    <v-row>
      <v-col cols="4">
        <template>
          <v-file-input
            accept=".vcf"
            label="Import .vcf-file"
            @change="importVcf($event)"
          ></v-file-input>
        </template>
      </v-col>
      <v-col cols="4">
        <v-btn class="mt-4" block outlined color="error" @click="deleteAllContacts()">
          Delete all
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn class="mt-4" block color="primary" @click="newContact()">
          Create contact
        </v-btn>
      </v-col>
      <v-col cols="12">
        <ContactList
          v-for="contact in contacts"
          :key="contact.id"
          :contact="contact"
          @saved="saveContact($event)"
          @deleted="deleteContact($event)"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.open" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text color="primary" v-bind="attrs" @click="snackbar.open = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ContactList from "@/components/ContactList.vue";
import ContactEdit from "@/components/ContactEdit.vue";
import { openDB } from "idb/with-async-ittr.js";

export default {
  name: "contacts",
  components: {
    ContactList,
    ContactEdit,
  },
  data: () => {
    return {
      contacts: [],
      contactTemplate: {
        name: {
          full: "",
          short: "",
          prefix: "",
          forename: "",
          middlenames: "",
          surname: "",
          suffix: "",
        },
        org: [],
        img: [],
        tel: [],
        email: [],
        adr: [],
        url: [],
        bday: [],
        note: "",
      },
      editNewContact: false,
      snackbar: {
        text: "Error",
        timeout: "3000",
        open: false,
      },
    };
  },
  computed: {
    contactsC: function () {
      return this.contacts;
    },
  },
  created() {
    initContactsDb();
    this.getContacts();
  },
  methods: {
    importVcf: function (event) {
      // Browser is not compatible
      if (!window.FileReader) {
        this.snackbar.text = "Browser is not compatible";
        this.snackbar.open = true;
        return;
      }

      // discard if no files given
      if (event == null || event == undefined || event.length <= 0) {
        this.snackbar.text = "No files given";
        this.snackbar.open = true;
        return;
      }

      let fr = new FileReader();
      fr.onload = () => {
        // parse file to vCard
        let vCard = require("vcf");
        let vcfFile = fr.result;
        vcfFile = vcfFile.replace(/[=](\s+)[=](?!$)/gm, "=");

        let cards = vCard.parse(vcfFile);

        // add to data db
        cards.forEach((card) => {
          let cardObject = this.formatContact(card);
          addContact(cardObject);
        });

        // add to data compnent
        this.getContacts();
      };
      fr.readAsText(event);
    },
    formatContact: function (card) {
      // set new contact object
      let contactTemplate = JSON.parse(JSON.stringify(this.contactTemplate)); // dirty, but 'contactTemplate = { ...this.contactTemplate };' doesn't worked for cloning

      // set name
      let name = getFieldData(card.get("n"));
      contactTemplate.name.prefix = name[3] !== undefined ? name[3] : "";
      contactTemplate.name.forename = name[1] !== undefined ? name[1] : "";
      contactTemplate.name.middlenames = name[2] !== undefined ? name[2] : "";
      contactTemplate.name.surname = name[0] !== undefined ? name[0] : "";
      contactTemplate.name.suffix = name[4] !== undefined ? name[4] : "";

      // get full name (dirty)
      if (getFieldData(card.get("fn")) !== []) {
        contactTemplate.name.full = getFieldData(card.get("fn"))[0];
      } else {
        contactTemplate.name.full = "";
        if (contactTemplate.name.prefix != "")
          contactTemplate.name.full += contactTemplate.name.prefix + " ";
        if (contactTemplate.name.forename != "")
          contactTemplate.name.full += contactTemplate.name.forename + " ";
        if (contactTemplate.name.middlenames != "")
          contactTemplate.name.full += contactTemplate.name.middlenames + " ";
        if (contactTemplate.name.surname != "")
          contactTemplate.name.full += contactTemplate.name.surname + " ";
        if (contactTemplate.name.suffix != "")
          contactTemplate.name.full += ", " + contactTemplate.name.suffix;
      }

      // get short name
      contactTemplate.name.short =
        contactTemplate.name.forename.charAt(0) + contactTemplate.name.surname.charAt(0);

      // get image
      let img = card.get("photo");
      if (img !== undefined) {
        if (img[0] === undefined) {
          // get single image
          contactTemplate.img[0] = img;
          contactTemplate.img[0].data = getFieldData(img)[0];
          contactTemplate.img[0].src = this.generateImgSrc(img);
        } else {
          // handle multiple images
          img.forEach((element) => {
            let eleImg = element;
            eleImg.data = getFieldData(element)[0];
            eleImg.src = this.generateImgSrc(element);

            contactTemplate.img.push(eleImg);
          });
        }
      }

      // get tel numbers
      let tel = card.get("tel");
      if (tel !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("tel")[0] == undefined) {
          contactTemplate.tel.push({
            type: [tel.type],
            number: getFieldData(tel)[0],
          });
        } else {
          tel.forEach((number) => {
            if (!Array.isArray(number.type)) number.type = [number.type];
            contactTemplate.tel.push({
              type: number.type,
              number: getFieldData(number)[0],
            });
          });
        }
      }

      // get emails
      let email = card.get("email");
      if (email !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("email")[0] == undefined) {
          contactTemplate.email.push({
            type: [email.type],
            email: getFieldData(email)[0],
          });
        } else {
          email.forEach((email) => {
            if (!Array.isArray(email.type)) email.type = [email.type];
            contactTemplate.email.push({
              type: email.type,
              email: getFieldData(email)[0],
            });
          });
        }
      }

      // get organization
      let org = card.get("org");
      let title = card.get("title");
      if (org !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("org")[0] == undefined) {
          contactTemplate.org.push({
            org: getFieldData(org)[0],
            title: title != undefined ? getFieldData(title)[0] : "",
          });
        } else {
          if (!Array.isArray(org.type)) org.type = [org.type];
          org.forEach((org, index) => {
            contactTemplate.org.push({
              org: getFieldData(org)[0],
              title: title != undefined ? getFieldData(title[index])[0] : "",
            });
          });
        }
      }

      // get addresses
      let adr = card.get("adr");
      if (adr !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("adr")[0] == undefined) {
          contactTemplate.adr.push({
            type: [adr.type],
            adr: getFieldData(adr),
          });
        } else {
          adr.forEach((adr) => {
            if (!Array.isArray(adr.type)) adr.type = [adr.type];
            contactTemplate.adr.push({
              type: adr.type,
              adr: getFieldData(adr),
            });
          });
        }
      }

      // get websites
      let url = card.get("url");
      if (url !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("url")[0] == undefined) {
          contactTemplate.url.push({
            url: getFieldData(url)[0],
          });
        } else {
          url.forEach((url) => {
            contactTemplate.url.push({
              url: getFieldData(url)[0],
            });
          });
        }
      }

      // get birthday
      let bday = card.get("bday");
      let bdayStr;

      if (bday !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("bday")[0] == undefined) {
          bdayStr = getFieldData(bday)[0];
          // check for missing year
          if (bdayStr.charAt(0) == "-") {
            bdayStr = bdayStr.replace("-", "0001"); // add default year
          }

          contactTemplate.bday.push({
            bday: bdayStr,
            hint: "",
          });
        } else {
          bday.forEach((bday) => {
            bdayStr = getFieldData(bday)[0];

            // check for missing year
            if (bdayStr.charAt(0) == "-") {
              bdayStr = bdayStr.replace("-", "0001"); // add default year
            }

            // add birthday
            contactTemplate.bday.push({
              bday: bdayStr,
              hint: "",
            });
          });
        }
      }

      // get note
      let note = card.get("note");
      if (note !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("note")[0] == undefined) {
          contactTemplate.note = getFieldData(note)[0];
        } else {
          note.forEach((note, index) => {
            if (index > 0) contactTemplate.note += "\n\n";
            contactTemplate.note += getFieldData(note)[0];
          });
        }
      }

      return contactTemplate;
    },
    generateImgSrc: (img) => {
      let src = "https://i.pravatar.cc/300"; // fallback image
      if (img !== undefined) {
        if (img.encoding !== undefined) {
          // base64
          src = "data:image/" + img.type + ";base64," + img.data;
        } else {
          // url
          src = img.data;
        }
      }

      return src;
    },
    getContacts() {
      // get entries of database
      getContactsFromDb().then((result) => {
        this.contacts = result;
        this.sortBySurname();
      });
    },
    sortBySurname() {
      // first by forename
      this.contacts = this.contacts.sort((a, b) =>
        a.name.forename < b.name.forename ? 1 : -1
      );
      // final by surename
      this.contacts = this.contacts.sort((a, b) =>
        a.name.surname > b.name.surname ? 1 : -1
      );
    },
    deleteContact(contact) {
      // delete contact in db
      deleteContactDb(contact.id);
      // delete contact in vue data
      this.contacts.splice(this.getContactIndex(contact.id), 1);
      // show feedback
      this.snackbar.text = contact.name.full + " deleted";
      this.snackbar.open = true;
    },
    deleteAllContacts() {
      // delete contacts in db
      deleteAllContactsDb();
      // delete contacts in vue data
      this.contacts = [];
      // show feedback
      this.snackbar.text = "All contacts deleted";
      this.snackbar.open = true;
    },
    newContact() {
      this.editNewContact = true;
      this.$refs.editNewContact.dialog = true;
    },
    saveNewContact(contact) {
      // close editing
      this.editNewContact = false;
      // save to DB / vue date
      this.saveContact(contact);
      // reset default data
    },
    saveContact(updatedContact) {
      // update contact in db
      saveContactDb(updatedContact);

      // update contact in vue data
      if ("id" in updatedContact) {
        this.contacts[updatedContact.id] = updatedContact;
        // sort contacts
        this.sortBySurname();
      } else {
        this.getContacts();
      }

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
};

// indexedDb version
const dbVersion = 6;

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

async function deleteAllContactsDb() {
  const db = await openDB("ContactReader", dbVersion);

  // delete all entries
  await db.clear("contacts");
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

function getFieldData(field) {
  if (field == undefined) return [];
  let dataArr;

  // convert to array if string
  if (field.isArray) {
    dataArr = field;
  } else {
    let dataStr = field.valueOf();
    if (dataStr == undefined) return [];

    // create array
    dataArr = dataStr.split(";");
  }

  // decode quoted printables
  if ("encoding" in field) {
    switch (field.encoding) {
      case "QUOTED-PRINTABLE":
        dataArr.forEach((string, index) => {
          let decodedStr = quoted_printable_decode(string);
          dataArr[index] = decodedStr;
        });
        break;
    }
  }

  // translate charset
  if ("charset" in field) {
    switch (field.charset) {
      case "UTF-8":
        dataArr.forEach((string, index) => {
          let translatedStr = utf8_decode(string);
          dataArr[index] = translatedStr;
        });
        break;
    }
  }

  // return string in array
  return dataArr;
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
    RFC2045Decode2OUT = function (sMatch, sHex) {
      return String.fromCharCode(parseInt(sHex, 16));
    };
  return str.replace(RFC2045Decode1, "").replace(RFC2045Decode2IN, RFC2045Decode2OUT);
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
