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
  'environment',
  'myApp.home',
  'myApp.about',
  'myApp.diary',
  'myApp.users',
  'myApp.ask',
  'myApp.wiki',
  'myApp.admin'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $translateProvider, $authProvider, growlProvider, ezfbProvider, envServiceProvider ) {
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



    // set the domains and variables for each environment
    envServiceProvider.config({
      domains: {
        development: ['localhost', 'dev.local'],
        production: ['gardening-jardines.rhcloud.com','gardensyjardines.com']
      },
      vars: {
        development: {
          amazonS3Url: 'https://s3.amazonaws.com/gardensyjardinestest/',
          googlePlusAPI: 'AIzaSyBU8T_9Zy5nF0jTpTjFity8kF0OsKpg4Ic',
          staticUrl: '//localhost/static'
          // antoherCustomVar: 'lorem',
          // antoherCustomVar: 'ipsum'
        },
        production: {
          amazonS3Url: 'https://s3.amazonaws.com/gardensyjardines/',
          googlePlusAPI: 'AIzaSyBU8T_9Zy5nF0jTpTjFity8kF0OsKpg4Ic',
          staticUrl: '//static.acme.com'
          // antoherCustomVar: 'lorem',
          // antoherCustomVar: 'ipsum'
        }
        // anotherStage: {
        //  customVar: 'lorem',
        //  customVar: 'ipsum'
        // }
      }
    });

    // run the environment check, so the comprobation is made
    // before controllers and services are built
    envServiceProvider.check();




})



.run(function () {
})

.controller( 'AppCtrl', function( $rootScope, $scope, $translate, $location, $state, User, UserService, changeLanguage, Language ) {

  $scope.loggedIn = User.isAuthenticated();
  $scope.userId = User.getCurrentId();

  UserService.checkRoles($scope.userId, ['admin'])
    .then(function(cb) {
      $rootScope.isAdmin = cb.length > 0 ? true : false;
    });



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



.service('UserService', function UserService( $q, User) {

  this.checkRoles = function(userId, inRoles) {

    var deferred = $q.defer();

    User.getRoles({"userId": userId})
      .$promise.then(function (cb) {
      var roles = [];
      angular.forEach(cb.roles[0].role, function (value) {
        this.push(value.name);
      }, roles);

      deferred.resolve(inRoles.filter(function (n) {
        return roles.indexOf(n) != -1;
      }));



    });

    return deferred.promise;
  };



  return {
    checkRoles: this.checkRoles
  };


})


;
