<template>
  <input
    class="kvass-media-description"
    type="text"
    :placeholder="placeholderComp"
    :value="value"
    @input="($ev) => $emit('input', $ev.target.value)"
  />
</template>

<script>
import { Options } from '../index'

export default {
  props: {
    value: String,
    placeholder: String,
  },
  computed: {
    options() {
      return Options
    },
    placeholderComp() {
      return this.placeholder || Options.labels.descriptionPlaceholder
    },
  },
}
</script>

<style lang="scss">
.kvass-media-description {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  width: calc(100% - 1rem);
  padding: 0.5rem 0.75rem;
  text-align: left;
  font: inherit;

  border-radius: var(--border-radius, 3px);
  backdrop-filter: blur(8px);
  background-color: rgba(white, 0.7);
  transition: 150ms ease-out;
  text-overflow: ellipsis;

  z-index: 1;

  @media (hover: hover) {
    transform: translateY(1rem);
    opacity: 0;
  }

  .kvass-media-droparea:hover &,
  &:focus-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 1px solid var(--primary);
  }
}
</style>
