Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');
var _lodash=require('lodash');var _lodash2=_interopRequireDefault(_lodash);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var

TriggeringView=function(_Component){_inherits(TriggeringView,_Component);

function TriggeringView(props){_classCallCheck(this,TriggeringView);var _this=_possibleConstructorReturn(this,(TriggeringView.__proto__||Object.getPrototypeOf(TriggeringView)).call(this,
props));
_this.state={
touched:false,
hidden:false};

_this.initialPageY=0;
_this.onScroll=_this.onScroll.bind(_this);
_this.onRef=_this.onRef.bind(_this);
_this.onLayout=_this.onLayout.bind(_this);return _this;
}_createClass(TriggeringView,[{key:'componentWillMount',value:function componentWillMount()

{
if(!this.context.scrollY){
return;
}
this.listenerId=this.context.scrollY.addListener(this.onScroll);
}},{key:'componentWillReceiveProps',value:function componentWillReceiveProps(

nextProps,nextContext){
if(!this.context.scrollY){
return;
}
this.context.scrollY.removeListener(this.listenerId);
nextContext.scrollY.addListener(this.onScroll);
}},{key:'onRef',value:function onRef(

ref){
this.ref=ref;
}},{key:'onLayout',value:function onLayout(

e){var _this2=this;
var layout=e.nativeEvent.layout;
this.height=layout.height;
this.ref.measure(function(x,y,width,height,pageX,pageY){
_this2.initialPageY=pageY;
});
}},{key:'onScroll',value:function onScroll(

event){
var pageY=this.initialPageY-event.value;
this.triggerEvents(this.context.scrollPageY,pageY,pageY+this.height);
}},{key:'triggerEvents',value:function triggerEvents(

value,top,bottom){
if(!this.state.touched&&value>=top){
this.setState({touched:true});
this.props.onBeginHidden();
this.props.onTouchTop(true);
}else if(this.state.touched&&value<top){
this.setState({touched:false});
this.props.onDisplay();
this.props.onTouchTop(false);
}

if(!this.state.hidden&&value>=bottom){
this.setState({hidden:true});
this.props.onHide();
this.props.onTouchBottom(true);
}else if(this.state.hidden&&value<bottom){
this.setState({hidden:false});
this.props.onBeginDisplayed();
this.props.onTouchBottom(false);
}
}},{key:'render',value:function render()

{
var viewProps=_lodash2.default.pick(this.props,_lodash2.default.keys(_reactNative.View.propTypes));
return(
_react2.default.createElement(_reactNative.View,_extends({
ref:this.onRef,
onLayout:this.onLayout,
collapsable:false},
viewProps),

this.props.children));


}}]);return TriggeringView;}(_react.Component);

TriggeringView.propTypes=_extends({
onBeginHidden:_react2.default.PropTypes.func,
onHide:_react2.default.PropTypes.func,
onBeginDisplayed:_react2.default.PropTypes.func,
onDisplay:_react2.default.PropTypes.func,
onTouchTop:_react2.default.PropTypes.func,
onTouchBottom:_react2.default.PropTypes.func},
_reactNative.View.propTypes);


TriggeringView.defaultProps={
onBeginHidden:function onBeginHidden(){},
onHide:function onHide(){},
onBeginDisplayed:function onBeginDisplayed(){},
onDisplay:function onDisplay(){},
onTouchTop:function onTouchTop(){},
onTouchBottom:function onTouchBottom(){}};


TriggeringView.contextTypes={
scrollY:_react2.default.PropTypes.instanceOf(_reactNative.Animated.Value),
scrollPageY:_react2.default.PropTypes.number};exports.default=


TriggeringView;