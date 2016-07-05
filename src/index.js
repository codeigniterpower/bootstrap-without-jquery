
(function(window, document) {
  'use strict'

  const Utils = {
    // Get an event's target element and the element specified by the "data-target" attribute
    getTarget: (event) => {
      const dataTarget = event.currentTarget.getAttribute('data-target')
      return dataTarget ? document.querySelector(dataTarget) : null
    },

    // Get the potential max height of an element
    getMaxHeight: (element) => {
      // Source: http://n12v.com/css-transition-to-from-auto/
      var prevHeight = element.style.height
      element.style.height = 'auto'
      var maxHeight = getComputedStyle(element).height
      element.style.height = prevHeight
      // element.offsetHeight // force repaint
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
    },

    remove: (nodeOrEvent) => {
      const node = nodeOrEvent.constructor.name === 'HTMLDivElement' ?
                   nodeOrEvent : nodeOrEvent.currentTarget

      node.parentNode.removeChild(node)
    }
  }

  class DismissableAlertComponent {
    constructor(node) {
      node.addEventListener('click', this.close)
    }

    close(event) {
      event.preventDefault()

      const alertNode = event.currentTarget.parentNode

      if (alertNode.classList.contains('fade')) {
        alertNode.addEventListener('transitionend', Utils.remove, false);
      } else {
        Utils.remove(alertNode);
      }

      alertNode.classList.remove('in')
    }
  }

  class DropDownMenuComponent {
    constructor(node) {
      node.addEventListener('click', this.open)
      node.addEventListener('blur', this.close)
    }

    open(event) {
      event.preventDefault()

      event.currentTarget.parentElement.classList.toggle('open')
    }

    close(event) {
      event.preventDefault()

      event.currentTarget.parentElement.classList.remove('open')

      // Trigger the click event on the target if it not opening another menu
      if (event.relatedTarget && event.relatedTarget.getAttribute('data-toggle') !== 'dropdown') {
        event.relatedTarget.click()
      }
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

  const alertNodes = document.querySelectorAll('[data-dismiss=alert]')
  for (let alertNode of alertNodes) {
    new DismissableAlertComponent(alertNode);
  }

  const dropDownNodes = document.querySelectorAll('[data-toggle=dropdown]')
  for (let dropDownNode of dropDownNodes) {
    new DropDownMenuComponent(dropDownNode);
  }
})(window, window.document);
