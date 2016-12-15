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


var sendingRules = [
  //{'id': '1q', description: "The string contains only <code>q</code>'s and has at least one of them"},
  {'id': '3a', description: "The string contains only <code>a</code>'s and has at least three of them"},
  {'id': 'zip-code', description: "The string must be a valid US zip code (contains exactly 5 numbers)"},
  {'id': 'consonants-only', description: "The string contains only consonants"},
  {'id': 'delimiters', description: 'The string must begin with <code>[</code> and end with <code>]</code>'}
];

var send = bound({
  inputs: sendingRules,
  outputs: [],
  trial: function(input) {
    var comp = React.createElement(
      ExamplesEditor,
      {rule: input,
       after: function(output) {
         send.outputs.push(output);
         ReactDOM.unmountComponentAtNode($('.examples-editor-container')[0]);
         send.next();
       }});

    ReactDOM.render(comp, $('.examples-editor-container')[0], function() {
      showSlide('give-examples')
    })

  },
  next: function() {
    var i = this.outputs.length;
    var n = this.inputs.length;

    if (i == send.inputs.length) {
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

  // clean up send results
  results.send = _.map(
    send.outputs,
    function(x,i) {
      return _.extend({},
                      // add rule info
                      send.inputs[i],
                      // ditch reveal info, munge into data frame
                      {examples: _.values(_.omit(x, 'revealRule', 'revealInterface'))}) })

  global.results = results;

  setTimeout(function() { submitter(results) }, 2000);
}

// flow of experiment

$('#intro button.next').one('click', send.next)

send.after = questionnaire.start;

questionnaire.after = finishExperiment;

// debugging (example URL: index.html?debug#questionnaire)

if (/localhost/.test(global.location.host) || /\?debug/.test(global.location.href)) {
  pollute(['React', 'ReactDOM', '$', '_', 'showSlide',
           'send','questionnaire',
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
