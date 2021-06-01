<template>
  <div class="media-type">
    <component :is="mediaType"> </component>
  </div>
</template>

<script>
import Type from './Type'

export default {
  props: {
    type: {
      type: String,
      default: 'image',
    },
  },
  computed: {
    mediaType() {
      switch (this.type) {
        case 'image':
          return Type.Image
        case 'video':
          return Type.Video
      }
    },
  },
}
</script>

<style lang="scss">
.media-type {
  background: white;
  padding: 5rem;
}
</style>
