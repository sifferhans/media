const requireModule = require.context('.', true, /\.vue$/)
const modules = {}

requireModule.keys().forEach(fileName => {
  if (fileName.endsWith('index.js')) return
  const moduleName = fileName.replace(/(\.\/|\.vue)/g, '')
  modules[moduleName] = requireModule(fileName).default
})

export default modules
