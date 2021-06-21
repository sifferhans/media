<template>
  <div class="kvass-media-image-preview" :style="style"></div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    isValid: {
      type: Boolean,
      default: true,
    },
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
.kvass-media-image-preview {
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
