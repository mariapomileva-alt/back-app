(function () {
  var config = window.BACK_PLUS_SITE || { subscriptionsPubliclyAvailable: false };
  var stateA = document.querySelector('[data-subscription-state="a"]');
  var stateB = document.querySelector('[data-subscription-state="b"]');

  if (config.subscriptionsPubliclyAvailable) {
    if (stateA) stateA.hidden = true;
    if (stateB) stateB.hidden = false;
  } else {
    if (stateA) stateA.hidden = false;
    if (stateB) stateB.hidden = true;
  }
})();
