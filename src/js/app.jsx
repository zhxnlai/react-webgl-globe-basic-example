/**
* @jsx React.DOM
*/
(function () {

  var React = require('react');
  var WebGLGlobe = require('./globe/webgl-globe.jsx');
  //Needed for React Developer Tools
  window.React = React;

  //Render the main app component
  var App = React.createClass({
    render: function() {
      return <WebGLGlobe />;
    }
  });
  React.render(<App/>, document.body);

})();
