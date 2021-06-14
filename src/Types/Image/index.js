import Create from './Create'
import CreateTrigger from './CreateTrigger'
import Thumbnail from './Thumbnail'
import Preview from './Preview'

export default {
  Name: 'Image',
  Condition: (x) => {
    return /^image\/.+/i.test(x.type)
  },
  Components: {
    Create,
    CreateTrigger,
    Thumbnail,
    Preview,
  },
}
