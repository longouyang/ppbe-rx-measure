var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore'),
    ExamplesEditor = require('./examples-editor');

global.React = React;
global.$ = $;
global._ = _;

function bound(obj) {
  _.each(_.methods(obj), function(name) {
    var method = obj[name];
    obj[name] = _.bind(method, obj);
  })
  return obj;
}

function showSlide(id) {
  var current = '#' + id;
  var others = '.slide:not(' + current + ')';
  $(others).removeClass('show');
  $(current).addClass('show');
}

global.showSlide = showSlide;


var receivingRules = [
  {'id': '1q', description: "The string contains only <code>q</code>'s and has at least one of them"},
  {'id': '3a', description: "The string contains only <code>a</code>'s and has at least three of them"}
];

var receiving = bound({
  inputs: receivingRules,
  outputs: [],
  trial: function(input) {
    var comp = React.createElement(ExamplesEditor,
                                   {rule: input, after: function(output) {
                                     receiving.outputs.push(output)
                                     receiving.next();
                                   }});

    ReactDOM.render(comp, $('.examples-editor-container')[0], function() {
      showSlide('give-examples')
    })

  },
  next: function() {
    var i = receiving.outputs.length;
    var n = receiving.inputs.length;

    if (i == receiving.inputs.length) {
      receiving.after(receiving)
    } else {
      // advance progress indicator
      $('#give-examples .progress span').text('Completed: ' + i + '/' + n)

      $('#give-examples .progress .completed').css({
        width: Math.round(100 * i / n) + '%'
      })

      receiving.trial(receiving.inputs[i]);
    }
  }
});
global.receiving = receiving;


// flow of experiment

$('#intro button.next').one('click', receiving.next)

receiving.after = function() { showSlide('demographics') }
