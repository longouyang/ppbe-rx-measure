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




var ruleData = {
  '3a': {
    generalizationQuestions: ['beravj',
                              'aaaa',
                              '@#$23g',
                              'bbb',
                              'eee',
                              'a',
                              'b93kgw;_mfo',
                              'alpaca',
                              'AAA',
                              'aaab',
                              'DASASA',
                              'aaaaaaaaaaaaaa',
                              '9aaaaaa',
                              'AAAAA'],
    exampleSequences: {
      '85357a3':[{polarity: 'negative', string: 'a'},
                 {polarity: 'negative', string: 'aa'},
                 {polarity: 'positive', string: 'aaa'},
                 {polarity: 'positive', string: 'aaaa'},
                 {polarity: 'positive', string: 'aaaaa'},
                 {polarity: 'positive', string: 'aaaaaa'},
                 {polarity: 'positive', string: 'aaaaaaa'},
                 {polarity: 'positive', string: 'aaaaaaaaaa'}],

      '13d1cf2':[{polarity: 'positive', string: 'aaa'},
                 {polarity: 'positive', string: 'aaaa'},
                 {polarity: 'positive', string: 'aaaaa'},
                 {polarity: 'negative', string: 'aab'},
                 {polarity: 'negative', string: 'aaba'},
                 {polarity: 'negative', string: 'bcdef'}],

      'e91432b':[{polarity: 'positive', string: 'aaa'},
                 {polarity: 'negative', string: 'aca'},
                 {polarity: 'negative', string: 'a33'},
                 {polarity: 'negative', string: 'fds'},
                 {polarity: 'positive', string: 'aaaaaaaaaaaa'}]}
  },
  'zip-code': {
    generalizationQuestions: ['11111',
                              '13708',
                              '236778',
                              'hg4567s',
                              '-12541',
                              '9076.2',
                              'nfas10583vns',
                              '238',
                              'erqew',
                              '122555',
                              'dskfjlmxF',
                              '==DFG$!'
                             ],
    exampleSequences: {
      '07e8a36':[{polarity: 'positive', string: '12345'},
                 {polarity: 'negative', string: '1234'},
                 {polarity: 'negative', string: '123'},
                 {polarity: 'negative', string: '12'},
                 {polarity: 'negative', string: '123456'}],

      '6113a67':[{polarity: 'positive', string: '12345'},
                 {polarity: 'negative', string: '1234'},
                 {polarity: 'negative', string: '123456'}],

      '08af176':[{polarity: 'positive', string: '12344'},
                 {polarity: 'negative', string: '4k3kk'},
                 {polarity: 'negative', string: 'kkkkk'}],

      '51aa397':[{polarity: 'positive', string: '13685'},
                 {polarity: 'positive', string: '99999'},
                 {polarity: 'negative', string: 'AB67D'},
                 {polarity: 'positive', string: '68392'},
                 {polarity: 'negative', string: 'AGDUL'}],

      '37bd336':[{polarity: 'positive', string: '12345'},
                 {polarity: 'negative', string: '1234a'}]
    }
  },
  'consonants-only': {
    generalizationQuestions: ['xvmp',
                              'qqqqqw',
                              'dgrel',
                              'SDFBWv',
                              '6fdsb',
                              'ZPtngf',
                              'ktl938',
                              'agcht',
                              'uz',
                              'qfqfqfqf',
                              'poeuuae'
                             ],
    exampleSequences: {
      '08af176':[{polarity: 'negative', string: 'aeiou'},
                 {polarity: 'positive', string: 'ccccs'},
                 {polarity: 'positive', string: 'bkjnn'}],

      '112df88':[{polarity: 'positive', string: 'qwrty'},
                 {polarity: 'negative', string: 'aeiou'},
                 {polarity: 'negative', string: "12345=?*'"}],

      'f0cc52f':[{polarity: 'positive', string: 'tzg'},
                 {polarity: 'negative', string: 'teg'},
                 {polarity: 'negative', string: 'tag'},
                 {polarity: 'positive', string: 'jkl'},
                 {polarity: 'positive', string: 'plt'},
                 {polarity: 'negative', string: 'ukl'},
                 {polarity: 'negative', string: 'fet'},
                 {polarity: 'negative', string: 'abc'},
                 {polarity: 'positive', string: 'fgh'},
                 {polarity: 'negative', string: 'iou'}]
    }
  },
  'delimiters': {
    generalizationQuestions: ['xyzsf',
                              '[mna_8%234]',
                              '(fdfm3t)',
                              '{0thg1!@}',
                              'gnro[34r3]',
                              '[4939k4k3',
                              'xccg3]',
                              '[fbndofb]]',
                              'fjdjdjjttt6',
                              '[[qoo_w3]',
                              '!@T!3gas',
                              '[[[223768]]]'
                             ],
    exampleSequences: {
      '295bd50':[{polarity: 'positive', string: '[jh23]'},
                 {polarity: 'negative', string: 'jh23'},
                 {polarity: 'positive', string: '[4784]'},
                 {polarity: 'negative', string: '4784'}],

      '4bf1c95':[{polarity: 'positive', string: '[625458]'},
                 {polarity: 'negative', string: '{78779}'},
                 {polarity: 'negative', string: '[564564]'},
                 {polarity: 'negative', string: 'tfytry]'},
                 {polarity: 'negative', string: 'rtyrty5646'}
                ],
      'a4dd5fc':[{polarity: 'positive', string: '[56TGH]'},
                 {polarity: 'positive', string: '[DFRU76]'},
                 {polarity: 'positive', string: '[ASDF321]'},
                 {polarity: 'positive', string: '[NM734D]'}]
    }
  }
};


// TODO: randomization
var receivingExamples = _.map(ruleData,
                              function(entry,k) {

                                var seqs = entry.exampleSequences,
                                    seqId = _.sample(_.keys(seqs)),
                                    examples = seqs[seqId];

                                return {id: k,
                                        seqId: seqId,
                                        examples: examples,
                                        questions: entry.generalizationQuestions
                                       }
                              }
                             );


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
      $('#give-examples .progress span').text('Rules completed: ' + i + '/' + n)

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
