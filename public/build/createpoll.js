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
            { className: "pollOption" },
            React.createElement(
                "label",
                { className: "createLabel" },
                "Option ",
                name.substr(3),
                " "
            ),
            React.createElement("input", { type: "text", name: "option", className: "createInput" }),
            React.createElement("br", null)
        );
    }
});

var CreatePoll = React.createClass({
    displayName: "CreatePoll",

    getInitialState: function getInitialState() {
        return { numOptions: 2, options: [] };
    },
    componentDidMount: function componentDidMount() {
        var options = [];
        for (var i = 0; i < this.state.numOptions; i++) {
            var ref = "opt" + (i + 1);
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
    handleRemove: function handleRemove() {
        var numOptions = this.state.numOptions;

        if (numOptions > 2) {
            numOptions--;
            this.state.options.pop();
            var options = this.state.options;

            this.setState({ numOptions: numOptions, options: options });
        }
    },
    render: function render() {
        var action = baseUrl + "/createpoll";
        return React.createElement(
            "div",
            { className: "createForm" },
            React.createElement(
                "form",
                { method: "post", action: action },
                React.createElement(
                    "div",
                    { className: "createHeader" },
                    "Create A Poll"
                ),
                React.createElement(
                    "div",
                    { className: "changeOptions" },
                    React.createElement(
                        "div",
                        { className: "changeBtnContainer" },
                        React.createElement(
                            "div",
                            { onClick: this.handleAdd, id: "addOpt" },
                            "Add Option"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "changeBtnContainer" },
                        React.createElement(
                            "div",
                            { onClick: this.handleRemove, id: "removeOpt" },
                            "Remove Option"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "pollOption" },
                    React.createElement(
                        "label",
                        { className: "createLabel" },
                        "Title "
                    ),
                    React.createElement("input", { type: "text", name: "pollTitle", className: "createInput" })
                ),
                React.createElement("br", null),
                this.state.options,
                React.createElement(
                    "div",
                    { className: "submitButton" },
                    React.createElement("input", { type: "submit", value: "Create Poll", className: "submitButton" })
                )
            )
        );
    }
});

ReactDOM.render(React.createElement(CreatePoll, null), document.getElementById('mount'));