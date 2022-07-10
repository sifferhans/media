<template>
  <div class="kvass-media-thumbnail-actions">
    <div v-if="!disabled" class="kvass-media-thumbnail-actions__delete" @click="$emit('delete')">
      <FontAwesomeIcon icon="trash" />
    </div>
    <component
      :is="download.component"
      class="kvass-media-thumbnail-actions__download"
      v-bind="download.props"
      v-on="download.listeners"
    >
      <FontAwesomeIcon icon="arrow-alt-circle-down" />
    </component>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    disabled: Boolean,
  },
  computed: {
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

.kvass-media-thumbnail-actions {
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

  &__delete {
    background-color: GetVariable('error');
  }

  &__download {
    background-color: GetVariable('primary');
  }
}
</style>
