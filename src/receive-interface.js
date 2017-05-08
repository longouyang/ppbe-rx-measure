var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore'),
    scrollIntoViewIfNeeded = require('scroll-into-view-if-needed');

var ReceivedExample = React.createClass({
  render: function() {
    var matchString = this.props.polarity == 'positive' ? 'fits' : 'doesn\'t fit';
    var matchIconText = this.props.polarity == 'positive' ? '✔' : '✘';
    var matchIconClass = 'matchIcon ' + (this.props.polarity);

    var revealed = this.props.revealed;

    if (!revealed || revealed == 'on-deck') {
      var isDisabled = !revealed;
      return (<button disabled={isDisabled} onClick={this.props.revealNext} >Click to show example</button>)
    } else {
        return (<div>The string <code>{this.props.string}</code> {matchString} <span className={matchIconClass}>{matchIconText}</span></div>)
    }
  }
});

// props: examples, after (a callback)
// state: numRevealed, nextButtonClicked
var ReceivingList = React.createClass({
  getInitialState: function() {
    return {numRevealed: 0, nextButtonClicked: false}
  },
  after: function() {
    this.setState({nextButtonClicked: true}, this.props.after)
  },
  revealExample: function() {
    this.setState({numRevealed: this.state.numRevealed + 1})
  },
  render: function() {
    var comp = this, state = comp.state, props = comp.props;
    var listObj = _.map(props.examples,
                        function(ex, i) {
                          // revealed can be true, false, or "on-deck"
                          var revealed = (i < state.numRevealed);
                          if (i == state.numRevealed) {
                            revealed = 'on-deck'
                          }
                          return (<li key={i}><ReceivedExample polarity={ex.polarity} string={ex.string} revealed={revealed} revealNext={comp.revealExample} /></li>)
                        }),
        list = _.values(listObj);

    var nextButton = ((state.numRevealed == props.examples.length && !state.nextButtonClicked)
                      ? (<button onClick={comp.after}>Next</button>)
                      : (<span></span>));

    return (<div>
            <ol className='received-examples-list'>{list}</ol>
            {nextButton}
            </div>)
  }
});


// props: questions (an array of strings), after (callback)
// state: show (true, false), nextButtonClicked
var GeneralizationQuestions = React.createClass({
  getInitialState: function() {
    return {show: false, actions: [], nextButtonClicked: false}
  },
  show: function() {
    this.setState({show: true})
  },
  // get the current set of responses
  getResponses: function() {
    var comp = this,
        actions = comp.state.actions;
    return this.props.questions.map(function(q) {
      return _.findWhere(actions, {string: q}) || false
    });
  },
  finish: function() {
    this.setState({nextButtonClicked: true},
                  function() {
                    var history = this.getResponses()
                    this.props.after()
                  });
  },
  scroll: function() {
    scrollIntoViewIfNeeded(ReactDOM.findDOMNode(this), false, {duration: 240});
  },
  render: function() {
    var comp = this,
        state = comp.state,
        show = state.show;

    if (!show) {
      return (<div className='generalization-questions'></div>)
    } else {

      var doesnt = "doesn't";
      var questions = comp.props.questions.map(function(question, i) {
        var inputName = "polarity_" + question;


        var updatePolarity = function(e) {
          var polarity = e.target.value;
          comp.setState({actions:
                         [{time: _.now(), string: question, polarity: polarity}].concat(comp.state.actions)
                        })
        }

        return (<tr key={question}>
                <td><code>{question}</code></td>
                <td><center><input type="radio" name={inputName} value="positive" onChange={updatePolarity} /></center></td>
                <td><center><input type="radio" name={inputName} value="negative" onChange={updatePolarity} /></center></td>
                </tr>)
      });

      var Doesnt = "Doesn't";

      var allQuestionsAnswered = _.filter(comp.getResponses()).length == questions.length,
          nextButton = ((allQuestionsAnswered && !state.nextButtonClicked)
                        ? (<button onClick={comp.finish}>Next</button>)
                        : (<span></span>));

      setTimeout(comp.scroll, 0);

      return (<div className='generalization-questions'>
              <p>Now, based on your best guess about what the rule is, judge whether these other strings match the rule:</p>
              <table>
              <thead>
              <tr><th>String</th>
              <th>Matches</th>
              <th>{Doesnt} match</th>
              </tr>
              </thead>
              <tbody>
              {questions}
              </tbody>
              </table>
              {nextButton}
              </div>);
    }
  }
})

// props: after (a callback)
// state: show (boolean), value
var GlossQuestion = React.createClass({
  getInitialState: function() {
    return {show: false, value: '', finished: false}
  },
  handleChange(event) {
    this.setState({value: event.target.value});
  },
  finish: function() {
    this.setState({finished: true});
    this.props.after(this.state.value)
  },
  scroll: function() {
    scrollIntoViewIfNeeded(ReactDOM.findDOMNode(this));
  },
  componentDidMount: function() {
    this.scroll()
  },
  componentDidUpdate: function() {
    this.scroll()
  },
  render: function() {
    if (!this.state.show) {
      return (<div></div>)
    } else {
      var emptyText = this.state.value.length == 0,
      buttonDisabled = emptyText,
          buttonText = 'Next';

      var nextButton = this.state.finished
          ? (<span></span>)
          : (<button disabled={buttonDisabled} onClick={this.finish}>{buttonText}</button>);

      return (<div className='gloss-question'>
              <p>Can you describe in words what you think the rule is? Try to explain it clearly enough so that a child could understand.</p>
              <textarea value={this.state.value} onChange={this.handleChange} rows="4" cols="60"></textarea>
              {nextButton}
              </div>)
    }
  }
})

// props:
// - examples (an array of examples, i.e., objects with string and polarity properties)
// - questions (a list of generalization strings for the user to classify)
// - after (a callback)
var ReceiveInterface = React.createClass({
  getInitialState: function() {
    return {showGeneralization: false}
  },
  afterReceive: function() { // show generalization
    // this.refs.generalization.setState({show: true});
    this.refs.gloss.setState({show: true})
  },
  afterGeneralization: function() { // show gloss
    // this.refs.gloss.setState({show: true})
    // this.refs.generalization.setState({show: true});

    var gen = this.refs.generalization;

    this.props.after({
      gloss: this.refs.gloss.state.value,
      generalization: gen.getResponses(),
      generalizationHistory: gen.state.actions
    })
  },
  afterGloss: function() { // invoke this.props.after callback
    this.refs.generalization.setState({show: true});

    var gen = this.refs.generalization;
  },
  render: function() {
    var comp = this;

    var coverStory = (<div className='cover-story'>There is a certain rule for strings. We showed another Mechanical Turk worker the rule and asked them to help you learn the rule by making examples of strings that either fit or don’t fit the rule. Here are the examples they made:</div>);

    return (<div className='examplesEditor'>
            {coverStory}
            <ReceivingList examples={this.props.examples} after={this.afterReceive} />
            <GlossQuestion ref='gloss' after={this.afterGloss} />
            <GeneralizationQuestions ref='generalization' questions={this.props.questions} after={this.afterGeneralization} />
            </div>)
    }

});

module.exports = ReceiveInterface;
