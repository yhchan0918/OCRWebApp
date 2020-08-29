<template>
  <div class="home">
    <v-container>
      <v-card class="elevation-4" id="card">
        <v-form class="mx-10" ref="form">
          <v-container>
            <v-row align-content="center" justify="space-between" class="mt-2">
              <v-col cols="4" class="pa-0 ma-0"
                ><span>Upload image or PDF file (.png,.jpg, or .pdf) :</span>
                <p>File size limit: 1MB</p></v-col
              >
              <v-col cols="8" class="pa-0 ma-0">
                <v-file-input
                  height="40px"
                  label="File input"
                  dense
                  placeholder="Select a file"
                  color="primary"
                  :clearable="false"
                  hide-details
                  ref="file"
                  :accept="acceptedFormat"
                  @change="handleFileChange"
                  outlined
                  rounded
                  show-size
                >
                </v-file-input>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn class="mr-4" color="success" @click="submitFile"
                  >Start OCR
                </v-btn>
                <v-btn @click="clearResult" color=""
                  >Clear <v-icon>mdi-autorenew</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="ma-0 pa-0">
                <transition @enter="progressEnter">
                  <v-progress-linear
                    key="progress"
                    v-if="isUploaded"
                    id="progress"
                    v-model="progress"
                    color="primary"
                    height="30"
                    rounded
                    class="mb-2"
                    reactive
                  >
                    <strong>{{ progress }} %</strong>
                  </v-progress-linear>
                </transition>
                <transition @enter="enter">
                  <TheAlert
                    key="alert"
                    v-if="message"
                    id="alert"
                    :type="AlertTypes"
                    :msg="message"
                  />
                </transition>
              </v-col>
            </v-row>

            <v-row justify="space-between">
              <v-col cols="6">
                <v-card height="350px">
                  <v-card-title>
                    Image Preview
                  </v-card-title>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-img
                          :src="imagePreview"
                          v-show="showPreview"
                          height="230px"
                          contain
                        ></v-img>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
              <v-col cols="6" class="text-center">
                <v-card height="350px">
                  <v-card-title>
                    OCR'ed Result
                  </v-card-title>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          outlined
                          color="primary"
                          rows="8"
                          label="Text"
                          v-model="resultText"
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import OCRService from "@/services/OCRService.js";
import TheAlert from "@/components/TheAlert.vue";
import gsap from "gsap";

export default {
  name: "Home",
  data() {
    return {
      currentFile: undefined,
      showPreview: false,
      imagePreview: "",
      progress: 0,
      AlertTypes: "warning",
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
      this.showPreview = false;
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
            this.AlertTypes = "success";
            switch (res.data["OCRExitCode"]) {
              case 1:
                this.message =
                  "Parsed Successfully (Image / All pages parsed successfully)";
                break;
              case 2:
                this.message =
                  "Parsed Partially (Only few pages out of all the pages parsed successfully)";
                break;
            }
          } else {
            this.AlertTypes = "error";
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
      /*
      Initialize a File Reader object
    */
      let reader = new FileReader();

      /*
      Add an event listener to the reader that when the file
      has been loaded, we flag the show preview as true and set the
      image to be what was read from the reader.
    */
      reader.addEventListener(
        "load",
        function() {
          this.showPreview = true;
          this.imagePreview = reader.result;
        }.bind(this),
        false
      );

      /*
      Check to see if the file is not empty.
    */
      if (this.currentFile) {
        /*
          Fire the readAsDataURL method which will read the file in and
          upon completion fire a 'load' event which we will listen to and
          display the image in the preview.
        */
        reader.readAsDataURL(this.currentFile);
      }
    },
    startAnimation() {
      gsap.from("#card", { x: -1000, duration: 1 });
    },
    alertAnimation() {
      gsap.fromTo("#alert", 1, { opacity: 0, y: 30 }, { opacity: 1, y: 0 });
    },
    enter() {
      return this.alertAnimation();
    },
    progressAnimation() {
      gsap.fromTo(
        "#progress",
        1.6,
        { opacity: 0, scale: 0.1 },
        { opacity: 1, scale: 1 }
      );
    },
    progressEnter() {
      return this.progressAnimation();
    },
  },
  mounted() {
    this.startAnimation();
  },
  components: {
    TheAlert,
  },
};
</script>
