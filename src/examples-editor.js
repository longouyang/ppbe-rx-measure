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
    var updateKind = function(e) {
      updateExample({time: time, kind: e.target.value});
    }
    var deleteExample = function(e) {
      e.preventDefault();
      console.log(e);
      comp.props.deleteExample(comp);
    }
    var doesnt = "doesn't"; // putting "doesn't" in the jsx screws up indentation
    var string = this.props.string == null ? "" : this.props.string;
    return (<form>
            <span className='remove' onClick={deleteExample}>	&#9679;</span> The string <input type="text" name="string" onChange={updateString} value={string} />
            <label>
            <input type="radio" name="type" value="positive" onChange={updateKind} />
            matches
            </label>
            <label>
            <input type="radio" name="type" value="negative" onChange={updateKind} />
            {doesnt} match </label>


            </form>
           )
  }
})

var ExamplesList = React.createClass({
  render: function() {
    var comp = this;
    var listObj = _.mapObject(this.props.examples,
                              function(ex, key) {
                                return (<Example kind={ex.polarity} string={ex.string} time={key} key={key} updateExample={comp.props.updateExample} deleteExample={comp.props.deleteExample}/>)
                              }),
        list = _.values(listObj);

    return (<div>{list}</div>)
  }
});

var ExamplesEditor = React.createClass({
  getBlankExample: function() {
    var timeString = (new Date()).getTime() + '';
    return _.object([[timeString, {kind: null, string: null}]]);
  },
  finish: function() {
    // make sure all examples are marked as either match or non-match

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

    this.setState(_.object([[ex.time,
                             {kind: ex.kind || old.kind,
                              string: _.isNull(ex.string) ? old.string : ex.string}
                            ]]))
  },
  deleteExample: function(ex) {
    this.replaceState(_.omit(this.state, ex.props.time));
  },
  render: function() {
    var examples = _.omit(this.state,'revealRule', 'revealInterface');

    var ruleContents = {__html: this.props.rule.description} ;

    var communicationFraming = 'Imagine that you want to inform another person about a rule for making strings:';

    var revealRule = this.state.revealRule,
        revealInterface = this.state.revealInterface;

    var revealRuleButtonClass = 'reveal-rule' + (revealRule ? ' hide' : '');
    var ruleWrapperClass = 'rule-wrapper' + (revealRule ? '' : ' hide');

    var revealInterfaceButtonClass = 'reveal-interface' + (revealRule ? (revealInterface ? ' hide' : '') : ' hide');
    var interfaceClass = 'interface' + (revealInterface ? '' : ' hide')

    return (<div className='examplesEditor'>
            <p>{communicationFraming}</p>
            <button type="button" className={revealRuleButtonClass} onClick={this.revealRule}>Click here to show the rule</button>
            <p className={ruleWrapperClass}> Rule: <span className='rule' dangerouslySetInnerHTML={ruleContents} /></p>
            <button type="button" className={revealInterfaceButtonClass} onClick={this.revealInterface}>Continue</button>
            <div className={interfaceClass}>
            <p>If you could only give examples of strings that either match or don't match the rule, what examples would you give?</p>

              <ExamplesList examples={examples} updateExample={this.updateExample} deleteExample={this.deleteExample} />

              <button className='add-example' onClick={this.addExample}><span className='icon plus'>+</span> Add an example</button>

              <div className='clear'></div>

              <p className='interface-instructions'>To remove an example, click the red dot next to it.</p>

              <button className='done-adding' onClick={this.finish}>Done for this rule</button>
              </div>
              </div>)
    }

});

module.exports = ExamplesEditor;
