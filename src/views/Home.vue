<template>
  <div class="home">
    <v-form ref="form">
      <v-container>
        <v-row justify="space-between">
          <v-col cols="12" class="text-center">
            <v-file-input ref="file" v-on:change="selectFile"> </v-file-input>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="6" class="text-center"> </v-col>
          <v-col cols="6" class="text-right">
            <v-btn class="mr-4" color="success" @click="submitFile"
              >Start OCR</v-btn
            >
            <v-btn @click="clearResult">Clear</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div v-if="currentFile">
              <div>
                <v-progress-linear
                  v-model="progress"
                  color="light-blue"
                  height="25"
                  reactive
                >
                  <strong>{{ progress }} %</strong>
                </v-progress-linear>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-alert v-if="message" border="left" color="blue-grey" dark>
          {{ message }}
        </v-alert>
      </v-container>

      <v-container>
        <v-row justify="space-between">
          <v-col cols="12" class="text-center">
            <v-textarea
              auto-grow
              filled
              color="deep-purple"
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
export default {
  name: "Home",
  data() {
    return {
      currentFile: undefined,
      progress: 0,
      message: "",
      responseInfo: null,
      resultText: "",
    };
  },
  methods: {
    //Clear Result
    clearResult() {
      if (this.resultText) {
        this.$refs.form.reset();
      }
    },
    //Submits all of the currentFile to the server
    submitFile() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";

      OCRService.submitFile(this.currentFile, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then((res) => {
          this.message = res.data.message;
          this.resultText = res.data["ParsedResults"][0].ParsedText;
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
          this.currentFile = undefined;
        });
    },
    //Handles a change on the file upload
    selectFile(file) {
      this.progress = 0;
      this.currentFile = file;
      console.log(this.currentFile);
    },
  },
  mounted() {},
  components: {},
};
</script>
