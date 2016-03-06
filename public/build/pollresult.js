"use strict";

var baseUrl = "https://nh-fcc-voting.herokuapp.com";

if (/^http\:\/\/localhost/.test(window.location.href)) {
    baseUrl = "";
}

var PollResult = React.createClass({
    displayName: "PollResult",

    getInitialState: function getInitialState() {
        return { title: "" };
    },
    componentDidMount: function componentDidMount() {
        var context = this;
        var pollNumber = $('#pollNumber').html();
        var pollData = $.get(baseUrl + "/api/polls/" + pollNumber, function (data) {
            context.setState({ title: data.title });

            var questions = data.questions;

            var sortify = function sortify(a, b) {
                if (a.count < b.count) {
                    return 1;
                } else if (a.count > b.count) {
                    return -1;
                } else {
                    return 0;
                }
            };

            questions.sort(sortify);

            var w = 300;
            var h = 20 * questions.length;

            var svg = d3.select("#myChart").append('svg').attr("width", w).attr("height", h);

            svg.selectAll("rect").data(questions).enter().append("rect").attr("x", 0).attr("y", function (d, i) {
                return i * 21;
            }).attr("width", function (d) {
                if (d.count === 0 || questions[0].count === 0) return 0;
                return d.count / questions[0].count * 300;
            }).attr("height", 20).attr("fill", "#F2EEB3");

            svg.selectAll("text").data(questions).enter().append("text").text(function (d) {
                return d.question + " - " + d.count;
            }).attr("x", 5).attr("y", function (d, i) {
                return i * 21 + 15;
            }).attr("font-size", "0.8em").attr("fill", "#260126");
        });
    },
    render: function render() {
        var title = this.state.title;
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                title
            ),
            React.createElement("div", { id: "myChart" })
        );
    }
});

ReactDOM.render(React.createElement(PollResult, null), document.getElementById("mount"));