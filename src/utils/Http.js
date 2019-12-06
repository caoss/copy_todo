/**
 * @author YM
 */
import crypto from 'crypto-browserify'
import AuthUtil from './AuthUtil'
import SystemUtil from './SystemUtil'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

export default class Http {
  /**
   * 默认全局请求头
   */
  static defaultHeader = {
    Accept: '*/*',
    'Content-Type': 'application/json;charset=UTF-8'
    // 'X-Neets-Realm': 'neets-bigdata',
    // 'X-Neets-Authorization': "mac token='' mac=''",
    // 'X-Neets-Version': 'V1'
  }

  /**
   * get请求
   * @param
   * url 请求链接
   */
  static get(url, params = {}, header) {
    const option = {
      method: 'get',
      headers: Object.assign({}, Http.defaultHeader, header)
    }

    const result = Http._replaceParam(url, params)
    const queryString = Http._toQueryString(result.params)

    result.url = `${result.url}${queryString == '' ? '' : `?${queryString}`}`

    console.log('发送get请求[%s]', result.url)
    return Http.netWorkRequest(result.url, option)
  }

  static get1(url, params = {}, header) {
    const option = {
      method: 'get',
      headers: Object.assign({}, Http.defaultHeader, header)
    }

    const result = Http._replaceParam(url, params)
    const queryString = Http._toQueryString(result.params)

    result.url = `${result.url}${queryString == '' ? '' : `?${queryString}`}`

    console.log('发送get请求[%s]', result.url)
    return Http.netWorkRequest1(result.url, option)
  }

  /**
   * post请求
   * @param
   * url 请求链接
   */
  static post(url, params = {}, header) {
    const result = Http._replaceParam(url, params)

    const option = {
      method: 'post',
      headers: Object.assign({}, Http.defaultHeader, header),
      body: JSON.stringify(result.params)
    }

    console.log('发送post请求[%s]', result.url)
    return Http.netWorkRequest(result.url, option)
  }

  /**
   * put请求
   * @param
   * url 请求链接
   */
  static put(url, params = {}, header) {
    const result = Http._replaceParam(url, params)

    const option = {
      method: 'PUT',
      headers: Object.assign({}, Http.defaultHeader, header),
      body: JSON.stringify(result.params)
    }

    console.log('发送put请求[%s]', result.url)
    return Http.netWorkRequest(result.url, option)
  }

  /**
   * delete请求
   * @param
   * url 请求链接
   */
  static del(url, params = {}, header) {
    const result = Http._replaceParam(url, params)

    const option = {
      method: 'DELETE',
      headers: Object.assign({}, Http.defaultHeader, header),
      body: JSON.stringify(result.params)
    }

    console.log('发送DELETE请求[%s]', result.url)
    return Http.netWorkRequest(result.url, option)
  }

  /**
   * 同时发起多个请求
   * @param {*} reqs 多个请求的参数，
   * 数据结构：
   * {promise对象}
   */
  static finishedAll(reqs = []) {
    if (reqs.length === 0) {
      return {}
    }
    return Promise.all(reqs).then(results => results)
  }

  /**
   * 设置默认全局请求头
   */
  static setDefaultHeader(header: any) {
    Object.assign(Http.defaultHeader, header)
  }

  /**
   * 解析链接参数,并替换
   */
  static _replaceParam(url, params) {
    if (!params) {
      return { url, params }
    }
    let result = /\$\{(.+?)\}/.exec(url)
    while (result) {
      if (params[result[1]] !== undefined) {
        url = url.replace(/\$\{(.+?)\}/g, params[result[1]])
        delete params[result[1]]
      }
      result = /\$\{(.+?)\}/.exec(url)
    }
    return { url, params }
  }
  /**
   * 拼接get请求的url参数
   */

