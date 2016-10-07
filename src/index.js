var React = require('react'),
    ReactDOM = require('react-dom'),
    $ = require('jquery');

var Example = React.createClass({
  render: function() {
    return (<form>
            The string <input type="text" name="string" />
            <label>
            <input type="radio" name="type" value="positive" />
            matches
            </label>

            <label>
            <input type="radio" name="type" value="negative" />
            doesn't match
</label>

            </form>
           )
  }
})

var ExamplesList = React.createClass({
  render: function() {

    var list = this.props.examples.map(function(ex) {
      var key = JSON.stringify(key);
      return (<Example kind={ex.polarity} string={ex.string} key={key}/>)
    });

    return (<div>
            {list}
            </div>)
  }
});

var ExamplesEditor = React.createClass({
  addExample: function() {
    this.setState({examples: this.state.examples.concat({kind: null, string: null, time: (new Date()).getTime()})})
  },
  getInitialState: function() {
    return {examples: []}
  },
  render: function() {
    var examples = this.state.examples;
    return (<div>
            <ExamplesList examples={examples} />
            <button onClick={this.addExample}>Add example</button>
           </div>)
  }
})

var r = React.createElement(ExamplesEditor,
                            {examples: []});

var dummyDiv = $('#dummy')[0];


ReactDOM.render(r, dummyDiv, function() {
  console.log('made a thing');
})
