angular.module( 'myApp.ask', [
  'ui.router',
  'pascalprecht.translate',
  'ask.list',
  'ask.view',
  'ask.tags'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'ask', {
    url: '/ask',
    views: {
      "main": {
        controller: 'AskCtrl',
        templateUrl: 'ask/ask.tpl.html'
      }
    },
    data:{ pageTitle: 'Ask' }
  });
})

.controller( 'AskCtrl', function AskCtrl() {


})

;
