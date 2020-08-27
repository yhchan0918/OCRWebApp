<template>
  <div>
    <v-alert :type="type" border="left" dark>
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
