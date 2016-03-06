"use strict";

var baseUrl = "https://nh-fcc-voting.herokuapp.com";

if (/^http\:\/\/localhost/.test(window.location.href)) {
    baseUrl = "";
}

var Poll = React.createClass({
    displayName: "Poll",

    render: function render() {
        return React.createElement(
            "div",
            { className: "poll" },
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
        $.get(baseUrl + "/api/polls/all", function (data) {

            var polls = [];

            JSON.parse(data).forEach(function (datum) {
                var link = baseUrl + "/poll/" + datum.id;
                polls.push(React.createElement(Poll, { url: link, title: datum.title, key: datum.id }));
            });

            context.setState({ polls: polls });
        });
    },
    render: function render() {
        var polls = this.state.polls;
        return React.createElement(
            "div",
            { className: "polls" },
            React.createElement(
                "div",
                { className: "pollsHeader" },
                "All Polls"
            ),
            polls
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById("mount"));