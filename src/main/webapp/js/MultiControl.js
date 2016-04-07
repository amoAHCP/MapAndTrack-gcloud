/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
MultiControl = function (opt_options) {

    var options = opt_options || {};

    var container = document.createElement('div');
    container.className = 'multicontrol ol-unselectable ol-control';

    options.controls.forEach(function (control) {
        console.log(control.name);
        var button = document.createElement('button');
        button.innerHTML = control.html;
        button.title = control.tooltip;
        button.className = 'ol-unselectable';

        button.addEventListener('click', control.handler, false);
        button.addEventListener('touchstart', control.handler, false);

        container.appendChild(button);

    }, this);


    var this_ = this;

    ol.control.Control.call(this, {
        element: container,
        target: options.target
    });

};
ol.inherits(MultiControl, ol.control.Control);

