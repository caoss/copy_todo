/**
 * @author YM
 */
import history from './History'

class SystemUtil {
    static push(obj) {
        history.push(obj)
    }

    static replace(obj) {
        history.replace(obj)
    }

    static go(obj) {
        history.go(obj)
    }

    static goBack() {
        history.goBack()
    }

    static goForward() {
        history.goForward()
    }

    static getQueryString(str, name) {
        let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
        let r = str.substr(1).match(reg) // 获取url中"?"符后的字符串并正则匹配
        let context = ''
        if (r != null) context = r[2]
        reg = null
        r = null
        return context == null || context == '' || context == 'undefined' ?
            '' :
            context
    }
    static getdate(nows) {
            let now = new Date(nows);
        　　var y = now.getFullYear(),
        　　m = now.getMonth() + 1,
        　　d = now.getDate();
        　　return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
    }
    static xmlToJson(xml) {
        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].length) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }
}

export default SystemUtil
