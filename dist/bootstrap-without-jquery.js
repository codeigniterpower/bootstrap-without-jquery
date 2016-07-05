'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document) {
  'use strict';

  var Utils = {
    // Get an event's target element and the element specified by the "data-target" attribute
    getTarget: function getTarget(event) {
      var dataTarget = event.currentTarget.getAttribute('data-target');
      return dataTarget ? document.querySelector(dataTarget) : null;
    },

    // Get the potential max height of an element
    getMaxHeight: function getMaxHeight(element) {
      // Source: http://n12v.com/css-transition-to-from-auto/
      var prevHeight = element.style.height;
      element.style.height = 'auto';
      var maxHeight = getComputedStyle(element).height;
      element.style.height = prevHeight;
      // element.offsetHeight // force repaint
      return maxHeight;
    },

    // Fire a specified event
    // Source: http://youmightnotneedjquery.com/
    fireTrigger: function fireTrigger(element, eventType) {
      if (document.createEvent) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventType, true, false);
        element.dispatchEvent(event);
      } else {
        element.fireEvent('on' + eventType);
      }
    },

    remove: function remove(event) {
      var node = event.currentTarget;
      node.parentNode.removeChild(node);
    }
  };

  var DismissableAlertComponent = function () {
    function DismissableAlertComponent(node) {
      _classCallCheck(this, DismissableAlertComponent);

      node.addEventListener('click', this.close);
    }

    _createClass(DismissableAlertComponent, [{
      key: 'close',
      value: function close(event) {
        event.preventDefault();

        var alertNode = event.currentTarget.parentNode;

        if (alertNode.classList.contains('fade')) {
          alertNode.addEventListener('transitionend', Utils.remove, false);
        } else {
          Utils.remove(alertNode);
        }

        alertNode.classList.remove('in');
      }
    }]);

    return DismissableAlertComponent;
  }();

  var DropDownMenuComponent = function () {
    function DropDownMenuComponent(node) {
      _classCallCheck(this, DropDownMenuComponent);

      node.addEventListener('click', this.open);
      node.addEventListener('blur', this.close);
    }

    _createClass(DropDownMenuComponent, [{
      key: 'open',
      value: function open(event) {
        // Block anchors default behavior
        event.preventDefault();
        event.currentTarget.parentElement.classList.toggle('open');
      }
    }, {
      key: 'close',
      value: function close(event) {
        // Block anchors default behavior
        event.preventDefault();
        event.currentTarget.parentElement.classList.remove('open');

        // Trigger the click event on the target if it not opening another menu
        if (event.relatedTarget && event.relatedTarget.getAttribute('data-toggle') !== 'dropdown') {
          event.relatedTarget.click();
        }
      }
    }]);

    return DropDownMenuComponent;
  }();

  /*
   * Collapse action
   * 1. Get list of all elements that are collapse triggers
   * 2. Add click event listener to these elements
   * 3. When clicked, change target element's class name from "collapse" to "collapsing"
   * 4. When action (collapse) is complete, change target element's class name from "collapsing" to "collapse in"
   * 5. Do the reverse, i.e. "collapse in" -> "collapsing" -> "collapse"
   */

  // Show a target element


  function show(element, trigger) {
    element.classList.remove('collapse');
    element.classList.add('collapsing');
    trigger.classList.remove('collapsed');
    trigger.setAttribute('aria-expanded', true);

    // Set element's height to its maximum height
    element.style.height = Utils.getMaxHeight(element);

    // Call the complete() function after the transition has finished
    element.addEventListener('transitionend', function () {
      complete(element);
    }, false);
  }

  // Hide a target element
  function hide(element, trigger) {
    element.classList.remove('collapse');
    element.classList.remove('in');
    element.classList.add('collapsing');
    trigger.classList.add('collapsed');
    trigger.setAttribute('aria-expanded', false);

    // Reset element's height
    element.style.height = getComputedStyle(element).height;
    // element.offsetHeight; // force repaint
    element.style.height = '0px';
  }

  // Change classes once transition is complete
  function complete(element) {
    element.classList.remove('collapsing');
    element.classList.add('collapse');
    element.setAttribute('aria-expanded', false);

    // Check whether the element is unhidden
    if (element.style.height !== '0px') {
      element.classList.add('in');
      element.style.height = 'auto';
    }
  }

  // Start the collapse action on the chosen element
  function doCollapse(event) {
    event.preventDefault();
    var targets = Utils.getTargets(event);
    var dataTarget = targets.dataTarget;

    // Add the "in" class name when elements are unhidden
    if (dataTarget.classList.contains('in')) {
      hide(dataTarget, targets.evTarget);
    } else {
      show(dataTarget, targets.evTarget);
    }
    return false;
  }

  // Get all elements that are collapse triggers and add click event listeners
  var collapsibleList = document.querySelectorAll('[data-toggle=collapse]');
  for (var i = 0, leni = collapsibleList.length; i < leni; i++) {
    collapsibleList[i].onclick = doCollapse;
  }

  var alertNodes = document.querySelectorAll('[data-dismiss=alert]');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = alertNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var alertNode = _step.value;

      new DismissableAlertComponent(alertNode);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var dropDownNodes = document.querySelectorAll('[data-toggle=dropdown]');
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = dropDownNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var dropDownNode = _step2.value;

      new DropDownMenuComponent(dropDownNode);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
})(window, window.document);
