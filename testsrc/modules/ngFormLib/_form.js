(function (angular) {
  'use strict';

  // Define modules
  angular.module('ngFormLib', ['ngAnimate',
    'ngFormLib.policy',
//    Add the policies you want, or define your own:
//    'ngFormLib.policy.checkForStateChanges',
//    'ngFormLib.policy.displayError',
//    'ngFormLib.policy.focusBehaviour',
    'ngFormLib.controls'
  ]);

  var data = '';
  ////@@include('//@@ROOT_DIRngFormLib/includes/includedFile.txt')
  window.alert(data);

})(window.angular);
