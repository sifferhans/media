import MediaComponent from './src/Component.vue'

const Options = {
  upload(file, onProgress) {
    console.warn('[@kvass/media]: You need to setup the upload function before using this plugin')
    onProgress(50)
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onloadend = function () {
        resolve({
          url: reader.result,
          type: file.type,
        })
      }
      reader.readAsDataURL(file)
    })
  },
  serialize(val) {
    return val
  },
  dropMessage: 'Drag an image here or <b>browse</b> to upload.',
  selectLabel: 'Select',
  actionLabels: {
    save: 'Save',
    cancel: 'Cancel',
    select: 'Select',
  },
}

const install = (Vue) => {
  Vue.component('media-component', MediaComponent)
}

const setup = (options) => {
  for (let key in options) {
    if (!(key in Options)) return
    Options[key] = options[key]
  }
}

export default {
  install,
}

export { MediaComponent, install as MediaComponentInstaller, setup, Options }
