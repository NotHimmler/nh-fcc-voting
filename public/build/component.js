"use strict";

(function () {
    var Box = React.createClass({
        displayName: "Box",

        render: function render() {
            return React.createElement(
                "div",
                { className: "separate" },
                "I'm in a separate file!"
            );
        }
    });
})();