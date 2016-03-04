"use strict";

var App = React.createClass({
    displayName: "App",

    render: function render() {
        return React.createElement(
            "h1",
            null,
            "Hello, World! Changed!"
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById("mount"));