  static _toQueryString(obj) {
    return obj
      ? Object.keys(obj)
          .sort()
          .map(key => {
            const val = obj[key]
            if (Array.isArray(val)) {
              return val
                .sort()
                .map(
                  val2 =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`
                )
                .join('&')
            }

            return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
          })
          .join('&')
      : ''
  }

  /**
   * fetch请求
   * @url: 请求地址,
   * @option: 请求参数
   */
  static netWorkRequest1(url, option) {
    const XNeetsAuthorization = Http.getXNeetsAuthorization(
      option.method.toUpperCase(),
      url
    )

    option.headers = Object.assign({}, option.headers, {
      'X-Neets-Realm': 'neets-uc',
      'X-Neets-Authorization': XNeetsAuthorization,
      'X-Neets-Version': 'H5-V1.0.0'
    })

    return new Promise((r, j) => {
      fetch(url, option)
        .then(res => {
          res.json().then(nRes => {
            if (
              nRes.status == '401' &&
              nRes.extension &&
              nRes.extension.code == 'UC/AUTH_EXPIRED'
            ) {
              console.log('401-------------res', nRes)
              r(nRes)
              return
              Http.refreshToken()
                .then(res => {
                  if (res.code && res.code === 'UC/AUTH_INVALID') {
                    AuthUtil.saveUserInfo({})
                  } else {
                    const userInfo = AuthUtil.getUserInfo()
                    Object.assign(userInfo, res)

                    AuthUtil.saveUserInfo(userInfo)

                    Http.netWorkRequest(url, option)
                      .then(reRes => {
                        r(reRes)
                      })
                      .catch(err => {
                        j(err)
                      })
                  }
                })
                .catch(err => {
                  // console.log('ajax1-------------------------------refreshToken---error',err);
                  CookieUtil.delCookie('neets_user')
                  AuthUtil.toLoginPage()
                })
            }
            console.log('success-------------res', nRes)
            r(nRes)
          })
        })
        .catch(err => {
          console.log('网络请求失败[%s][%s]', url, err)
          const data = {
            status: 1,
            message: '网络请求失败'
          }
          r(data)
        })
    })
  }

  /**
   * fetch请求
   * @url: 请求地址,
   * @option: 请求参数
   */
  static netWorkRequest(url, option) {
    option.headers = Object.assign(
      {},
      { token: AuthUtil.getUserId() },
      option.headers
    )

    return new Promise((r, j) => {
      fetch(url, option)
        .then(res => {
          res.json().then(nRes => {
              r(nRes)
            })
        })
        .catch(err => {
          console.log('网络请求失败[%s][%s]', url, err)
          const data = {
            status: 1,
            message: '网络请求失败'
          }
          r(data)
        })
    })
  }
  /**
   * fetch请求
   * @url: 请求地址,
   * @option: 请求参数
   */

  static getXNeetsAuthorization(HTTPMETHOD, URI) {
    let Authorization = "mac token='' mac=''"

    if (AuthUtil.getUserInfo()) {
      const userInfo = AuthUtil.getUserInfo()
      const TOKEN = userInfo.token
      const MAC_KEY = userInfo.macKey
      Authorization = Http.getAuthHmacToken(HTTPMETHOD, URI, TOKEN, MAC_KEY)
    }

    return Authorization
  }
  /**
   * fetch请求
   * @url: 请求地址,
   * @option: 请求参数
   */

  static getAuthHmacToken(HTTPMETHOD, URI, TOKEN, MAC_KEY) {
    const a_url = URI
    let host = ''
    let count = 0

    for (let i = 0; i < a_url.length; i++) {
      if (a_url.charAt(i) === '/') {
        if (++count === 3) {
          host = a_url.slice(0, i)
          URI = a_url.slice(i)
        }
      }
    }

    if (host.indexOf('https://') != -1) {
      host = host.replace('https://', '')
    } else if (host.indexOf('http://') != -1) {
      host = host.replace('http://', '')
    }

    console.log('------------', host, URI)

    const nonce = Http.getNonce()
    const content = `${HTTPMETHOD}\n${host}\n${URI}\n${nonce}\n`
    const signer = crypto.createHmac('sha256', new Buffer(MAC_KEY, 'utf8'))
    const result = signer
      .update(content)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    return `MAC token="${TOKEN}",nonce="${nonce}",mac="${result}"`
  }

  /**
   *nonce-随便32位字符串
   */
  static getNonce(len) {
    len = len || 32
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  /**
   * 刷新Token
   */
  static refreshToken() {
    return Http.post(EvnConst.ucHost + ApiConst.UC_REFRESH)
  }
}
