<template>
  <div class="media-type-video">
    <div class="elder-input__label">Velg video type</div>
    <ChoiceComponent class="media-type-video__choice" v-model="videoType" :values="videoTypes"> </ChoiceComponent>
    <InputComponent class="media-type-video__input" label="Video ID" :prefix="prefix" placeholder="543533765" />
  </div>
</template>

<script>
import { InputComponent } from 'vue-elder-input'
import { ChoiceComponent } from 'vue-elder-choice'

export default {
  data() {
    return {
      videoType: 'vimeo',
    }
  },
  computed: {
    prefix() {
      switch (this.videoType) {
        case 'you-tube':
          return 'https://youtube.com/'
        case 'vimeo':
        default:
          return 'https://vimeo.com/'
      }
    },
    videoTypes() {
      return [
        { value: 'vimeo', label: 'Vimeo' },
        {
          value: 'you-tube',
          label: 'YouTube',
        },
      ]
    },
  },
  components: {
    InputComponent,
    ChoiceComponent,
  },
}
</script>

<style lang="scss">
.media-type-video {
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  &__label {
  }
  &__input {
    margin-top: 3rem;
  }
  &__choice {
    .elder-choices__item-label {
      padding: 0.5rem 3rem;
    }
    .elder-choices__item {
      border-radius: 50px;
      flex-grow: 0;
    }
  }
}
</style>
