"use strict";

var Login = React.createClass({
    displayName: "Login",

    render: function render() {
        return React.createElement(
            "div",
            { className: "login-box" },
            React.createElement(
                "a",
                { href: "/auth/facebook" },
                "Login with Facebook"
            )
        );
    }
});

ReactDOM.render(React.createElement(Login, null), document.getElementById('mount'));