<template>
  <div class="home">
    <v-form>
      <v-container>
        <v-row justify="space-between">
          <v-col cols="12" class="text-center">
            <v-file-input v-on:change="selectFile"> </v-file-input>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="6" class="text-center"> </v-col>
          <v-col cols="6" class="text-right">
            <v-btn class="mr-4" @click="submitFile()">Start OCR</v-btn>
            <v-btn>Clear</v-btn>
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
    </v-form>
    <v-container>
      <v-row justify="space-between">
        <v-col cols="12" class="text-center">
          <v-textarea
            auto-grow
            filled
            color="deep-purple"
            label="Text"
            rows="1"
            v-model="result"
          >
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import OCRService from "@/services/OCRService.js";
export default {
  name: "Home",
  data() {
    return {
      currentFile: null,
      progress: 0,
      message: "",
      responseInfo: null,
      result: "",
    };
  },
  methods: {
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
          this.responseInfo = res.data;
          console.log(res.data);
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
  components: {},
};
</script>
