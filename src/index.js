var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore'),
    ExamplesEditor = require('./examples-editor');

global.jQuery = $; // for form validation library

function pollute(names) {
  _.each(names, function(name) {
    global[name] = eval(name);
  })
}


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


var receivingRules = [
  //{'id': '1q', description: "The string contains only <code>q</code>'s and has at least one of them"},
  {'id': '3a', description: "The string contains only <code>a</code>'s and has at least three of them"},
  {'id': 'zip-code', description: "The string must be a valid US zip code (contains exactly 5 numbers)"},
  {'id': 'consonants-only', description: "The string must contain all consonants"},
  {'id': 'delimiters', description: 'The string must begin with <code>[</code> and end with <code>]</code>'}
];

var receiving = bound({
  inputs: receivingRules,
  outputs: [],
  trial: function(input) {
    var comp = React.createElement(
      ExamplesEditor,
      {rule: input,
       after: function(output) {
         receiving.outputs.push(output);
         ReactDOM.unmountComponentAtNode($('.examples-editor-container')[0]);
         receiving.next();
       }});

    ReactDOM.render(comp, $('.examples-editor-container')[0], function() {
      showSlide('give-examples')
    })

  },
  next: function() {
    var i = this.outputs.length;
    var n = this.inputs.length;

    if (i == receiving.inputs.length) {
      this.after(this)
    } else {
      // advance progress indicator
      $('#give-examples .progress span').text('Completed: ' + i + '/' + n)

      $('#give-examples .progress .completed').css({
        width: Math.round(100 * i / n) + '%'
      })

      this.trial(this.inputs[i]);
    }
  }
});



var questionnaire = {
  start: function() {
    showSlide('questionnaire')
  },
  outputs: {},
  submit: function() {
    $('#q textarea, #q :checked').each(function(i,x) {
      var key = x.name.replace("q_",""), val = $(x).val();
      questionnaire.outputs[key] = val
    });

    questionnaire.after()
  }
}

$(global.document).ready(function() {
  var questionnaireValidator = $("#q").validate({submitHandler: questionnaire.submit});
})


function finishExperiment() {
  showSlide('submitting-results')

  var results = {
    receiving: receiving.outputs,
    questionnaire: questionnaire.outputs
  };

  setTimeout(function() { turk.submit(results) }, 2000);
}

// flow of experiment

$('#intro button.next').one('click', receiving.next)

receiving.after = questionnaire.start;

questionnaire.after = finishExperiment;

// debugging
pollute(['React', 'ReactDOM', '$', '_', 'showSlide',
         'receiving','questionnaire',
         'finishExperiment'])
