"use strict";

var Login = React.createClass({
    displayName: "Login",

    render: function render() {
        return React.createElement(
            "div",
            { className: "login-box" },
            React.createElement(
                "a",
                { href: "/auth/twitter" },
                "Login with Twitter"
            )
        );
    }
});

ReactDOM.render(React.createElement(Login, null), document.getElementById('mount'));