"use strict";

var Header = React.createClass({
    displayName: "Header",

    render: function render() {
        return React.createElement("div", { className: "header" });
    }
});

ReactDOM.render(React.createElement(Header, null), document.getElementById("header"));