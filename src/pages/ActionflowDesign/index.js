/**
 * @author 
 * 动作设计
 */
import React, { Component } from 'react'
import './index.scss'
import { Card, Icon, Modal } from 'antd'
import Workspace from '../../components/Workspace'
import Slider from '../../components/Slider'
import Storage from '../../utils/Storage'
import AttrContent from '../../components/NodeAttribute'
import ModalAction from '../../components/ModalAction'
import ModalCondition from '../../components/ModalCondition'
import xml2js from'xml2js';
class Index extends Component {
    constructor(props) {
        super(props)
        const self = this
        this.id = this.props.location.search.substring(('?id=').length);
        this.state = {
            mode: 0,
            conditionMode:0,
            data: {},
            workspaceRef: null,
            descriptors: {},
            saveData: Storage.getFormStorage(this.id),
            isShowAttrs: false,
            selectedItem: null,
            conditionId:null,
            conditionList:[],
            axisList:[],//
            outInfList:[],//
            paramList:[],
        }
        
    }

    componentDidMount() {

        import('../../json/actionflow.json').then(descriptors => {
            this.setState({
                descriptors: descriptors.default
            })
        })
        this.setState({
            workspaceRef: this.refs.myWorkspace
        })
        //xml->json
        var xml = `<?xml version='1.0' encoding='UTF-8'?><software id="1" versionName="水胶贴合样机" versionNum="1.1.1.31" developer="龙工"><cardList><card id="1" hardwareId="1" ip="127.0.0.1" remark="主卡"><inInfList><inf id="1" cardId="1" index="0" name="原点-0号电机" remark="" invertFlag="0"/><inf id="2" cardId="1" index="1" name="原点-1号电机" remark="" invertFlag="0"/><inf id="3" cardId="1" index="2" name="原点-2号电机" remark="" invertFlag="0"/><inf id="4" cardId="1" index="3" name="原点-3号电机" remark="" invertFlag="0"/><inf id="5" cardId="1" index="4" name="原点-4号电机" remark="" invertFlag="0"/><inf id="6" cardId="1" index="5" name="原点-5号电机" remark="" invertFlag="0"/><inf id="7" cardId="1" index="6" name="原点-6号电机" remark="" invertFlag="1"/><inf id="8" cardId="1" index="7" name="原点-7号电机" remark="" invertFlag="1"/><inf id="9" cardId="1" index="8" name="原点-8号电机" remark="" invertFlag="1"/><inf id="10" cardId="1" index="9" name="原点-9号电机" remark="" invertFlag="0"/><inf id="11" cardId="1" index="10" name="门禁" remark="True表示门都关好了, False表示门打开了" invertFlag="0"/><inf id="12" cardId="1" index="11" name="1号电机扭矩达到了" remark="true表示达到了" invertFlag="0"/><inf id="13" cardId="1" index="12" name="正极限-0号电机" remark="" invertFlag="0"/><inf id="14" cardId="1" index="13" name="正极限-1号电机" remark="" invertFlag="0"/><inf id="15" cardId="1" index="14" name="正极限-2号电机" remark="" invertFlag="0"/><inf id="16" cardId="1" index="15" name="正极限-3号电机" remark="" invertFlag="0"/><inf id="17" cardId="1" index="16" name="正极限-4号电机" remark="" invertFlag="0"/><inf id="18" cardId="1" index="17" name="正极限-5号电机" remark="" invertFlag="0"/><inf id="19" cardId="1" index="18" name="正极限-6号电机" remark="" invertFlag="0"/><inf id="20" cardId="1" index="19" name="正极限-7号电机" remark="" invertFlag="0"/><inf id="21" cardId="1" index="20" name="正极限-8号电机" remark="" invertFlag="0"/><inf id="22" cardId="1" index="21" name="正极限-9号电机" remark="" invertFlag="0"/><inf id="23" cardId="1" index="22" name="阻挡气缸伸出" remark="" invertFlag="0"/><inf id="24" cardId="1" index="23" name="阻挡气缸缩回" remark="" invertFlag="0"/><inf id="25" cardId="1" index="24" name="报警-0号电机" remark="" invertFlag="1"/><inf id="26" cardId="1" index="25" name="报警-1号电机" remark="" invertFlag="1"/><inf id="27" cardId="1" index="26" name="报警-2号电机" remark="" invertFlag="1"/><inf id="28" cardId="1" index="27" name="报警-3号电机" remark="" invertFlag="1"/><inf id="29" cardId="1" index="28" name="报警-4号电机" remark="" invertFlag="1"/><inf id="30" cardId="1" index="29" name="报警-5号电机" remark="" invertFlag="1"/><inf id="31" cardId="1" index="30" name="报警-6号电机" remark="" invertFlag="1"/><inf id="32" cardId="1" index="31" name="报警-7号电机" remark="" invertFlag="1"/><inf id="33" cardId="1" index="32" name="报警-8号电机" remark="" invertFlag="1"/><inf id="34" cardId="1" index="33" name="报警-9号电机" remark="" invertFlag="1"/><inf id="35" cardId="1" index="64" name="负极限-0号电机" remark="" invertFlag="0"/><inf id="36" cardId="1" index="65" name="负极限-1号电机" remark="" invertFlag="0"/><inf id="37" cardId="1" index="66" name="负极限-2号电机" remark="" invertFlag="0"/><inf id="38" cardId="1" index="67" name="负极限-3号电机" remark="" invertFlag="0"/><inf id="39" cardId="1" index="68" name="负极限-4号电机" remark="" invertFlag="0"/><inf id="40" cardId="1" index="69" name="负极限-5号电机" remark="" invertFlag="0"/><inf id="41" cardId="1" index="70" name="负极限-6号电机" remark="" invertFlag="0"/><inf id="42" cardId="1" index="71" name="负极限-7号电机" remark="" invertFlag="0"/><inf id="43" cardId="1" index="72" name="负极限-8号电机" remark="" invertFlag="0"/><inf id="44" cardId="1" index="73" name="负极限-9号电机" remark="" invertFlag="0"/><inf id="45" cardId="1" index="80" name="启动按钮" remark="按下去了灯就要亮" invertFlag="0"/><inf id="46" cardId="1" index="81" name="停止按钮" remark="按下去了灯就要亮,再按一下就灭掉了" invertFlag="0"/><inf id="47" cardId="1" index="82" name="复位按钮" remark="按下去了灯就要亮，直到启动按钮被按下" invertFlag="0"/><inf id="48" cardId="1" index="83" name="急停按钮" remark="True表示系统正常，False表示系统异常" invertFlag="0"/><inf id="49" cardId="1" index="88" name="上吸气平台的真空压力开关" remark="" invertFlag="0"/><inf id="50" cardId="1" index="89" name="对位平台的真空压力开关" remark="" invertFlag="0"/><inf id="51" cardId="1" index="90" name="移载平台的产品有无光电传感器" remark="True表示有产品，False表示没有产品" invertFlag="0"/></inInfList><outInfList><inf id="52" cardId="1" index="0" name="上吸气平台的粘Pa带动气缸电磁阀" remark="True表示粘Pa上升释放产品，False表示粘Pa下来粘住产品" invertFlag="0"/><inf id="53" cardId="1" index="1" name="上吸气平台的勾住气缸电磁阀" remark="True表示勾住产品，False表示释放产品" invertFlag="0"/><inf id="54" cardId="1" index="2" name="上吸气平台的真空吸盘电磁阀1" remark="True表示吸住产品，False表示释放产品" invertFlag="0"/><inf id="55" cardId="1" index="3" name="上吸气平台的真空吸盘电磁阀2" remark="True表示吸住产品，False表示释放产品" invertFlag="0"/><inf id="56" cardId="1" index="4" name="上吸气平台的真空吸盘电磁阀3" remark="True表示吸住产品，False表示释放产品" invertFlag="0"/><inf id="57" cardId="1" index="5" name="上吸气平台的真空吸盘电磁阀4" remark="True表示吸住产品，False表示释放产品" invertFlag="0"/><inf id="58" cardId="1" index="6" name="上吸气平台破真空" remark="True表示释放产品，False表示吸住产品" invertFlag="0"/><inf id="59" cardId="1" index="7" name="对位平台的真空吸盘电磁阀2" remark="True表示真空到位了产品吸稳了，False表示没有吸住产品" invertFlag="0"/><inf id="60" cardId="1" index="8" name="阻挡气缸电磁阀" remark="True表示气缸请求缩回状态，False表示气缸请求伸出状态" invertFlag="0"/><inf id="61" cardId="1" index="9" name="1号电机工作模式切换" remark="true表示位置模式，false表示扭矩模式" invertFlag="0"/><inf id="62" cardId="1" index="11" name="所有电机清除警报" remark="" invertFlag="0"/><inf id="63" cardId="1" index="12" name="伺服0使能" remark="" invertFlag="0"/><inf id="64" cardId="1" index="13" name="伺服1使能" remark="" invertFlag="0"/><inf id="65" cardId="1" index="14" name="伺服2使能" remark="" invertFlag="0"/><inf id="66" cardId="1" index="15" name="伺服3使能" remark="" invertFlag="0"/><inf id="67" cardId="1" index="16" name="伺服4使能" remark="" invertFlag="0"/><inf id="68" cardId="1" index="17" name="伺服6使能" remark="" invertFlag="0"/><inf id="69" cardId="1" index="19" name="伺服7使能" remark="" invertFlag="0"/><inf id="70" cardId="1" index="20" name="伺服8使能" remark="" invertFlag="0"/><inf id="71" cardId="1" index="21" name="伺服9使能" remark="" invertFlag="0"/><inf id="72" cardId="1" index="64" name="真空腔体的抽真空电磁阀" remark="true表示可以抽真空，false表示不能抽真空" invertFlag="0"/><inf id="73" cardId="1" index="65" name="真空腔体的进自然空气电磁阀" remark="true表示打开出入口供自然空气进入，false表示堵住出入口以便抽真空" invertFlag="0"/><inf id="74" cardId="1" index="66" name="塔灯红" remark="" invertFlag="0"/><inf id="75" cardId="1" index="67" name="塔灯绿" remark="" invertFlag="0"/><inf id="76" cardId="1" index="68" name="塔灯黄" remark="" invertFlag="0"/><inf id="77" cardId="1" index="69" name="塔灯蓝" remark="" invertFlag="0"/><inf id="78" cardId="1" index="70" name="塔灯音乐" remark="" invertFlag="0"/><inf id="79" cardId="1" index="80" name="启动按钮灯" remark="" invertFlag="0"/><inf id="80" cardId="1" index="81" name="停止按钮灯" remark="" invertFlag="0"/><inf id="81" cardId="1" index="82" name="复位按钮灯" remark="" invertFlag="0"/><inf id="82" cardId="1" index="83" name="左视觉平台光源" remark="" invertFlag="0"/><inf id="83" cardId="1" index="84" name="右视觉平台光源" remark="" invertFlag="0"/></outInfList><aInInfList><inf id="84" cardId="1" index="96" name="真空计气压" remark="" invertFlag="0"/></aInInfList><aOutInfList><inf id="85" cardId="1" index="0" name="1号电机扭矩模式时的扭力" remark="" invertFlag="0"/></aOutInfList><axisList><axis id="86" cardId="1" index="0" name="0轴上腔体电机" remark=""><axisSetting><axisDirection>Y:Down</axisDirection><axisType>4</axisType><units>1000.0</units><invertStep>2</invertStep><sramp>0.0</sramp><homeSpeed>5.0</homeSpeed><workSpeed>50.0</workSpeed><fsLimit>345.0</fsLimit><rsLimit>-20.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>1</datumIn><fwdIn>13</fwdIn><revIn>35</revIn><almIn>25</almIn><servoOut>63</servoOut></axisSetting><pointList><axisPoint id="1"><pointName>P1取料位</pointName><position>20.0</position></axisPoint><axisPoint id="2"><pointName>P2快速跑密封圈预接触位</pointName><position>315.0</position></axisPoint><axisPoint id="3"><pointName>P3慢速跑密封圈压紧位</pointName><position>330.0</position></axisPoint><axisPoint id="4"><pointName>P4拍照位</pointName><position>40.0</position></axisPoint></pointList></axis><axis id="87" cardId="1" index="1" name="1轴压合电机" remark=""><axisSetting><axisDirection>Y:Down</axisDirection><axisType>4</axisType><units>20000.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>5.0</homeSpeed><workSpeed>10.0</workSpeed><fsLimit>60.0</fsLimit><rsLimit>-20.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>2</datumIn><fwdIn>14</fwdIn><revIn>36</revIn><almIn>26</almIn><servoOut>64</servoOut></axisSetting><pointList><axisPoint id="5"><pointName>P1取料位</pointName><position>52.0</position></axisPoint><axisPoint id="6"><pointName>P2快速跑产品预压合位</pointName><position>5.0</position></axisPoint><axisPoint id="7"><pointName>P3拍照位</pointName><position>58.0</position></axisPoint></pointList></axis><axis id="88" cardId="1" index="2" name="2轴左视觉X电机" remark=""><axisSetting><axisDirection>X:Right</axisDirection><axisType>4</axisType><units>500.0</units><invertStep>2</invertStep><sramp>0.0</sramp><homeSpeed>10.0</homeSpeed><workSpeed>30.0</workSpeed><fsLimit>150.0</fsLimit><rsLimit>-30.0</rsLimit><homeMode>14</homeMode><safePosition>-23.0</safePosition><datumIn>3</datumIn><fwdIn>15</fwdIn><revIn>37</revIn><almIn>27</almIn><servoOut>65</servoOut></axisSetting><pointList><axisPoint id="8"><pointName>P1拍照位</pointName><position>230.0</position></axisPoint></pointList></axis><axis id="89" cardId="1" index="3" name="3轴左视觉Y电机" remark=""><axisSetting><axisDirection>Y:Down</axisDirection><axisType>4</axisType><units>1000.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>10.0</homeSpeed><workSpeed>50.0</workSpeed><fsLimit>150.0</fsLimit><rsLimit>-30.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>4</datumIn><fwdIn>16</fwdIn><revIn>38</revIn><almIn>28</almIn><servoOut>66</servoOut></axisSetting><pointList><axisPoint id="9"><pointName>P1拍照位</pointName><position>204.3</position></axisPoint></pointList></axis><axis id="90" cardId="1" index="4" name="4轴右视觉X电机" remark=""><axisSetting><axisDirection>X:Left</axisDirection><axisType>4</axisType><units>500.0</units><invertStep>2</invertStep><sramp>0.0</sramp><homeSpeed>10.0</homeSpeed><workSpeed>30.0</workSpeed><fsLimit>150.0</fsLimit><rsLimit>-30.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>5</datumIn><fwdIn>17</fwdIn><revIn>39</revIn><almIn>29</almIn><servoOut>67</servoOut></axisSetting><pointList><axisPoint id="10"><pointName>P1拍照位</pointName><position>224.5</position></axisPoint></pointList></axis><axis id="91" cardId="1" index="5" name="5轴右视觉Y电机" remark=""><axisSetting><axisDirection>Y:Down</axisDirection><axisType>4</axisType><units>1000.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>10.0</homeSpeed><workSpeed>50.0</workSpeed><fsLimit>150.0</fsLimit><rsLimit>-30.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>6</datumIn><fwdIn>18</fwdIn><revIn>40</revIn><almIn>30</almIn><servoOut>68</servoOut></axisSetting><pointList><axisPoint id="11"><pointName>P1拍照位</pointName><position>202.0</position></axisPoint></pointList></axis><axis id="92" cardId="1" index="6" name="6轴对位X1电机" remark=""><axisSetting><axisDirection>X:Left</axisDirection><axisType>4</axisType><units>2000.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>5.0</homeSpeed><workSpeed>10.0</workSpeed><fsLimit>10.0</fsLimit><rsLimit>-10.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>7</datumIn><fwdIn>19</fwdIn><revIn>41</revIn><almIn>31</almIn><servoOut>69</servoOut></axisSetting><pointList/></axis><axis id="93" cardId="1" index="7" name="7轴对位X2电机" remark=""><axisSetting><axisDirection>X:Right</axisDirection><axisType>4</axisType><units>2000.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>5.0</homeSpeed><workSpeed>10.0</workSpeed><fsLimit>10.0</fsLimit><rsLimit>-10.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>8</datumIn><fwdIn>20</fwdIn><revIn>42</revIn><almIn>32</almIn><servoOut>70</servoOut></axisSetting><pointList/></axis><axis id="94" cardId="1" index="8" name="8轴对位Y电机" remark=""><axisSetting><axisDirection>Y:Up</axisDirection><axisType>4</axisType><units>2000.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>5.0</homeSpeed><workSpeed>10.0</workSpeed><fsLimit>10.0</fsLimit><rsLimit>-10.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>9</datumIn><fwdIn>21</fwdIn><revIn>43</revIn><almIn>33</almIn><servoOut>71</servoOut></axisSetting><pointList/></axis><axis id="95" cardId="1" index="9" name="9轴移载电机" remark=""><axisSetting><axisDirection>X:Right</axisDirection><axisType>4</axisType><units>500.0</units><invertStep>0</invertStep><sramp>0.0</sramp><homeSpeed>20.0</homeSpeed><workSpeed>60.0</workSpeed><fsLimit>660.0</fsLimit><rsLimit>-20.0</rsLimit><homeMode>14</homeMode><safePosition>0.0</safePosition><datumIn>10</datumIn><fwdIn>22</fwdIn><revIn>44</revIn><almIn>34</almIn><servoOut>72</servoOut></axisSetting><pointList><axisPoint id="12"><pointName>P1放料位</pointName><position>640.0</position></axisPoint></pointList></axis></axisList></card></cardList><buttonList><button id="1"><buttonType>1</buttonType><infIn>45</infIn><infName>启动按钮</infName></button><button id="2"><buttonType>2</buttonType><infIn>46</infIn><infName>停止按钮</infName></button><button id="3"><buttonType>3</buttonType><infIn>48</infIn><infName>急停按钮</infName></button><button id="4"><buttonType>4</buttonType><infIn>47</infIn><infName>复位按钮</infName></button></buttonList><paramList><param id="1"><param>VaccumSetValue</param><paramVal>105</paramVal><paramDesc>抽真空设定值(Pa)</paramDesc></param><param id="2"><param>VaccumKeepDelayTime</param><paramVal>1.0</paramVal><paramDesc>真空延时时间(S)</paramDesc></param><param id="3"><param>CavityFitDelayTime</param><paramVal>10.0</paramVal><paramDesc>压合延时时间(S)</paramDesc></param><param id="4"><param>FitTorquePercent</param><paramVal>10</paramVal><paramDesc>压合扭矩设置(%)</paramDesc></param><param id="5"><param>FitDist</param><paramVal>0.80</paramVal><paramDesc>压合量(mm)</paramDesc></param><param id="6"><param>ByPassDoorSafe</param><paramVal>true</paramVal><paramDesc>(仅调试时用)门禁没有关好也可以正常生产</paramDesc></param><param id="7"><param>ByPassVaccum</param><paramVal>true</paramVal><paramDesc>(仅调试时用)不抽真空</paramDesc></param><param id="8"><param>ByPassExistProduct</param><paramVal>true</paramVal><paramDesc>(仅调试时用)没有产品也可以跑自动</paramDesc></param><param id="9"><param>IgnoreTopSuckerVacuumSuckerValve1</param><paramVal>false</paramVal><paramDesc>屏蔽上吸盘1</paramDesc></param><param id="10"><param>IgnoreTopSuckerVacuumSuckerValve2</param><paramVal>false</paramVal><paramDesc>屏蔽上吸盘2</paramDesc></param><param id="11"><param>IgnoreTopSuckerVacuumSuckerValve3</param><paramVal>false</paramVal><paramDesc>屏蔽上吸盘3</paramDesc></param><param id="12"><param>IgnoreTopSuckerVacuumSuckerValve4</param><paramVal>false</paramVal><paramDesc>屏蔽上吸盘4</paramDesc></param><param id="13"><param>ByPassMovePlatform</param><paramVal>true</paramVal><paramDesc>(仅调试时用)不使用移栽平台</paramDesc></param><param id="14"><param>ByPassCamera</param><paramVal>true</paramVal><paramDesc>(仅调试时用)不使用相机对位</paramDesc></param></paramList></software>`;
        let self = this;
        var xmlParser = new xml2js.Parser({
            explicitArray: false,
            ignoreAttrs: false,
            mergeAttrs: true,
            charsAsChildren: true
        })
        xmlParser.parseString(xml, function (err, result) {
            self.setState({
                axisList: result.software.cardList.card.axisList.axis,
                outInfList: result.software.cardList.card.outInfList.inf,
                paramList: result.software.paramList.param,
                aInInfList: result.software.cardList.card.aInInfList.inf,
                aOutInfList:result.software.cardList.card.aOutInfList.inf,
                inInfList:result.software.cardList.card.inInfList.inf,
            })
            console.log('----------', result);
        });
        // json --> xml
        var obj = {
            name: "Super",
            Surname: "Man",
            age: 23
        };
        var builder = new xml2js.Builder();
        var jsonxml = builder.buildObject(obj);
        console.log(jsonxml);
        console.log('----------');

        eventBus.on('elementsSelect', this.handlers.selectElement)
        eventBus.on('elementsNoSelect', this.handlers.noSelectElement)
        eventBus.on('elementsDbclick', this.handlers.dbclickElement)
    }

