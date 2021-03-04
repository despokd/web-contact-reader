<template>
  <div class="contacts">
    <ContactEdit
      v-show="false"
      ref="editNewContact"
      :contact="this.conNew"
      @saved="saveNewContact($event)"
    />
    <v-file-input
      ref="fileInput"
      class="d-none"
      accept=".vcf"
      label="Import .vcf-file"
      @change="importVcf($event)"
    ></v-file-input>

    <v-row>
      <v-col cols="12">
        <ContactList
          v-for="contact in contacts"
          :key="contact.id"
          :contact="contact"
          @saved="saveContact($event)"
          @deleted="deleteContact($event)"
        />

        <div
          v-if="contacts.length === 0"
          class="d-flex align-center justify-center"
          style="height: 90vh"
        >
          <v-btn color="primary" x-large @click="newContact()">
            <v-icon left>mdi-account-plus</v-icon>
            Create a new contact
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-speed-dial
      v-model="fab"
      fixed
      right
      bottom
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" fab title="Manage contacts">
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-account-multiple-plus</v-icon>
        </v-btn>
      </template>
      <v-btn fab small color="success" title="Create contact" @click="newContact()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab small color="primary" title="Export all" @click="exportContacts()">
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn fab small color="primary" title="Import contacts" @click="openFileInput()">
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <v-btn fab small color="error" title="Delete all" @click="deleteAllContacts()">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>

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

<style>
.avatar-gradient {
  background: linear-gradient(
    0deg,
    rgba(1, 22, 101, 0.6012780112044818) 0%,
    rgba(0, 212, 255, 0) 100%
  );
}
</style>

