var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore');

var Example = React.createClass({
  render: function() {
    var comp = this,
        updateExample = this.props.updateExample,
        time = this.props.time + '';
    var updateString = function(e) {
      updateExample({time: time, string: e.target.value});
    };
    var updatePolarity = function(e) {
      updateExample({time: time, polarity: e.target.value});
    }
    var deleteExample = function(e) {
      e.preventDefault();
      console.log(e);
      comp.props.deleteExample(comp);
    }
    var doesnt = "doesn't"; // putting "doesn't" in the jsx screws up indentation
    var string = this.props.string == null ? "" : this.props.string;
    return (<form>
            <span className='remove' onClick={deleteExample}>	&#9679;</span> The sequence <input type="text" name="string" onChange={updateString} value={string} />
            <label>
            <input type="radio" name="type" value="positive" onChange={updatePolarity} />
            matches
            </label>
            <label>
            <input type="radio" name="type" value="negative" onChange={updatePolarity} />
            {doesnt} match </label>


            </form>
           )
  }
});

var removeExample = function() {
  alert('To remove an example, click the red circle next to it');
}

var ExamplesList = React.createClass({
  render: function() {
    var comp = this;
    var listObj = _.mapObject(this.props.examples,
                              function(ex, key) {
                                return (<Example polarity={ex.polarity} string={ex.string} time={key} key={key} updateExample={comp.props.updateExample} deleteExample={comp.props.deleteExample}/>)
                              }),
        list = _.values(listObj);

    return (<div>{list}</div>)
  }
});

var ExamplesEditor = React.createClass({
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
    var examples = _.omit(this.state,'revealRule', 'revealInterface'),
        numExamples = _.size(examples);

    var ruleContents = {__html: this.props.rule.description} ;

    var communicationFraming = 'Imagine that you want to tell a friend of yours about a rule for making sequences:';

    var revealRule = this.state.revealRule,
        revealInterface = this.state.revealInterface;

    var revealRuleButtonClass = 'reveal-rule' + (revealRule ? ' hide' : '');
    var ruleWrapperClass = 'rule-wrapper' + (revealRule ? '' : ' hide');

    var revealInterfaceButtonClass = 'reveal-interface' + (revealRule ? (revealInterface ? ' hide' : '') : ' hide');
    var interfaceClass = 'interface' + (revealInterface ? '' : ' hide')

    var examplesComplete = _.every(examples, function(ex) { return ex.string && ex.polarity });
    var canFinish = numExamples > 0 && examplesComplete;
    var finishTitle = (canFinish
                       ? ''
                       : (numExamples == 0
                          ? 'Add at least one example to continue'
                          : 'Complete all your examples to continue'));

    var addButtonLabel = (numExamples == 0 ? 'Add first example' : 'Add another example');
    var removeButtonClassName = 'add-example' + (numExamples == 0 ? ' hide' : '');

    return (<div className='examplesEditor'>
            <p>{communicationFraming}</p>
            <button type="button" className={revealRuleButtonClass} onClick={this.revealRule}>Click here to show the rule</button>
            <p className={ruleWrapperClass}> Rule: <span className='rule' dangerouslySetInnerHTML={ruleContents} /></p>
            <button type="button" className={revealInterfaceButtonClass} onClick={this.revealInterface}>Continue</button>
            <div className={interfaceClass}>
            <p>How would you communicate this rule by giving examples of sequences that either match or don't match the rule? You can give any number of examples but try to give enough and make them helpful  so that your friend would guess the correct rule.</p>

              <ExamplesList examples={examples} updateExample={this.updateExample} deleteExample={this.deleteExample} />

              <button className='add-example' onClick={this.addExample}><span className='icon plus'>+</span> {addButtonLabel}</button>
              <button className={removeButtonClassName} onClick={removeExample}><span className='icon minus'>-</span> Remove an example</button>

              <div className='clear'></div>

              <button className='done-adding' onClick={this.finish} disabled={!canFinish} title={finishTitle}>Next rule &gt;&gt;</button>
              </div>
              </div>)
    }

});

module.exports = ExamplesEditor;