    componentWillUnmount() {
        eventBus.off('elementsSelect', this.handlers.selectElement)
        eventBus.off('elementsNoSelect', this.handlers.noSelectElement)
        eventBus.off('elementsDbclick', this.handlers.dbclickElement)
    }

    handlers = {
        selectElement: (eleView, ev) => {
            this.setState({
                selectedItem: eleView,
                isShowAttrs: true
            })
        },
        noSelectElement: (eleView, ev) => {
            this.setState({
                selectedItem: null,
                isShowAttrs: false
            })
        },
        dbclickElement: (eleView, ev) => {
            const ele = eleView.model
            console.log(ele);
            if (ele.prop('type') === 'node.Job') {//动作指令`
                
                this.setState({ mode: 1,
                                actionId:ele.id,
                                actionList:JSON.parse( Storage.getFormStorage(ele.id) ) && JSON.parse( Storage.getFormStorage(ele.id) ).length>0?JSON.parse( Storage.getFormStorage(ele.id) ):[]
                        })

            }else if( ele.prop('type') === 'node.Condition' ){//条件指令

                this.setState({ conditionMode: 1,
                            conditionId:ele.id,
                            conditionList:JSON.parse( Storage.getFormStorage(ele.id) ) && JSON.parse( Storage.getFormStorage(ele.id) ).length>0?JSON.parse( Storage.getFormStorage(ele.id) ):[]
                        })

            }else if(ele.prop('type') === 'node.Station'){//选择工位时，要跳转设计流程

                window.open('./workflow?id='+ele.id);
                
            }
        },
        onSubmit: e => {}
    }

