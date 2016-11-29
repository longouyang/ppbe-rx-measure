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
  {'id': 'consonants-only', description: "The string contains only consonants"},
  {'id': 'delimiters', description: 'The string must begin with <code>[</code> and end with <code>]</code>'}
];

var receive = bound({
  inputs: receivingRules,
  outputs: [],
  trial: function(input) {
    var comp = React.createElement(
      ExamplesEditor,
      {rule: input,
       after: function(output) {
         receive.outputs.push(output);
         ReactDOM.unmountComponentAtNode($('.examples-editor-container')[0]);
         receive.next();
       }});

    ReactDOM.render(comp, $('.examples-editor-container')[0], function() {
      showSlide('give-examples')
    })

  },
  next: function() {
    var i = this.outputs.length;
    var n = this.inputs.length;

    if (i == receive.inputs.length) {
      this.after(this)
    } else {
      // advance progress indicator
      $('#give-examples .progress span').text('Completed: ' + i + '/' + n)

      $('#give-examples .progress .completed').css({
        width: Math.round(100 * i / n) + '%'
      })

      this.trial(this.inputs[i]);
    }
  },
  start: function() {
    this.next()
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
 questionnaire.validator = $("#q").validate({submitHandler: questionnaire.submit});
})

function submitter(results) {
  var opener = global.opener;
  (opener ? opener : window).turk.submit(results, true);

  if (opener) {
    setTimeout(window.close, 250);
  }
}

function finishExperiment() {
  showSlide('submitting-results')


  var results = {
    questionnaire: _.pick(questionnaire, 'outputs')
  };

  // clean up receive results
  results.receive = _.map(
    receive.outputs,
    function(x,i) {
      return _.extend({},
                      // add rule info
                      receive.inputs[i],
                      // ditch reveal info, munge into data frame
                      {examples: _.values(_.omit(x, 'revealRule', 'revealInterface'))}) })

  global.results = results;

  setTimeout(function() { submitter(results) }, 2000);
}

// flow of experiment

$('#intro button.next').one('click', receive.next)

receive.after = questionnaire.start;

questionnaire.after = finishExperiment;

// debugging:
// example URL: index.html?debug#questionnaire

if (/localhost/.test(global.location.host) || /\?debug/.test(global.location.href)) {
  pollute(['React', 'ReactDOM', '$', '_', 'showSlide',
           'receive','questionnaire',
           'finishExperiment'])

  function handleHash(e) {
    var key = global.location.hash.replace("#","");
    var obj = eval(key);
    if (obj && _.has(obj, 'start')) {
      obj.start()
    }
  }

  global.onhashchange = handleHash;

  if (global.location.hash) {
    handleHash();
  }
}
