/**
* @jsx React.DOM
*/

var React = require('react'),
Detector = require('./third-party/Detector.js'),
TWEEN = require('./third-party/Tween.js'),
DAT = require('./globe.js');

var WebGLGlobe = React.createClass({
  render: function() {
    return (
      <div>
      <div className="container" ref="container"></div>

      <div id="info">
      <strong><a href="http://www.chromeexperiments.com/globe">WebGL Globe</a></strong> <span className="bull">&bull;</span> Created by the Google Data Arts Team <span className="bull">&bull;</span> Data acquired from <a href="http://sedac.ciesin.columbia.edu/gpw/">SEDAC</a>
      </div>

      <div id="currentInfo">
      <span ref="year1990" className="year">1990</span>
      <span ref="year1995" className="year">1995</span>
      <span ref="year2000" className="year">2000</span>
      </div>

      <div id="title">
      World Population
      </div>

      <a id="ce" href="http://www.chromeexperiments.com/globe">
      <span>This is a Chrome Experiment</span>
      </a>

      </div>
    );
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  componentDidMount: function() {
    var container = this.refs.container.getDOMNode();
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {

      var years = ['1990','1995','2000'];
      // var container = document.getElementById('container');

      var opts = {imgDir: 'assets/'};
      var globe = new DAT.Globe(container, opts);
      var i, tweens = [];

      var settime = function(globe, t) {
        return function() {
          new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
          var y = this.refs[('year'+years[t])].getDOMNode();
          if (y.getAttribute('class') === 'year active') {
            return;
          }
          var yy = document.getElementsByClassName('year');
          for(i=0; i<yy.length; i++) {i
            yy[i].setAttribute('class','year');
          }
          y.setAttribute('class', 'year active');
        };
      };

      for(var i = 0; i<years.length; i++) {
        var y = this.refs[('year'+years[i])].getDOMNode();
        y.addEventListener('mouseover', settime(globe,i), false);
      }

      var xhr;
      TWEEN.start();


      xhr = new XMLHttpRequest();
      xhr.open('GET', 'assets/population909500.json', true);
      var onreadystatechangecallback = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            window.data = data;
            for (i=0;i<data.length;i++) {
              globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
            }
            globe.createPoints();
            (settime(globe,0).bind(this))();
            globe.animate();
            document.body.style.backgroundImage = 'none'; // remove loading
          }
        }
      };
      xhr.onreadystatechange = onreadystatechangecallback.bind(this);
      xhr.send(null);
    }

  }

});

module.exports = WebGLGlobe;
