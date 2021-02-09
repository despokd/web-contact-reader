<template>
  <div class="contact-card">
    <v-card class="mb-3">
      <v-card-text>
        <pre>{{ contact }}</pre>
        <v-divider></v-divider>
        <v-list>
          <v-list-item two-line>
            <v-list-item-avatar :color="randomColor">
              <img v-if="hasImg" :src="imgSrc" :alt="name.full" />
              <span v-else class="headline">{{ name.short }}</span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ name.full }}</v-list-item-title>
              <v-list-item-subtitle>
                <span
                  v-for="(item, index) in defaultField('org')"
                  :key="index"
                  >{{ item }}</span
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "contact-card",
  props: ["contact"],
  data: () => {
    return {
      hasImg: false,
      randomColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    };
  },
  computed: {
    defaultField: function() {
      return (field) => this.getFieldData(this.contact.get(field));
    },
    name: function() {
      let name = this.getFieldData(this.contact.get("n"));

      // set up name
      let fullName = {
        full: "",
        short: "",
        prefix: name[3] !== undefined ? name[3] : "",
        forename: name[1] !== undefined ? name[1] : "",
        middlenames: name[2] !== undefined ? name[2] : "",
        surname: name[0] !== undefined ? name[0] : "",
        sufix: name[4] !== undefined ? name[4] : "",
      };

      // get full name
      fullName.full =
        this.getFieldData(this.contact.get("fn")) !== []
          ? this.getFieldData(this.contact.get("fn"))[0]
          : fullName.forename + " " + fullName.surname;

      // get short name
      fullName.short = fullName.forename.charAt(0) + fullName.surname.charAt(0);

      return fullName;
    },
    imgSrc: function() {
      console.log(this.contact.get("PHOTO"));
      return '';
    },
  },
  methods: {
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
  },
};

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
