angular.module( 'myApp', [
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'lbServices',
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'ui.select',
  'myApp.home',
  'myApp.about',
  'myApp.diary',
  'myApp.users'
])

  .config( function myAppConfig ( $stateProvider, $urlRouterProvider, $translateProvider ) {
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('es', translationsES);
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
    $urlRouterProvider.otherwise( '/home' );
  })

  .run( function run () {
  })

  .controller( 'AppCtrl', function( $scope, $location, $translate, $window, User, changeLanguage, SystemLanguage) {


    $scope.loggedIn = User.isAuthenticated();


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      if ( angular.isDefined( toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | myApp' ;
        $scope.loggedIn = User.isAuthenticated();
        console.log('state change :'+$scope.loggedIn);
      }
    });

    SystemLanguage.getList()
      .$promise.then(function(cb) {
        $scope.languages = cb.systemLanguages;
        $scope.language = {};
        $scope.$watch('language.selected', function(newVal) {
          if (newVal && newVal.name) {
            var langKey = newVal.code;
            changeLanguage(langKey);
          }
        }, true);
      });

    $scope.logout = function(){
      var accessToken =null;

      if ($window.localStorage) {
        accessToken=$window.localStorage.getItem("$LoopBack$accessTokenId");
      }
      console.log(accessToken);
      var lo = {"sid":accessToken};
      User.logout(lo, function(cb) {
        console.log(cb);
        $scope.loggedIn=false;
        var next = $location.nextAfterLogin || '/';
        $location.nextAfterLogin = null;
        $location.path(next);
      }, function(err){
        var next = $location.nextAfterLogin || '/';
        $location.nextAfterLogin = null;
        $location.path(next);
        console.log("err");
        console.log(err);
      });

    };



  })


  .factory('changeLanguage', [ '$translate', function changeLanguage ($translate) {
    return function(langKey) {
      $translate.use(langKey);
    };
  }])

;
