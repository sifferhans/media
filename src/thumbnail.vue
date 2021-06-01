<template>
  <div
    class="elder-image__thumbnail"
    :class="{ 'elder-image__thumbnail--selected': selected }"
    :style="style"
    @click="$emit('click')"
  >
    <div v-if="!disabled" class="elder-image__thumbnail-delete" @click="$emit('delete')">
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  props: {
    value: Object,
    selected: Boolean,
    size: {
      type: String,
      default: '4rem',
    },
  },
  inject: ['disabled'],
  computed: {
    style() {
      return {
        backgroundImage: `url(${this.value.url})`,
        width: this.size,
        height: this.size,
      }
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>

<style lang="scss">
@import './main';

.elder-image__thumbnail {
  position: relative;
  background-position: center;
  background-size: cover;
  background-color: GetVariable('input-color');

  cursor: pointer;

  border-radius: GetVariable('border-radius');
  border: 1px solid GetVariable('border-color');

  &--selected {
    border-color: GetVariable('primary');
    box-shadow: 0 3px 10px -2px rgba(black, 0.3);
  }

  &-delete {
    $size: 25px;

    color: white;
    display: flex;
    font-size: 0.65em;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: -$size/5;
    top: -$size/5;
    // background-color: rgba(GetVariable('error'), 0.9);
    background-color: GetVariable('error');
    border-radius: 50%;
    height: $size;
    width: $size;
    cursor: pointer;
    transition: opacity 150ms ease-out, transform 150ms ease-out;
    z-index: 2;

    @media (hover: hover) {
      opacity: 0;
      transform: translateY(50%);
    }

    .elder-image__thumbnail:hover & {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
