/**
 * @author YM
 */
import appStore from './appStore'
import userStore from './userStore'
import versionStore from './versionStore'
import moduleStore from './moduleStore'
import mainboardStore from './mainboardStore'
import hardwareStore from './hardwareStore'
import cubeStore from './cubeStore'
import productStore from './productStore'
import moduleGroupStore from './moduleGroupStore'
import partStore from './partStore'
import traceStore from './traceStore'

const store = {
  appStore,
  cubeStore,
  partStore,
  productStore,
  moduleGroupStore,
  userStore,
  versionStore,
  moduleStore,
  mainboardStore,
  hardwareStore,
  traceStore
}

export default store
