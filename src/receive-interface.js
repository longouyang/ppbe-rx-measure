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

// props:
// - examples
// - onAllRevealed (a function)
var ReceivedExamplesList = React.createClass({
  getInitialState: function() {
    return {numRevealed: 0}
  },
  revealExample: function() {
    var comp = this;
    this.setState(function(oldState, props) {
      var numRevealed = oldState.numRevealed + 1;
      if (numRevealed == props.examples.length) {
        comp.props.onAllRevealed();
      }
      return {numRevealed: numRevealed};
    })
  },
  render: function() {
    var comp = this;
    var listObj = _.map(this.props.examples,
                        function(ex, i) {
                          // revealed can be true, false, or "on-deck"
                          var revealed = (i < comp.state.numRevealed);
                          if (i == comp.state.numRevealed) {
                            revealed = 'on-deck'
                          }
                          return (<li key={i}><ReceivedExample polarity={ex.polarity} string={ex.string} revealed={revealed} revealNext={comp.revealExample} /></li>)
                        }),
        list = _.values(listObj);

    return (<ol className='received-examples-list'>{list}</ol>)
  }
});


// props:
// - questions (an array of strings)
// - after (callback)
//
// state:
// - show (true, false, 'possible')
//
var GeneralizationQuestions = React.createClass({
  getInitialState: function() {
    return {show: false, actions: []}
  },
  show: function() {
    this.setState({nextButtonClicked: false, show: true})
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
        show = comp.state.show;

    if (!show) {
      return (<div className='generalization-questions'></div>)
    } else if (show == 'possible') {
      return (<div className='generalization-questions'><button onClick={comp.show}>Next</button></div>)
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
          finishButtonClass = allQuestionsAnswered ? (comp.state.nextButtonClicked ? 'invisible' : '') : 'invisible';

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
              <button className={finishButtonClass} onClick={comp.finish}>Next</button>
              </div>);
    }
  }
})

// props:
// - after (a callback)
var GlossQuestion = React.createClass({
  getInitialState: function() {
    return {show: false, value: ''}
  },
  handleChange(event) {
    this.setState({value: event.target.value});
  },
  finish: function() {
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

      return (<div className='gloss-question'>
              <p>Can you describe in words what you think the rule is?</p>
              <textarea value={this.state.value} onChange={this.handleChange} rows="4" cols="60"></textarea>
              <button disabled={buttonDisabled} onClick={this.finish}>{buttonText}</button>
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
  showGeneralization: function() {
    this.refs.generalization.setState({show: 'possible'});
  },
  afterGeneralization: function() {
    this.refs.gloss.setState({show: true})
  },
  afterGloss: function() {

    var gen = this.refs.generalization;

    this.props.after({
      gloss: this.refs.gloss.state.value,
      generalization: gen.getResponses(),
      generalizationHistory: gen.state.actions
    })
  },
  render: function() {
    var comp = this;

    var coverStory = (<div className='cover-story'>There is a certain rule for strings. We showed another Mechanical Turk worker the rule and asked them to help you learn the rule by making examples of strings that either fit or don’t fit the rule. Here are the examples they made:</div>);

    return (<div className='examplesEditor'>
            {coverStory}
            <ReceivedExamplesList onAllRevealed={this.showGeneralization} examples={this.props.examples} />
            <GeneralizationQuestions ref='generalization' questions={this.props.questions} after={comp.afterGeneralization} />
            <GlossQuestion ref='gloss' after={this.afterGloss} />
            </div>)
    }

});

module.exports = ReceiveInterface;
