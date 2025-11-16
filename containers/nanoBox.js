// containers/nanoBox.js
// NanoBox：獨立的臨時資料容器，提供 box()/boxVue() 兩種操作方式
// - box(): 純物件版本，可在任何環境使用
// - boxVue(): 若提供 Vue 的 reactive，則可取得可自動更新的版本
// 支援跨頁儲存：在 createNanoBox 時傳入 storageKey（與 optional storage adapter）

// 若要提供統一註冊入口，可在 app.js/容器中建立單例後導出：
//   import { createNanoBox } from '@/containers/nanoBox.js'
//   import { reactive } from 'vue'
//   export const nanoBox = createNanoBox({ reactive, storageKey: 'app_nano_box' })
//   // 之後於任何模組 import { nanoBox } from '@/app' 即可使用

function getByPath(obj, path) {
  if (!path) return obj
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

function ensureChild(target, key, setter) {
  const current = target[key]
  if (current && typeof current === 'object') return current
  const next = {}
  if (setter) {
    setter(target, key, next)
  } else {
    target[key] = next
  }
  return next
}

function setByPath(obj, path, value, setter = null) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((o, k) => ensureChild(o, k, setter), obj)
  if (setter) {
    setter(target, lastKey, value)
  } else {
    target[lastKey] = value
  }
  return obj
}

function deleteByPath(obj, path, deleter = null) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((o, k) => (o ? o[k] : undefined), obj)
  if (!target || !(lastKey in target)) return obj
  if (deleter) {
    deleter(target, lastKey)
  } else {
    delete target[lastKey]
  }
  return obj
}

function cloneState(obj) {
  return JSON.parse(JSON.stringify(obj ?? {}))
}

function cloneValue(value) {
  if (value === undefined || value === null) return value
  if (typeof value === 'object') {
    return cloneState(value)
  }
  return value
}

function createBox(
  state,
  { isReactive = false, notifyChange = null, setter = null, deleter = null, strictPaths = false } = {}
) {
  const notify = typeof notifyChange === 'function' ? notifyChange : null
  const shouldClone = !isReactive

  return {
    get(path) {
      const value = getByPath(state, path)
      if (strictPaths && path && value === undefined) {
        throw new Error(`NanoBoxContainer: 無法取得路徑 "${path}"`)
      }
      return shouldClone ? cloneValue(value) : value
    },
    set(path, value) {
      setByPath(state, path, value, setter)
      notify && notify({ type: 'set', path, value })
      if (isReactive) return state
      return cloneValue(getByPath(state, path))
    },
    delete(path) {
      const exists = getByPath(state, path) !== undefined
      if (strictPaths && path && !exists) {
        throw new Error(`NanoBoxContainer: 無法刪除不存在的路徑 "${path}"`)
      }
      deleteByPath(state, path, deleter)
      notify && notify({ type: 'delete', path })
    },
    clearAll() {
      Object.keys(state).forEach(key => {
        if (deleter) {
          deleter(state, key)
        } else {
          delete state[key]
        }
      })
      notify && notify({ type: 'clear' })
    },
    toJSON() {
      return shouldClone ? cloneState(state) : state
    }
  }
}

export class NanoBoxContainer {
  constructor(options = {}) {
    const {
      reactive,
      storageKey = null,
      storage = null,
      setter = null,
      deleter = null,
      strict = false,
      persistDebounce = 0,
      onPersistSuccess = null,
      onPersistError = null,
      version = null,
      migrate = null
    } = options
    this._reactive = typeof reactive === 'function' ? reactive : null
    this._setter = typeof setter === 'function' ? setter : null
    this._deleter = typeof deleter === 'function' ? deleter : null
    this._strictPaths = !!strict
    this._state = this._reactive ? this._reactive({}) : {}

    this._storageKey = storageKey || null
    this._storage = this._storageKey ? this._resolveStorage(storage) : null
    this._persistDebounce = Math.max(0, Number(persistDebounce) || 0)
    this._persistTimer = null
    this._onPersistSuccess = typeof onPersistSuccess === 'function' ? onPersistSuccess : null
    this._onPersistError = typeof onPersistError === 'function' ? onPersistError : null
    this._version = version ?? null
    this._hydratedVersion = this._version
    this._migrate = typeof migrate === 'function' ? migrate : null

    const notifyChange = () => this._schedulePersist()
    const sharedOptions = {
      notifyChange,
      setter: this._setter,
      deleter: this._deleter,
      strictPaths: this._strictPaths
    }
    this._box = createBox(this._state, sharedOptions)
    this._boxVue = this._reactive ? createBox(this._state, { ...sharedOptions, isReactive: true }) : null

    this._loadFromStorage()
  }

