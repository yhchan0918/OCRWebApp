<template>
  <div class="home">
    <v-form v-model="valid">
      <v-container>
        <v-row justify="space-between">
          <v-col cols="12" class="text-center">
            <v-file-input multiple label="File input"></v-file-input>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="6" class="text-center"> </v-col>
          <v-col cols="6" class="text-right">
            <v-btn class="mr-4">Start OCR</v-btn>
            <v-btn>Clear</v-btn>
          </v-col>
        </v-row>
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

export default {
  name: "Home",
  data() {
    return {
      file: "",
      result: "im a bitch",
    };
  },
  components: {},
};
</script>
