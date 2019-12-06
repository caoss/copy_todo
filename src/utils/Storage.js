/**
 * @author YM
 */
import StorageUtil from './Cookie'

const storage = window.localStorage
export default class Storage {
  static saveToStorage(params = {}) {
    const { key, value, expire } = params

    if (key) {
      storage.setItem(key, value)
    }
  }

  static removeFromStorage(key) {
    storage.removeItem(key)
  }

  static getFormStorage(key) {
    return storage.getItem(key)
  }
}
