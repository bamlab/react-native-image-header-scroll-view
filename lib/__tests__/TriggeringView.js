var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');
var _reactTestRenderer=require('react-test-renderer');var _reactTestRenderer2=_interopRequireDefault(_reactTestRenderer);
var _index=require('../index.js');var _index2=_interopRequireDefault(_index);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

describe('TriggeringView',function(){
it('renders correctly by default',function(){
var tree=_reactTestRenderer2.default.create(
_react2.default.createElement(_index2.default,null,
_react2.default.createElement(_index.TriggeringView,null))).

toJSON();
expect(tree).toMatchSnapshot();
});

it('should dont\'t crash without ImageHeaderScrollView',function(){
var tree=_reactTestRenderer2.default.create(
_react2.default.createElement(_index.TriggeringView,null)).
toJSON();
expect(tree).toMatchSnapshot();
});

it('should display children',function(){
var tree=_reactTestRenderer2.default.create(
_react2.default.createElement(_index.TriggeringView,null,
_react2.default.createElement(_reactNative.Text,null,' Hello world '))).

toJSON();
expect(tree).toMatchSnapshot();
});
});