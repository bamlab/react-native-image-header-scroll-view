Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');





var _lodash=require('lodash');var _lodash2=_interopRequireDefault(_lodash);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var SCROLLVIEW_REF='ScrollView';

var styles=_reactNative.StyleSheet.create({
container:{
flex:1},

header:{
position:'absolute',
top:0,
left:0,
right:0,
overflow:'hidden'},

headerChildren:{
backgroundColor:'transparent',
justifyContent:'center'},

overlay:{
position:'absolute',
top:0,
right:0,
left:0,
bottom:0,
zIndex:100},

fixedForeground:{
position:'absolute',
top:0,
right:0,
left:0,
bottom:0,
zIndex:101}});var




ImageHeaderScrollView=function(_Component){_inherits(ImageHeaderScrollView,_Component);
function ImageHeaderScrollView(props){_classCallCheck(this,ImageHeaderScrollView);var _this=_possibleConstructorReturn(this,(ImageHeaderScrollView.__proto__||Object.getPrototypeOf(ImageHeaderScrollView)).call(this,
props));
_this.state={
scrollY:new _reactNative.Animated.Value(0),
pageY:0};return _this;

}_createClass(ImageHeaderScrollView,[{key:'getChildContext',value:function getChildContext()

{
return{
scrollY:this.state.scrollY,
scrollPageY:this.state.pageY+this.props.minHeight};

}},{key:'getScrollResponder',value:function getScrollResponder()





{
return this[SCROLLVIEW_REF].getScrollResponder();
}},{key:'getScrollableNode',value:function getScrollableNode()
{
return this.getScrollResponder().getScrollableNode();
}},{key:'getInnerViewNode',value:function getInnerViewNode()
{
return this.getScrollResponder().getInnerViewNode();
}},{key:'setNativeProps',value:function setNativeProps(
props){
this[SCROLLVIEW_REF].setNativeProps(props);
}},{key:'scrollTo',value:function scrollTo()
{var _getScrollResponder;
(_getScrollResponder=this.getScrollResponder()).scrollTo.apply(_getScrollResponder,arguments);
}},{key:'interpolateOnImageHeight',value:function interpolateOnImageHeight(

outputRange){
var headerScrollDistance=this.props.maxHeight-this.props.minHeight;
return this.state.scrollY.interpolate({
inputRange:[0,headerScrollDistance],
outputRange:outputRange,
extrapolate:'clamp'});

}},{key:'renderHeader',value:function renderHeader()

{
var overlayOpacity=this.interpolateOnImageHeight([
this.props.minOverlayOpacity,
this.props.maxOverlayOpacity]);


var headerScale=this.state.scrollY.interpolate({
inputRange:[-this.props.maxHeight,0],
outputRange:[3,1],
extrapolate:'clamp'});


var headerTransformStyle={
height:this.props.maxHeight,
transform:[{scale:headerScale}]};


var overlayStyle=[
styles.overlay,
{opacity:overlayOpacity,backgroundColor:this.props.overlayColor}];


return(
_react2.default.createElement(_reactNative.Animated.View,{style:[styles.header,headerTransformStyle]},
_react2.default.createElement(_reactNative.Animated.View,{style:overlayStyle}),
_react2.default.createElement(_reactNative.View,{style:styles.fixedForeground},
this.props.renderFixedForeground(this.state.scrollY)),

this.props.renderHeader(this.state.scrollY)));


}},{key:'renderForeground',value:function renderForeground()

{
var headerTranslate=this.state.scrollY.interpolate({
inputRange:[0,this.props.maxHeight*2],
outputRange:[0,-this.props.maxHeight*2*this.props.foregroundParallaxRatio],
extrapolate:'clamp'});

var opacity=this.interpolateOnImageHeight([1,-0.3]);

var headerTransformStyle={
height:this.props.maxHeight,
transform:[{translateY:headerTranslate}],
opacity:this.props.fadeOutForeground?opacity:1};

return(
_react2.default.createElement(_reactNative.Animated.View,{style:[styles.header,headerTransformStyle]},
this.props.renderForeground()));


}},{key:'render',value:function render()

{var _this2=this;
var scrollViewProps=_lodash2.default.pick(this.props,_lodash2.default.keys(_reactNative.ScrollView.propTypes));

var headerScrollDistance=this.interpolateOnImageHeight([
this.props.maxHeight,
this.props.maxHeight-this.props.minHeight]);

var topMargin=this.interpolateOnImageHeight([0,this.props.minHeight]);

var childrenContainerStyle=_reactNative.StyleSheet.flatten([
{transform:[{translateY:headerScrollDistance}]},
{backgroundColor:'white',paddingBottom:this.props.maxHeight},
this.props.childrenStyle]);


return(
_react2.default.createElement(_reactNative.View,{
style:styles.container,
ref:function ref(_ref2){_this2.container=_ref2;},
onLayout:function onLayout(){return _this2.container.measureInWindow(function(x,y){return _this2.setState({pageY:y});});}},

this.renderHeader(),
_react2.default.createElement(_reactNative.Animated.View,{style:[styles.container,{transform:[{translateY:topMargin}]}]},
_react2.default.createElement(_reactNative.ScrollView,_extends({
ref:function ref(_ref){_this2[SCROLLVIEW_REF]=_ref;},
style:styles.container,
scrollEventThrottle:16,
onScroll:_reactNative.Animated.event(
[{nativeEvent:{contentOffset:{y:this.state.scrollY}}}])},

scrollViewProps),

_react2.default.createElement(_reactNative.Animated.View,{style:childrenContainerStyle},
this.props.children)),


this.renderForeground())));



}}]);return ImageHeaderScrollView;}(_react.Component);


ImageHeaderScrollView.propTypes=_extends({
children:_react2.default.PropTypes.node||_react2.default.PropTypes.nodes,
childrenStyle:_reactNative.View.propTypes.style,
overlayColor:_react2.default.PropTypes.string,
fadeOutForeground:_react2.default.PropTypes.bool,
foregroundParallaxRatio:_react2.default.PropTypes.number,
maxHeight:_react2.default.PropTypes.number,
maxOverlayOpacity:_react2.default.PropTypes.number,
minHeight:_react2.default.PropTypes.number,
minOverlayOpacity:_react2.default.PropTypes.number,
renderFixedForeground:_react2.default.PropTypes.func,
renderForeground:_react2.default.PropTypes.func,
renderHeader:_react2.default.PropTypes.func},
_reactNative.ScrollView.propTypes);


ImageHeaderScrollView.defaultProps={
overlayColor:'black',
fadeOutForeground:false,
foregroundParallaxRatio:1,
maxHeight:125,
maxOverlayOpacity:0.3,
minHeight:80,
minOverlayOpacity:0,
renderFixedForeground:function renderFixedForeground(){return _react2.default.createElement(_reactNative.View,null);},
renderForeground:function renderForeground(){return _react2.default.createElement(_reactNative.View,null);},
renderHeader:function renderHeader(){return _react2.default.createElement(_reactNative.View,null);}};


ImageHeaderScrollView.childContextTypes={
scrollY:_react2.default.PropTypes.instanceOf(_reactNative.Animated.Value),
scrollPageY:_react2.default.PropTypes.number};exports.default=


ImageHeaderScrollView;