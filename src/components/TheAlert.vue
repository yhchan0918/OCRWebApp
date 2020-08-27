<template>
  <div>
    <v-alert :type="type" dark>
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
