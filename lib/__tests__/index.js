var _react=require('react');var _react2=_interopRequireDefault(_react);
require('react-native');
var _reactTestRenderer=require('react-test-renderer');var _reactTestRenderer2=_interopRequireDefault(_reactTestRenderer);
var _index=require('../index.js');var _index2=_interopRequireDefault(_index);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

describe('ImageHeaderScrollView',function(){
it('renders correctly by default',function(){
var tree=_reactTestRenderer2.default.create(
_react2.default.createElement(_index2.default,null)).
toJSON();
expect(tree).toMatchSnapshot();
});
});