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
    size: {
      type: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    style() {
      return {
        backgroundSize: this.size,
        backgroundImage: `url(${this.value.url})`,
      }
    },
  },
}
</script>

<style lang="scss">
.kvass-media-image-preview {
  padding: 1rem;
  width: 100%;
  height: 100%;
  text-align: center;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: inherit;
  background-origin: content-box;
}
</style>
