var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery'),
    _ = require('underscore');

var Example = React.createClass({
  render: function() {
    var updateExample = this.props.updateExample,
        time = this.props.time + '';
    var updateString = function(e) {
      updateExample({time: time, string: e.target.value});
    };
    var updateKind = function(e) {
      updateExample({time: time, kind: e.target.value});
    }
    var doesnt = "doesn't"; // putting "doesn't" in the jsx screws up indentation
    var string = this.props.string == null ? "" : this.props.string;
    return (<form>
            [x] The string <input type="text" name="string" onChange={updateString} value={string} />
            <label>
            <input type="radio" name="type" value="positive" onChange={updateKind} />
            matches
            </label>
            <label>
            <input type="radio" name="type" value="negative" onChange={updateKind} />
            {doesnt} match </label>
            </form>)
  }
})

var ExamplesList = React.createClass({
  render: function() {
    var updateExample = this.props.updateExample;
    var listObj = _.mapObject(this.props.examples,
                           function(ex, key) {
                             return (<Example kind={ex.polarity} string={ex.string} time={key} key={key} updateExample={updateExample}/>)
                           }),
        list = _.values(listObj);

    return (<div>{list}</div>)
  }
});

var ExamplesEditor = React.createClass({
  getBlankExample: function() {
    return _.object([[(new Date().getTime()) + '', {kind: null, string: null}]]);
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
  render: function() {
    var examples = this.state;
    return (<div>
            <ExamplesList examples={examples} updateExample={this.updateExample} />
            <button onClick={this.addExample}>Add example</button>
           </div>)
  }
});

var r = React.createElement(ExamplesEditor);

var dummyDiv = $('#dummy')[0];


ReactDOM.render(r, dummyDiv, function() {
  console.log('made a thing');
})
