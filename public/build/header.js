"use strict";

var baseUrl = "https://nh-fcc-voting.herokuapp.com";

if (/^http\:\/\/localhost/.test(window.location.href)) {
    baseUrl = "";
}

var Header = React.createClass({
    displayName: "Header",

    render: function render() {
        var homeUrl = baseUrl + "/";
        var createUrl = baseUrl + "/createpoll";
        return React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "a",
                { href: homeUrl },
                React.createElement(
                    "div",
                    { className: "home" },
                    "FreeVoteCamp"
                )
            ),
            React.createElement(
                "div",
                { className: "nav" },
                React.createElement(
                    "a",
                    { href: createUrl },
                    React.createElement(
                        "div",
                        null,
                        "Create a Poll"
                    )
                )
            )
        );
    }
});

ReactDOM.render(React.createElement(Header, null), document.getElementById("header"));