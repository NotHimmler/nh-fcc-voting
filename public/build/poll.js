"use strict";

var baseUrl = "https://nh-fcc-voting.herokuapp.com";

if (/^http\:\/\/localhost/.test(window.location.href)) {
    baseUrl = "";
}

var Question = React.createClass({
    displayName: "Question",

    render: function render() {
        return React.createElement(
            "div",
            { id: this.props.id, className: "pollQ", onClick: this.props.handleClick },
            this.props.question
        );
    }
});

var Poll = React.createClass({
    displayName: "Poll",

    getInitialState: function getInitialState() {
        return { poll: { title: "" } };
    },
    handleClick: function handleClick(e) {
        console.log(e.target.id);
        var context = this;
        $.post('/vote', { pollNumber: context.state.poll.id, answer: e.target.id }, function () {
            location.reload();
        });
    },
    componentDidMount: function componentDidMount() {
        var pollNumber = $('#pollNumber').html();
        var context = this;
        $.get(baseUrl + '/api/polls/' + pollNumber, function (data) {
            context.setState({ poll: data });
            var questions = [];
            data.questions.forEach(function (datum, i) {
                questions.push(React.createElement(Question, { id: i, handleClick: context.handleClick, question: datum.question, key: i }));
            });
            context.setState({ questions: questions });
        });
    },
    render: function render() {
        var title = this.state.poll.title;
        var questions = this.state.questions;
        return React.createElement(
            "div",
            { className: "pollBox" },
            React.createElement(
                "h3",
                null,
                title
            ),
            questions
        );
    }
});

ReactDOM.render(React.createElement(Poll, null), document.getElementById('mount'));