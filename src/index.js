var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore'),
    ExamplesEditor = require('./examples-editor');

global.React = React;
global.$ = $;
global._ = _;

function showSlide(id) {
  var current = '#' + id;
  var others = '.slide:not(' + current + ')';
  $(others).removeClass('show');
  $(current).addClass('show');
}

global.showSlide = showSlide;


var rules = [
  {'id': '1q', description: "The string contains only <code>q</code>'s and has at least one of them"},
  {'id': '3a', description: "The string contains only <code>a</code>'s and has at least three of them"}
]

function trial(rule) {

  var comp = React.createElement(ExamplesEditor, {rule: rule});

  ReactDOM.render(comp, $('#give-examples')[0], function() {
    showSlide('give-examples')
  })

}

setTimeout(function() {
  trial(rules[0])
}, 2000)