<script>
import ContactList from "@/components/ContactList.vue";
import ContactEdit from "@/components/contactEdit/ContactEdit.vue";
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
      conNew: {
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
      fab: false,
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
    openFileInput: function () {
      this.$refs.fileInput.$refs.input.click();
    },
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
      let conNew = JSON.parse(JSON.stringify(this.conNew)); // dirty, but 'conNew = { ...this.conNew };' doesn't worked for cloning

      // set name
      let name = getFieldData(card.get("n"));
      conNew.name.prefix = name[3] !== undefined ? name[3] : "";
      conNew.name.forename = name[1] !== undefined ? name[1] : "";
      conNew.name.middlenames = name[2] !== undefined ? name[2] : "";
      conNew.name.surname = name[0] !== undefined ? name[0] : "";
      conNew.name.suffix = name[4] !== undefined ? name[4] : "";

      // get full name (dirty)
      if (getFieldData(card.get("fn")) !== []) {
        conNew.name.full = getFieldData(card.get("fn"))[0];
      } else {
        conNew.name.full = "";
        if (conNew.name.prefix != "") conNew.name.full += conNew.name.prefix + " ";
        if (conNew.name.forename != "") conNew.name.full += conNew.name.forename + " ";
        if (conNew.name.middlenames != "")
          conNew.name.full += conNew.name.middlenames + " ";
        if (conNew.name.surname != "") conNew.name.full += conNew.name.surname + " ";
        if (conNew.name.suffix != "") conNew.name.full += ", " + conNew.name.suffix;
      }

      // get short name
      conNew.name.short = conNew.name.forename.charAt(0) + conNew.name.surname.charAt(0);

      // get image
      let img = card.get("photo");
      if (img !== undefined) {
        if (img[0] === undefined) {
          // get single image
          conNew.img[0] = img;
          conNew.img[0].data = getFieldData(img)[0];
          conNew.img[0].src = this.generateImgSrc(img);
        } else {
          // handle multiple images
          img.forEach((element) => {
            let eleImg = element;
            eleImg.data = getFieldData(element)[0];
            eleImg.src = this.generateImgSrc(element);

            conNew.img.push(eleImg);
          });
        }
      }

      // get tel numbers
      let tel = card.get("tel");
      if (tel !== undefined) {
        // check for array (from vCard OBJECT)
        if (card.get("tel")[0] == undefined) {
          conNew.tel.push({
            type: [tel.type],
            number: getFieldData(tel)[0],
          });
        } else {
          tel.forEach((number) => {
            if (!Array.isArray(number.type)) number.type = [number.type];
            conNew.tel.push({
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
          conNew.email.push({
            type: [email.type],
            email: getFieldData(email)[0],
          });
        } else {
          email.forEach((email) => {
            if (!Array.isArray(email.type)) email.type = [email.type];
            conNew.email.push({
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
          conNew.org.push({
            org: getFieldData(org)[0],
            title: title != undefined ? getFieldData(title)[0] : "",
          });
        } else {
          if (!Array.isArray(org.type)) org.type = [org.type];
          org.forEach((org, index) => {
            conNew.org.push({
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
          conNew.adr.push({
            type: [adr.type],
            adr: getFieldData(adr),
          });
        } else {
          adr.forEach((adr) => {
            if (!Array.isArray(adr.type)) adr.type = [adr.type];
            conNew.adr.push({
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
          conNew.url.push({
            url: getFieldData(url)[0],
          });
        } else {
          url.forEach((url) => {
            conNew.url.push({
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

          conNew.bday.push({
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
            conNew.bday.push({
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
          conNew.note = getFieldData(note)[0];
        } else {
          note.forEach((note, index) => {
            if (index > 0) conNew.note += "\n\n";
            conNew.note += getFieldData(note)[0];
          });
        }
      }

      return conNew;
    },
    generateImgSrc: (img) => {
      let src = "https://i.pravatar.cc/300"; // fallback image
      if (img !== undefined) {
        if (img.encoding !== undefined) {
          // base64
          return "data:image/" + img.type + ";base64," + getFieldData(img)[0];
        } else {
          // url
          let data = getFieldData(img);
          if (data[0].substring(0, 3) == "dat") {
            return data[0] + ";" + data[1];
          }
          return data[0];
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
      let i = this.getContactIndex(contact.id);
      this.contacts = [...this.contacts.slice(0, i), ...this.contacts.slice(i + 1)];

      // show feedback
      let name = contact.name.full !== undefined ? contact.name.full : "Contact";
      this.snackbar.text = name + " deleted";
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
        this.contacts[this.getContactIndex(updatedContact.id)] = updatedContact;
        // sort contacts
        this.sortBySurname();
      } else {
        // fallback -> add to list
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
    exportContacts() {
      // init vCard
      let vCard = require("vcf");
      let cards = [];

      // format contacts to vCard
      this.contacts.forEach((contact) => {
        let contactCard = new vCard();
        // version
        contactCard.version = "4.0";
        // name
        contactCard.add(
          "n",
          contact.name.surname +
            ";" +
            contact.name.forename +
            ";" +
            contact.name.middlenames +
            ";" +
            contact.name.prefix +
            ";" +
            contact.name.suffix
        );
        // full name
        contactCard.add("fn", contact.name.full);
        contact.org.forEach((org) => {
          contactCard.add("org", org.org);
          contactCard.add("title", org.title);
        });
        // photo
        // TODO test support of urls (current base64)
        contact.img.forEach((img) => {
          contactCard.add("photo", img.src);
        });
        // telephone number
        contact.tel.forEach((tel) => {
          contactCard.add("tel", tel.number, { type: tel.type });
        });
        // address
        contact.adr.forEach((adr) => {
          contactCard.add(
            "adr",
            adr.adr[0] +
              ";" +
              adr.adr[1] +
              ";" +
              adr.adr[2] +
              ";" +
              adr.adr[3] +
              ";" +
              adr.adr[4] +
              ";" +
              adr.adr[5] +
              ";" +
              adr.adr[6],
            { type: adr.type }
          );
        });
        // e-mail
        contact.email.forEach((email) => {
          contactCard.add("email", email.email, { type: email.type });
        });
        // url
        contact.url.forEach((url) => {
          contactCard.add("url", url.url);
        });

        // add to vCards
        cards.push(contactCard);
      });

      // create vcf file content
      let vcf = cards.toString();

      // create download
      let anchor = document.createElement("a");
      anchor.setAttribute(
        "href",
        "data:text/vcard;charset=utf-8," + encodeURIComponent(vcf)
      );
      anchor.setAttribute("download", "contacts.vcf");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // show feedback
      this.snackbar.text = ".vcf created";
      this.snackbar.open = true;
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
