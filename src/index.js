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
            <span className='remove' onContextMenu={deleteExample}>	&#9679;</span> The string <input type="text" name="string" onChange={updateString} value={string} />
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
  },
  addExample: function() {
    this.setState(_.extend(this.getBlankExample(), this.state));
  },
  getInitialState: function() {
    return this.getBlankExample();
  },
  updateExample: function(ex) {
    var old = this.state[ex.time];

    this.setState(_.object([[ex.time,
                             {kind: ex.kind || old.kind,
                              string: ex.string || old.string}
                            ]]))
  },
  deleteExample: function(ex) {
    this.replaceState(_.omit(this.state, ex.props.time));
  },
  render: function() {
    var examples = this.state;

    return (<div className='examplesEditor'>
            <p>Imagine that you want to communicate this rule to another person by giving examples of strings that it either does or does not match:</p>
            <p className='rule-wrapper'>Rule: <span className='rule'>{this.props.rule}</span></p>
            <p>What examples would you give for this rule?</p>
            <p className='interface-instructions'>To add an example, click the Add an Example button. To remove an example, click the red dot next to it.</p>
            <ExamplesList examples={examples} updateExample={this.updateExample} deleteExample={this.deleteExample} />

            <button className='add-example' onClick={this.addExample}><span className='icon plus'>+</span> Add an example</button>

            <div className='clear'></div>

            <button className='done-adding' onClick={this.finish}>Done for this rule</button>

           </div>)
  }
});

var r = React.createElement(ExamplesEditor,
                            {rule: 'Three or more a\'s'}
                           );

var dummyDiv = $('#give-examples')[0];


ReactDOM.render(r, dummyDiv, function() {
  console.log('made a thing');
})
