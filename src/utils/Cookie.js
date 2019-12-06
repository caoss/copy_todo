/**
 * @author YM
 */

export default class Cookie {
  static save(name, value, expire) {
    let date = new Date()
    date.setDate(date.getDate() + expire)
    document.cookie = name + '=' + escape(value) + (expire ? ';expires=' + date.toGMTString() : '')
  }

  static remove(name) {
    let start, end
    if (document.cookie.length > 0) {
      start = document.cookie.indexOf(name + '=')
      if (start !== -1) {
        start = start + name.length + 1
        end = document.cookie.indexOf(';', start)
        if (end === -1) {
          end = document.cookie.length
        }
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ''
  }

  static getData(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
  }
}
