<template>
  <div class="media-option__wrapper">
    <div class="media-option">
      <button
        type="button"
        v-for="option in mediaOptions"
        :key="option.value"
        class="media-option__container"
        @click="change(option.value)"
      >
        <FontAwesomeIcon :icon="option.icon" size="2x"></FontAwesomeIcon>
        <div class="media-option__label">{{ option.label }}</div>
      </button>
      <ModalComponent :show="open" @close="close" clickaway>
        <Type :type="selected" />
      </ModalComponent>
    </div>
  </div>
</template>

<script>
import Type from './MediaType/Component'
import { ModalComponent } from 'vue-elder-modal'
export default {
  data() {
    return {
      selected: null,
      open: false,
    }
  },
  computed: {
    mediaOptions() {
      return [
        {
          label: 'Legg til video',
          value: 'video',
          icon: 'video',
        },
        { label: 'Last opp 360° bilder', value: '360', icon: 'street-view' },
      ]
    },
  },
  methods: {
    close() {
      this.open = false
    },
    change(type) {
      this.selected = type
      this.open = true
    },
  },
  components: {
    Type,
    ModalComponent,
  },
}
</script>

<style lang="scss">
@import './main';
.media-option {
  display: flex;

  &__container {
    margin: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    $size: 7rem;
    width: $size;
    height: $size;
    border: 2px dashed GetVariable('border-color');

    // $colors: #b6bcbf, #bbbfbd;

    // @for $i from 1 through 2 {
    //   &:nth-child(3n + #{$i}) {
    //     $color: nth($colors, $i);
    //     background-color: $color;
    //     border-color: darken($color, 10%);
    //   }
    // }
    background: #bbbfbd;
    svg {
      color: white;
    }
  }
  &__label {
    margin-top: 1.5em;
    font-size: 0.8em;
  }
}
</style>
