<template>
  <ButtonComponent type="button" class="image-create-trigger">
    <span>{{ label }}</span>
    <FontAwesomeIcon :icon="['fa', 'image']" class="ml-1"></FontAwesomeIcon>
  </ButtonComponent>
</template>

<script>
import { ButtonComponent } from 'vue-elder-button'
import { Options } from '../../../index'
export default {
  computed: {
    label() {
      return Options.labels.image
    },
  },
  components: {
    ButtonComponent,
  },
}
</script>

<style lang="scss">
@import '../../main';
.image-create-trigger {
  padding: 1rem 0;

  svg {
    color: GetVariable('primary');
  }
}
</style>
