
(function(window, document) {
  'use strict'

  const Utils = {
    // Get an event's target element and the element specified by the "data-target" attribute
    getTargets: (event) => {
      var targets = {}
      targets.evTarget = event.currentTarget
      var dataTarget = targets.evTarget.getAttribute('data-target')
      targets.dataTarget = (dataTarget) ? document.querySelector(dataTarget) : false
      return targets
    },

    // Get the potential max height of an element
    getMaxHeight: (element) => {
      // Source: http://n12v.com/css-transition-to-from-auto/
      var prevHeight = element.style.height
      element.style.height = 'auto'
      var maxHeight = getComputedStyle(element).height
      element.style.height = prevHeight
      element.offsetHeight // force repaint
      return maxHeight
    },

    // Fire a specified event
    // Source: http://youmightnotneedjquery.com/
    fireTrigger: (element, eventType) => {
      if (document.createEvent) {
        var event = document.createEvent('HTMLEvents')
        event.initEvent(eventType, true, false)
        element.dispatchEvent(event)
      } else {
        element.fireEvent('on' + eventType)
      }
    }
  }

  class DropDownComponent {
    constructor(node) {
      node.addEventListener('click', this.open)
      node.addEventListener('blur', this.close)
    }

    open(event) {
      // Block anchors default behavior
      event.preventDefault()
      event.currentTarget.parentElement.classList.toggle('open')

      return false
    }

    close(event) {
      // Block anchors default behavior
      event.preventDefault()
      event.currentTarget.parentElement.classList.remove('open')

      // Trigger the click event on the target if it not opening another menu
      if (event.relatedTarget && event.relatedTarget.getAttribute('data-toggle') !== 'dropdown') {
        event.relatedTarget.click()
      }

      return false
    }
  }

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
    element.addEventListener('transitionend', function() {
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
    element.offsetHeight; // force repaint
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


  /*
   * Alert dismiss action
   * 1. Get list of all elements that are alert dismiss buttons
   * 2. Add click event listener to these elements
   * 3. When clicked, find the target or parent element with class name "alert"
   * 4. Remove that element from the DOM
   */

  // Start the collapse action on the chosen element
  function doDismiss(event) {
    event.preventDefault();
    // Get target element from data-target attribute
    var targets = Utils.getTargets(event);
    var target = targets.dataTarget;

    if (!target) {
      // If data-target not specified, get parent or grandparent node with class="alert"
      var parent = targets.evTarget.parentNode;
      if (parent.classList.contains('alert')) {
        target = parent;
      } else if (parent.parentNode.classList.contains('alert')) {
        target = parent.parentNode;
      }
    }

    Utils.fireTrigger(target, 'close.bs.alert');
    target.classList.remove('in');

    function removeElement() {
      // Remove alert from DOM
      try {
        target.parentNode.removeChild(target);
        Utils.fireTrigger(target, 'closed.bs.alert');
      } catch (e) {
        window.console.error('Unable to remove alert');
      }
    }

    // Call the complete() function after the transition has finished
    if (target.classList.contains('fade')) {
      target.addEventListener('transitionend', function() {
        removeElement();
      }, false);
    } else {
      removeElement();
    }

    return false;
  }

  // Get all alert dismiss buttons and add click event listeners
  var dismissList = document.querySelectorAll('[data-dismiss=alert]');
  for (var j = 0, lenj = dismissList.length; j < lenj; j++) {
    dismissList[j].onclick = doDismiss;
  }

  const dropDownNodes = document.querySelectorAll('[data-toggle=dropdown]')
  for (let dropDownNode of dropDownNodes) {
    new DropDownComponent(dropDownNode);
  }
})(window, window.document);
