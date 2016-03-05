"use strict";

var Poll = React.createClass({
    displayName: "Poll",

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: this.props.url },
                this.props.title
            )
        );
    }
});

var App = React.createClass({
    displayName: "App",

    getInitialState: function getInitialState() {
        return { polls: [] };
    },
    componentDidMount: function componentDidMount() {
        var context = this;
        $.get("/api/polls/all", function (data) {

            var polls = [];

            JSON.parse(data).forEach(function (datum) {
                var link = "/poll/" + datum.id;
                polls.push(React.createElement(Poll, { url: link, title: datum.title, key: datum.id }));
            });

            context.setState({ polls: polls });
        });
    },
    render: function render() {
        var polls = this.state.polls;
        return React.createElement(
            "div",
            null,
            polls
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById("mount"));