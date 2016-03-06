"use strict";

var baseUrl = "https://nh-fcc-voting.herokuapp.com";

if (/^http\:\/\/localhost/.test(window.location.href)) {
    baseUrl = "";
}

var PollOption = React.createClass({
    displayName: "PollOption",

    render: function render() {
        var name = this.props.name;
        return React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                null,
                "Option ",
                name.substr(4),
                " "
            ),
            React.createElement("input", { type: "text", name: "option" }),
            React.createElement("br", null)
        );
    }
});

var CreatePoll = React.createClass({
    displayName: "CreatePoll",

    getInitialState: function getInitialState() {
        return { numOptions: 1, options: [] };
    },
    componentDidMount: function componentDidMount() {
        var options = [];
        for (var i = 0; i < this.state.numOptions; i++) {
            var ref = "opt" + i + 1;
            console.log(ref);
            options.push(React.createElement(PollOption, { name: ref, key: ref }));
        }

        this.setState({ options: options });
    },
    componentDidUpdate: function componentDidUpdate() {},
    handleAdd: function handleAdd() {
        var numOptions = this.state.numOptions + 1;
        var options = this.state.options;
        var ref = "opt" + numOptions;
        options.push(React.createElement(PollOption, { name: ref, key: ref }));

        this.setState({ numOptions: numOptions, options: options });
    },
    render: function render() {
        var action = baseUrl + "/createpoll";
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { method: "post", action: action },
                React.createElement(
                    "label",
                    null,
                    "Title "
                ),
                React.createElement("input", { type: "text", name: "pollTitle" }),
                React.createElement("br", null),
                this.state.options,
                React.createElement(
                    "div",
                    { onClick: this.handleAdd },
                    "Add Option"
                ),
                React.createElement("input", { type: "submit", value: "Create Poll" })
            )
        );
    }
});

ReactDOM.render(React.createElement(CreatePoll, null), document.getElementById('mount'));