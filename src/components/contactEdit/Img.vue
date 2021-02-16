<template>
  <div class="contact-edit-img mt-3" style="width: 100%">
    <v-row justify="center">
      <v-col cols="12" class="d-flex justify-center">
        <v-badge
          offset-x="30"
          offset-y="20"
          bordered
          bottom
          overlap
          color="primary"
          icon="mdi-pencil"
          tabindex="1"
        >
          <v-avatar
            :color="color"
            size="100"
            class="editImage"
            @click="editImage = !editImage"
          >
            <img
              v-if="contact.img.length !== 0"
              :src="img.src"
              :alt="contact.name.full"
            />
            <span v-else class="text-h4 white--text">{{ contact.name.short }}</span>
          </v-avatar>
        </v-badge>
      </v-col>
      <v-col cols="12" v-if="editImage" class="d-flex justify-center">
        <v-btn v-if="img !== undefined" text color="error" @click="removeAll()">
          <v-icon left>mdi-delete</v-icon>Delete
        </v-btn>
        <v-btn color="primary" @click="uploadImage()"
          ><v-icon left>mdi-camera</v-icon>Add new</v-btn
        >
      </v-col>
      <v-col class="d-flex justify-center">
        <p>{{ contact.name.full }}</p>
      </v-col>
    </v-row>

    <v-file-input
      :id="'contact-edit-img-' + contact.id"
      class="d-none"
      area-hidden="true"
      label="Upload contact image"
      accept="image/*"
      @change="readFile($event)"
    >
    </v-file-input>

    <v-dialog v-model="openCropper" @click:outside="cancel()">
      <v-card :loading="loading">
        <v-card-title>Crop image</v-card-title>
        <v-card-text>
          <div class="cropper-wrap">
            <img
              :id="'contact-edit-img-crop-' + contact.id"
              aria-label="Image to be cropped"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeCropping()" text>Cancel</v-btn>
          <v-btn color="primary" @click="save()"
            ><v-icon left>mdi-content-save</v-icon>Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.editImage {
  transition: 0.3s ease;
}
.editImage:focus,
.editImage:hover {
  opacity: 0.5;
  cursor: pointer;
}

.cropper-wrap {
  margin: auto;
  max-width: 50vw;
  max-height: 50vh;
  height: 100%;
  width: 100%;
}

.cropper-wrap img {
  margin: auto;
}

/* Ensure the size of the image fit the container perfectly */
.cropper-wrap img {
  display: block;
  max-width: 100%;
}
</style>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

// cropper instance
let cropper;

export default {
  name: "contact-edit-img",
  props: {
    contact: Object,
    color: String,
  },
  data() {
    return {
      editImage: false,
      openCropper: false,
      loading: true,
    };
  },
  computed: {
    img: function () {
      return this.contact.img.slice(-1).pop();
    },
  },
  mounted() {},
  methods: {
    uploadImage() {
      document.getElementById("contact-edit-img-" + this.contact.id).click();
      this.editImage = false;
      this.openCropper = true;
      this.loading = true;
    },
    readFile(file) {
      cropper = new Cropper(
        document.getElementById("contact-edit-img-crop-" + this.contact.id),
        {
          aspectRatio: 1 / 1,
          background: false,
          viewMode: 3,
        }
      );

      if (file) {
        var FR = new FileReader();
        FR.addEventListener("load", (e) => {
          cropper.replace(e.target.result);
          this.loading = false;
        });
        FR.readAsDataURL(file);
      } else {
        this.closeCropping();
      }
    },
    closeCropping() {
      this.openCropper = false;
      if (cropper !== undefined) cropper.destroy();
    },
    save() {
      let src = cropper.getCroppedCanvas().toDataURL("image/jpeg");
      this.contact.img.push({
        data: src.slice(23),
        encoding: "BASE64",
        src: src,
        type: "jpeg",
      });
      this.closeCropping();
    },
    removeAll() {
      this.contact.img = [];
      this.editImage = false;
    },
  },
};
</script>