    render() {
        const {
            descriptors,
            workspaceRef,
            isShowAttrs,
            selectedItem,
            conditionMode,
            data,
            mode,
            aInInfList,
            outInfList,
            aOutInfList,
            inInfList
        } = this.state
        return (
            <div className="workflow-page">
                <div className="component-slider">
                    <Slider workspaceRef={workspaceRef} descriptors={descriptors} />
                </div>
                <Workspace
                    id={ this.id }
                    ref="myWorkspace"
                    saveData={this.state.saveData}
                    /*targetMarker->连线是否加箭头*/
                    options={{ targetArraw: true,targetMarker:true }}
                />

                {/* 属性面板 */}
                {isShowAttrs ? (
                    <div className="attribute-slider">
                        <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon
                                type="setting"
                                style={{ color: '#5B77D9', fontSize: '22px' }}
                            />
                            <span className="attr-title">属性面板</span>
                            </div>
                        }
                        bodyStyle={{ padding: 0 }}
                        className="attribute-con"
                        >
                        <AttrContent
                            workspaceRef={workspaceRef}
                            descriptors={descriptors}
                            selectedItem={selectedItem}
                            // onChange={(e, changedValues, allValues) => {
                            //   console.log('onchange------e', changedValues, allValues)
                            // }}
                        />
                        </Card>
                    </div>
                ) : (
                ''
                )}
                
                <ModalAction
                    title="动作指令"
                    visible={!!mode}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({ 
                            mode: 0,
                         })
                    }}
                    onSubmit={this.handlers.onSubmit}
                    defaultData={data}
                    actionId={ this.state.actionId }
                    axisList={this.state.axisList}
                    outInfList={this.state.outInfList}
                    actionList={this.state.actionList}
                    />
                
                <ModalCondition
                    title="条件指令"
                    visible={!!conditionMode}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({ conditionMode: 0 })
                    }}
                    conditionId={ this.state.conditionId }
                    onSubmit={this.handlers.onSubmit}
                    conditionList={this.state.conditionList}
                    paramList={this.state.paramList}
                    infList={ {aInInfList,outInfList,aOutInfList,inInfList } }
                />
                
            </div>
        )
    }
}
export default Index
