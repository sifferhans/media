function AttributeBoolean(key) {
  return function() {
    return ['', true, 'true'].includes(this.$attrs[key])
  }
}

function BytesToSize(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

function Clone(val) {
  return JSON.parse(JSON.stringify(val))
}

function IsAccepted(file, accept) {
  if (!accept) return true
  return accept.split(',').some(v => {
    return file.type.startsWith(v.replace('*', ''))
  })
}

export { AttributeBoolean, BytesToSize, Clone, IsAccepted }
