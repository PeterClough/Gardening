angular.module( 'ask.list', [
  'ui.router',
  'pascalprecht.translate',
  'ui.bootstrap.showErrors',
  'angular-growl',
  'ngTagsInput'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'ask.list', {
    url: '/list/:tag',
    views: {
      "ask": {
        controller: 'AskListCtrl',
        templateUrl: 'ask/list/list.tpl.html'
      },
      params: {
        tag  : {
          value : ''
        }
      }
    },
    data:{ pageTitle: 'Ask Questions' }
  });
})

.controller( 'AskListCtrl', function AskListCtrl( $scope, $rootScope, $translate, $filter, $timeout, $stateParams, $q, growl,  Question, Tag, QuestionTagJunction, User ) {

    $scope.gotQuestion = false;
    $scope.showCard = false;
    $scope.loggedIn = User.isAuthenticated();
    var userId = User.getCurrentId();
    var languageId = '';


    $rootScope.$on('$translateChangeSuccess', function () {
      $scope.showCard = false;
      languageId = $rootScope.languageId;
       if ( $stateParams.tag === '' ) {
        $translate('ASK_RECENT_HEADER').then(function (translation) {
          $scope.listHeader = translation;
        });

        Question.recentQuestions({languageId: languageId})
          .$promise.then(function (cb) {
            $scope.questions = cb.recentQuestions;
            $timeout(function () {
              $scope.showCard = true;
            }, 100);

          });
      }
      else {
        $translate('ASK_BY_TAG_HEADER').then(function (translation) {
          $scope.listHeader = translation;
        });

        Tag.findByTagName({ tag: $stateParams.tag, languageId: languageId})
          .$promise.then(function(cb) {
            if (cb.tag.length > 0) {
              $scope.tagHeader = cb.tag[0].tag;
              getQuestionsByTag(cb.tag[0].id);
            }
            else {
              $scope.tagHeader = $stateParams.tag;
              $scope.questions =[];
              $timeout(function () {
                $scope.showCard = true;
              }, 100);

            }
          });
      }

    });




    languageId = $rootScope.languageId;
    if (languageId !== undefined) {
      if ($stateParams.tag === '') {
        $translate('ASK_RECENT_HEADER').then(function (translation) {
          $scope.listHeader = translation;
        });
        //check if parent.languageid set if not wait
        Question.recentQuestions({languageId: languageId})
          .$promise.then(function (cb) {
            $scope.questions = cb.recentQuestions;
            $timeout(function () {
              $scope.showCard = true;
            }, 100);

          });
      }
      else {
        $translate('ASK_BY_TAG_HEADER').then(function (translation) {
          $scope.listHeader = translation;
        });
        Tag.findByTagName({tag: $stateParams.tag, languageId: languageId})
          .$promise.then(function (cb) {
            if (cb.tag.length > 0) {
              $scope.tagHeader = cb.tag[0].tag;
              getQuestionsByTag(cb.tag[0].id);
            }
            else {
              $scope.tagHeader = $stateParams.tag;
              $scope.questions = [];
              $timeout(function () {
                $scope.showCard = true;
              }, 100);

            }
          });
      }
    }


    function getQuestionsByTag(tagId) {
      Tag.questionsByTag({"tagId":tagId})
        .$promise.then(function (cb) {
          $scope.questions = cb.questionsByTag[0].question;
          $timeout(function () {
            $scope.showCard = true;
          }, 100);

        });
    }



    $scope.getQuestion = function() {

      $scope.question = {
        "question" : "",
        "rating" : 0,
        "tags": []
      };
      $scope.$broadcast('show-errors-reset');
      $scope.gotQuestion = true;
    };


    Tag.getAllTags()
      .$promise.then(function (cb) {
        var tagText = [];
        cb.allTags.forEach( function(tag) {
          tagText.push({text: tag.tag});
        });
        $scope.allTags = tagText;
      });


    $scope.tagAdding = function(tag) {
      if ($scope.allTags.indexOf(tag) === -1){
      }
    };


    $scope.filteredTagsAutoComplete = function(query) {
      var deferred = $q.defer();
      deferred.resolve( $filter('filter')($scope.allTags, query));
      return deferred.promise;
    };


    $scope.submitQuestion = function() {
      $scope.question.rating = 0;
      $scope.question.userId = userId;
      $scope.question.created = $scope.question.updated = $filter('date')(new Date(), 'medium');
      $scope.question.languageId = $scope.$parent.$parent.language.selected.id;
      Question.upsert($scope.question)
        .$promise.then(function(res) {
          //save tags
          var questionTagJunction = {questionId: res.id};
          var requests = [];
          angular.forEach($scope.question.tags, function(tag) {
            var deferredTagJunction = $q.defer();
            requests.push(deferredTagJunction.promise);

            var deferredTag = $q.defer();
            requests.push(deferredTag.promise);

            //create saveTag so screen doesn't lose data
            var saveTag={tag:tag.text};
            if (!("id" in tag)){
               Tag.findByTagName({"tag":tag.text},{languageId:$scope.question.languageId})
                .$promise.then(function (cb) {
                  if (cb.tag.length===0) {
                    saveTag.created = saveTag.updated = $filter('date')(new Date(), 'medium');
                    saveTag.languageId = $scope.$parent.$parent.language.selected.id;

                    Tag.upsert(saveTag)
                      .$promise.then(function (res) {
                          deferredTag.resolve(res);
                          //set the tag id
                          tag.id = res.id;
                          questionTagJunction.tagId = tag.id;
                          QuestionTagJunction.upsert(questionTagJunction)
                                .$promise.then(function (res) {
                                  deferredTagJunction.resolve(res);
                                });


                      });
                  }
                  else {
                    deferredTag.resolve();
                    questionTagJunction.tagId = cb.tag[0].id;
                    QuestionTagJunction.upsert(questionTagJunction)
                      .$promise.then(function (res) {
                        deferredTagJunction.resolve(res);
                       });
                  }
                });
            }
            else {
              deferredTag.resolve();
              questionTagJunction.tagId = tag.id;
              QuestionTagJunction.upsert(questionTagJunction)
                .$promise.then(function (res) {
                  deferredTagJunction.resolve(res);
                });
            }

          });

          $q.all(requests).then(function() {
            languageId = $scope.$parent.$parent.language.selected.id;
            Question.recentQuestions({languageId: languageId})
              .$promise.then(function (res) {
                $scope.questions = res.recentQuestions;
              });
          });
        });

        $scope.gotQuestion = false;
        growl.success("ASK_MESSAGE_SAVED",{title: "ASK_MESSAGE_SAVED_TITLE"});
        $scope.$broadcast('show-errors-reset');


      };

    $scope.closeBoxes = function () {
      $scope.gotQuestion = false;
    };


})

.animation('.slide', function() {
  var NG_HIDE_CLASS = 'ng-hide';
  return {
    beforeAddClass: function(element, className, done) {
      if(className === NG_HIDE_CLASS) {
        element.slideUp(done);
      }
    },
    removeClass: function(element, className, done) {
      if(className === NG_HIDE_CLASS) {
        element.hide().slideDown(done);
      }
    }
  };
})




.directive('ngEsc', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress keyup", function (event) {
      if(event.which === 27) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEsc);
        });

        event.preventDefault();
      }
    });
  };
})

;

