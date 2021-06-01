import Create from './Create'
import CreateTrigger from './CreateTrigger'
import Thumbnail from './Thumbnail'
import Preview from './Preview'

export default {
  Name: 'Image',
  Condition: (x) => /^image\/.+/i.test(x),
  Components: {
    Create,
    CreateTrigger,
    Thumbnail,
    Preview,
  },
}
