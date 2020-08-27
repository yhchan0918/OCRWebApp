<template>
  <div class="home">
    <v-form ref="form">
      <v-container class="overline">
        <v-row align-content="center" justify="space-between">
          <v-col cols="4"
            ><span>Upload image or PDF file (.png,.jpg, or .PDF)</span>
            <p>file size limit: 1MB</p></v-col
          >
          <v-col cols="8" class="">
            <v-file-input
              label="File Input"
              color="primary"
              :clearable="false"
              outlined
              ref="file"
              :accept="acceptedFormat"
              @change="handleFileChange"
              rounded
              show-size
            >
            </v-file-input>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="6" class="text-center"> </v-col>
          <v-col cols="6" class="text-right">
            <v-btn class="mr-4" color="success" @click="submitFile"
              >Start OCR
            </v-btn>
            <v-btn @click="clearResult" color=""
              >Clear <v-icon>mdi-autorenew</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div v-if="isUploaded">
              <div>
                <v-progress-linear
                  v-model="progress"
                  color="primary"
                  height="25"
                  reactive
                >
                  <strong>{{ progress }} %</strong>
                </v-progress-linear>
              </div>
            </div>
          </v-col>
        </v-row>
        <TheAlert v-if="message" :type="AlertTypes[0]" :msg="message" />
      </v-container>

      <v-container>
        <v-row justify="space-between">
          <v-col cols="12" class="text-center">
            <v-textarea
              auto-grow
              filled
              color="primary"
              label="Text"
              rows="1"
              v-model="resultText"
            >
            </v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
// @ is an alias to /src
import OCRService from "@/services/OCRService.js";
import TheAlert from "@/components/TheAlert.vue";
export default {
  name: "Home",
  data() {
    return {
      currentFile: undefined,
      progress: 0,
      AlertTypes: ["success"],
      message: "",
      acceptedFormat: [],
      isUploaded: false,
      IsParsed: false,
      resultText: "",
    };
  },
  methods: {
    //Clear Result
    clearResult() {
      this.$refs.form.reset();
      this.message = "";
    },
    //Submits all of the currentFile to the server
    submitFile() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";

      OCRService.submitFile(this.currentFile, (event) => {
        this.isUploaded = true;
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then((res) => {
          if (!res.data["IsErroredOnProcessing"]) {
            switch (res.data["OCRExitCode"]) {
              case 1:
                this.message =
                  "Parsed Successfully (Image / All pages parsed successfully)";
                break;
              case 2:
                this.message =
                  "Parsed Partially (Only few pages out of all the pages parsed successfully)";
                break;
              case 3:
                this.message =
                  "Image / All the PDF pages failed parsing (This happens mainly because the OCR engine fails to parse an image)";
                break;
              case 4:
                this.message =
                  "Error occurred when attempting to parse (This happens when a fatal error occurs during parsing )";
                break;
            }
          } else {
            this.message = res.data["ErrorMessage"];
          }

          this.resultText = res.data["ParsedResults"][0].ParsedText;
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
          this.currentFile = undefined;
        });
    },
    //Handles a change on the file upload
    handleFileChange(file) {
      this.progress = 0;
      this.currentFile = file;
    },
  },
  mounted() {},
  components: {
    TheAlert,
  },
};
</script>
