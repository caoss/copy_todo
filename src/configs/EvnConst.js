/**
 * @author YM
 *
 */
/* 开发模式设定 */
export const Mode = {
  DEBUG: 'DEBUG', // 本地测试环境
  TEST: 'TEST', // 线上测试环境
  PREP: 'PREP', // 预生产环境
  RELEASE: 'RELEASE' // 线上生产环境
}
/* Log域名管理 */
const apiDomainsTem = {
  DEBUG: 'http://118.178.224.109:8088/api/',
  TEST: 'http://118.178.224.109:8088/api/',
  PREP: 'http://119.23.253.207:6789/',
//   RELEASE: 'http://119.23.253.207:6789/'
  RELEASE: 'http://192.168.1.111:8090/'
}
/* 变量管理 */
export const currentMode = Mode.RELEASE

// const EvnConst = {
//   ucHost:apiDomainsTem[currentMode],

//   mainHost:apiDomainsTem[currentMode],

//   logHost: apiDomainsTem[currentMode],

//   temHost: apiDomainsTem[currentMode],
// }
const EvnConst = {
  ucHost:  main_host,
  mainHost:main_host,
  logHost: main_host,
  temHost: main_host
}
/* 导出数据 */
export default EvnConst
