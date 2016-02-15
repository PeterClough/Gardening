angular.module( 'myApp', [
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'angular-growl',
  'ngCookies',
  'lbServices',
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'ui.select',
  'myApp.home',
  'myApp.about',
  'myApp.diary',
  'myApp.users',
  'myApp.ask'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $translateProvider, growlProvider ) {
  $translateProvider.translations('en', translationsEN);
  $translateProvider.translations('es', translationsES);
  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.useLocalStorage();
  $urlRouterProvider.otherwise( '/home' );
  growlProvider.globalTimeToLive(5000);
})

.run( function run () {
})

.controller( 'AppCtrl', function( $rootScope, $scope, $translate, User, changeLanguage, Language) {


  $scope.loggedIn = User.isAuthenticated();


  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | myApp' ;
      $scope.loggedIn = User.isAuthenticated();
    }
  });

  Language.getList()
    .$promise.then(function(cb) {
      $scope.languages = cb.languages;
      $scope.language={};

      function langId(langKey) {
        var lanIdx = -1;
        for (var i = 0, len = $scope.languages.length; i < len; i++) {
          if ($scope.languages[i].code === langKey) {
            lanIdx = i;
            return lanIdx;
          }
        }
      }




      var lanCode = $translate.proposedLanguage() || $translate.use();

      var languageIndex = langId(lanCode);

      $scope.language.selected =  $scope.languages[languageIndex];
      $rootScope.languageId = $scope.language.selected.id;


      $scope.$watch('language.selected', function(newVal) {
      if (newVal && newVal.name) {
        var langKey = newVal.code;
        var lanId = langId(langKey);
        $rootScope.languageId = $scope.languages[lanId].id;
        changeLanguage(langKey);
      }
    }, true);



  });



})


.factory('changeLanguage', function changeLanguage ($translate) {
  return function(langKey) {
    $translate.use(langKey);
  };
})

;
