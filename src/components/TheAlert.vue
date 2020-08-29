<template>
  <div>
    <v-alert :type="type" dense elevation="4">
      {{ msg }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "TheAlert",
  data() {
    return {};
  },
  props: ["msg", "type"],
};
</script>

<style></style>
