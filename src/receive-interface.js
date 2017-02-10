var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore');

var ReceivedExample = React.createClass({
  render: function() {
    var matchString = this.props.polarity == 'positive' ? 'fits' : 'doesn\'t fit';
    var matchIconText = this.props.polarity == 'positive' ? '✔' : '✘';
    var matchIconClass = 'matchIcon ' + (this.props.polarity);

    var revealed = this.props.revealed;

    if (!revealed || revealed == 'on-deck') {
      var isDisabled = !revealed;
      return (<p><button disabled={isDisabled} onClick={this.props.revealNext} >Click to show example</button></p>)
    } else {
        return (<div>The string <code>{this.props.string}</code> {matchString} <span className={matchIconClass}>{matchIconText}</span></div>)
    }
  }
});

var ReceivedExamplesList = React.createClass({
  getInitialState: function() {
    return {numRevealed: 0}
  },
  revealExample: function() {
    this.setState({numRevealed: this.state.numRevealed + 1})
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
                          return (<ReceivedExample polarity={ex.polarity} string={ex.string} key={i} revealed={revealed} revealNext={comp.revealExample} />)
                        }),
        list = _.values(listObj);

    return (<div className='received-examples-list'>{list}</div>)
  }
});

var ReceiveInterface = React.createClass({
  getBlankExample: function() {
    var timeString = (new Date()).getTime() + '';
    return _.object([[timeString, {polarity: null, string: null}]]);
  },
  finish: function() {
    this.props.after(this.state);
  },
  addExample: function() {
    this.setState(_.extend(this.getBlankExample(), this.state));
  },
  revealRule: function() {
    this.setState({revealRule: true})
  },
  revealInterface: function() {
    this.setState({revealInterface: true})
  },
  getInitialState: function() {
    return {
      revealRule: false,
      revealInterface: false
    };
  },
  updateExample: function(ex) {
    var old = this.state[ex.time];

    var newEntry = _.extend({}, old, ex);

    this.setState(_.object([[ex.time, newEntry]]))
  },
  deleteExample: function(ex) {
    this.replaceState(_.omit(this.state, ex.props.time));
  },
  render: function() {

    return (<div className='examplesEditor'>
            <div className='cover-story'>There is a certain rule for strings. We showed another Mechanical Turk worker the rule and asked them to help you learn the rule by making examples of strings that either fit or don’t fit the rule. Here are the examples they made:</div>
            <ReceivedExamplesList examples={this.props.examples} />
            </div>)
    }

});

module.exports = ReceiveInterface;
