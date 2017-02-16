var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    ReceiveInterface = require('./receive-interface'),
    _ = require('underscore');

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


// TODO: randomization
var receivingExamples = [
  {'id': '3a', examples: [{polarity: 'positive', string: 'aaa'},
                          {polarity: 'negative', string: 'aa'},
                          {polarity: 'positive', string: 'aaaa'}
                         ],
   questions: ['aaaa',
               'a',
               'AAA',
               'aaab'
              ]
  },
  {'id': 'delimiters', examples: [{polarity: 'positive', string: '[abc]'},
                                  {polarity: 'negative', string: '[abc'},
                                  {polarity: 'negative', string: 'abc]'},
                                  {polarity: 'positive', string: '[xyz]'},
                                  {polarity: 'positive', string: '[koe]'},
                                  {polarity: 'positive', string: '[jue'}],
   questions: ['[xyzsf]',
               '(xyzsf)',
               '[091235]',
               '[gsg31',
               '[[ve#!N2]]',
               'sd21p03'
              ]
  }
];

var receive = bound({
  inputs: receivingExamples,
  outputs: [],
  trial: function(input) {
    var comp = React.createElement(
      ReceiveInterface,
      {examples: input.examples,
       questions: input.questions,
       after: function(output) {
         receive.outputs.push(output);
         ReactDOM.unmountComponentAtNode($('.examples-editor-container')[0]);

         if (receive.outputs.length == receive.inputs.length) {
           $('#interstitial p').text('Now, just fill out a brief questionnaire and the task will be finished.')
         }
         $('#interstitial button').one('click', receive.next)
         showSlide('interstitial');

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
    fingerprint: window.fingerprint,
    questionnaire: _.pick(questionnaire, 'outputs')
  };

  results.receive = receive.outputs;

  global.results = results;

  setTimeout(function() { submitter(results) }, 2000);
}

// flow of experiment

$('#intro button.next').one('click', receive.next)

receive.after = questionnaire.start;

questionnaire.after = finishExperiment;

// debugging (example URL: index.html?debug#questionnaire)

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

// fingerprinting
// ------------------------------

window.fingerprint = {};

// conservatively, just get the IP (should always work, as long as web.stanford.edu doesn't go down)
function setIp(ip) {
  console.log('set ip');
  window.fingerprint.ip = ip;

  // now, try to get more detailed geolocation info (will work if freegeoip is up and we haven't hit their limit)
  var isLocal = /file/.test(location.protocol);
  var protocol = isLocal ? "http://" : "//";

  var scriptEl = document.createElement('script');
  var src = protocol + "web.stanford.edu/~louyang/cgi-bin/locate.php?callback=setGeo";
  scriptEl.src = src;

  document.body.appendChild(scriptEl);
}

window.setIp = setIp;

// try to get geo-located data
function setGeo(data) {
  console.log('set geo');
  window.fingerprint.ip = data.ip;
  window.fingerprint.geo = data;
}

window.setGeo = setGeo;


(function() {

  var ua = navigator.userAgent,
      browser = typeof bowser !== 'undefined' ? bowser._detect(ua) : ua;

  var plugins = Array.prototype.slice.call(navigator.plugins).map(
    function(x) {
      return {filename: x.filename, description: x.description}
    });

  window.fingerprint = {
    browser: browser,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    ip: "",
    geo: "",
    timezone: new Date().getTimezoneOffset(),
    plugins: plugins
  }

  var isLocal = /file/.test(location.protocol);

  // inject a call to a json service that will give us geolocation information
  var scriptEl = document.createElement('script');
  var protocol = isLocal ? "http://" : "//";
  var src = protocol + "web.stanford.edu/~louyang/cgi-bin/locate2.php?callback=setIp";
  scriptEl.src = src;


  document.body.appendChild(scriptEl);

})()
