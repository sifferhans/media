<template>
  <div class="kvass-media-image__thumbnail" :style="style" @click="$emit('click')"></div>
</template>
<script>
export default {
  props: {
    value: Object,
  },

  computed: {
    style() {
      return {
        backgroundImage: `url(${this.value.url})`,
      }
    },
  },
}
</script>

<style lang="scss">
.kvass-media-image__thumbnail {
  position: relative;
  background-position: center;
  background-size: cover;
}
</style>
