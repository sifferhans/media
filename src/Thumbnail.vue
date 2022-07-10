<template>
  <div class="kvass-media-thumbnail">
    <component
      :class="{ 'kvass-media-thumbnail__item--selected': value.selected }"
      class="kvass-media-thumbnail__item"
      :is="value.typeConfig.components.Thumbnail"
      :value="value"
      v-on="$listeners"
      :style="style"
    >
    </component>
    <div class="kvass-media-thumbnail__actions">
      <div v-if="!disabled" class="kvass-media-thumbnail__delete" @click="$emit('delete')">
        <FontAwesomeIcon icon="trash" />
      </div>
      <component
        :is="download.component"
        class="kvass-media-thumbnail__download"
        v-bind="download.props"
        v-on="download.listeners"
      >
        <FontAwesomeIcon icon="arrow-alt-circle-down" />
      </component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    size: {
      type: String,
      default: '4rem',
    },
    types: {
      type: Array,
    },
    disabled: {},
  },
  computed: {
    style() {
      return {
        width: this.size,
        height: this.size,
      }
    },
    download() {
      if (this.value.type.startsWith('image/'))
        return {
          component: 'div',
          props: {},
          listeners: {
            click: () => {
              fetch(this.value.url, { headers: { 'Cache-Control': 'no-cache' } })
                .then((res) => res.blob())
                .then((blob) => {
                  const blobURL = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = blobURL
                  a.style = 'display: none'
                  a.download = this.value.name

                  document.body.appendChild(a)
                  a.click()

                  document.body.removeChild(a)
                })
            },
          },
        }

      return {
        component: 'a',
        props: {
          href: this.value.url,
          download: this.value.name,
          target: '_blank',
        },
        listeners: {},
      }
    },
  },
}
</script>

<style lang="scss">
@import './main';

.kvass-media-thumbnail {
  position: relative;

  &__item {
    background-color: GetVariable('input-color');
    cursor: pointer;
    border: 1px solid GetVariable('border-color');
    border-radius: GetVariable('border-radius');

    &--selected {
      border-color: GetVariable('primary');
      box-shadow: 0 3px 10px -2px rgba(black, 0.3);
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    position: absolute;
    top: -5px;
    right: -5px;

    transition: opacity 150ms ease-out, transform 150ms ease-out;

    & > * {
      aspect-ratio: 1 / 1;
      height: 22px;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.65em;
      border-radius: 50%;
      cursor: pointer;
    }

    @media (hover: hover) {
      opacity: 0;
      transform: translateY(50%);
    }

    &:hover {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__delete {
    background-color: GetVariable('error');
  }

  &__download {
    background-color: GetVariable('primary');
  }

  &:hover {
    .kvass-media-thumbnail__actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
