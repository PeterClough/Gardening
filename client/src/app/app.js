angular.module( 'myApp', [
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'ngCookies',
  'lbServices',
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'ui.select',
  'satellizer',
  'ezfb',
  'myApp.home',
  'myApp.about',
  'myApp.diary',
  'myApp.users',
  'myApp.ask'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $translateProvider, $authProvider, growlProvider, ezfbProvider ) {
  $translateProvider.translations('en', translationsEN);
  $translateProvider.translations('es', translationsES);
  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitize');
  $translateProvider.useLocalStorage();
  $urlRouterProvider.otherwise( '/home' );



  $authProvider.httpInterceptor = false;


  $authProvider.facebook({
    clientId: '353106324898119'
  });

  $authProvider.google({
    clientId: '692504536355-a66nmnpbut2eamfled7lahl5fm0b9pjh.apps.googleusercontent.com'
  });

  growlProvider.globalTimeToLive(5000);

  ezfbProvider.setLocale('en_UK');


  ezfbProvider.setInitParams({
    appId: '353106324898119',
    version: 'v2.4'
  });



})



  .run( function run () {
})

.controller( 'AppCtrl', function( $rootScope, $scope, $translate, $location, $state, User, changeLanguage, Language) {


  $scope.loggedIn = User.isAuthenticated();



  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    var thisUrl = $state.href($state.current.name, $state.params, {absolute: true});

    //well dodgy needs sorting
    if (thisUrl.indexOf('diary/view/') >0) {
      thisUrl = thisUrl.split('/progress/')[0];
      thisUrl = thisUrl.split('/entry/')[0];
    }


    $scope.pageTitle = 'Gardening | ' + toState.data.pageTitle;
    $scope.ogUrl = toState.data.ogUrl || thisUrl;
    $scope.ogType = toState.data.ogType || 'website';
    $scope.ogTitle = toState.data.ogTitle ||  'Gardens y Jardines';
    $scope.ogDescription = toState.data.ogDescription ||  'A website all about gardening.';
    $scope.ogImage = toState.data.ogImage || 'http://www.gardensyjardines.com/images/gardensyjardines.png';



    $scope.loggedIn = User.isAuthenticated();


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