  box() {
    return this._box
  }

  boxVue() {
    if (!this._boxVue) {
      throw new Error('NanoBoxContainer: 尚未注入 reactive，無法使用 boxVue()')
    }
    return this._boxVue
  }

  _resolveStorage(adapter) {
    if (adapter && typeof adapter.getItem === 'function' && typeof adapter.setItem === 'function') {
      return adapter
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage
    }
    return null
  }

  _persist() {
    if (!this._storageKey || !this._storage) return
    if (this._persistDebounce <= 0) {
      this._performPersist()
      return
    }
    this._schedulePersist()
  }

  _schedulePersist() {
    if (!this._storageKey || !this._storage) return
    if (this._persistDebounce <= 0) {
      this._performPersist()
      return
    }
    if (this._persistTimer) {
      clearTimeout(this._persistTimer)
    }
    this._persistTimer = setTimeout(() => {
      this._persistTimer = null
      this._performPersist()
    }, this._persistDebounce)
  }

  _performPersist() {
    if (!this._storageKey || !this._storage) return
    try {
      const payload = this._serializeState()
      this._storage.setItem(this._storageKey, payload)
      this._onPersistSuccess && this._onPersistSuccess({ storageKey: this._storageKey, size: payload.length })
    } catch (err) {
      console.warn('NanoBoxContainer: 儲存失敗', err)
      this._onPersistError && this._onPersistError(err)
    }
  }

  _loadFromStorage() {
    if (!this._storageKey || !this._storage) return
    try {
      const raw = this._storage.getItem(this._storageKey)
      if (!raw) return
      const payload = this._deserializeState(raw)
      this._hydratedVersion = payload.version ?? this._hydratedVersion
      this._replaceState(payload.data)
    } catch (err) {
      console.warn('NanoBoxContainer: 載入失敗', err)
      this._onPersistError && this._onPersistError(err)
    }
  }

  _serializeState() {
    const baseVersion = this._version ?? this._hydratedVersion
    if (baseVersion == null) {
      return JSON.stringify(this._state)
    }
    return JSON.stringify({
      __nanoBoxVersion: baseVersion,
      data: this._state
    })
  }

  _deserializeState(raw) {
    const parsed = JSON.parse(raw)
    let version = null
    let data = parsed
    if (parsed && typeof parsed === 'object' && Object.prototype.hasOwnProperty.call(parsed, 'data')) {
      version = parsed.__nanoBoxVersion ?? null
      data = parsed.data
    }
    if (this._migrate) {
      const result = this._migrate({ version, data })
      if (result && typeof result === 'object') {
        version = result.version ?? version
        if ('data' in result) {
          data = result.data
        }
      }
    }
    return { version, data }
  }

  _replaceState(nextState) {
    Object.keys(this._state).forEach(key => {
      if (this._deleter) {
        this._deleter(this._state, key)
      } else {
        delete this._state[key]
      }
    })
    if (nextState && typeof nextState === 'object') {
      Object.keys(nextState).forEach(key => {
        if (this._setter) {
          this._setter(this._state, key, nextState[key])
        } else {
          this._state[key] = nextState[key]
        }
      })
    }
  }
}

// factory 方便建立不同實例
export function createNanoBox(options) {
  return new NanoBoxContainer(options)
}

/*
使用方式：

// 非 Vue 專案
import { createNanoBox } from './containers/nanoBox.js'
const nanoBox = createNanoBox({ storageKey: 'nano_box_demo' })
const box = nanoBox.box()
box.set('order.tableNo', 'A-01')

// Vue 專案
import { reactive } from 'vue'
import { createNanoBox } from './containers/nanoBox.js'
const nanoBox = createNanoBox({ reactive, storageKey: 'nano_box_cart' })
const boxVue = nanoBox.boxVue()
boxVue.set('cart.items', [])

// 自訂 storage adapter（例如 sessionStorage）
const nanoBoxSession = createNanoBox({
  reactive,
  storageKey: 'session_cart',
  storage: window.sessionStorage
})
*/
