angular.module( 'ask.list', [
  'ui.router',
  'pascalprecht.translate',
  'ui.bootstrap.showErrors',
  'ngTagsInput'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'ask.list', {
    url: '/list/:tagId',
    views: {
      "ask": {
        controller: 'AskListCtrl',
        templateUrl: 'ask/list/list.tpl.html'
      },
      params: {
        tagId  : {
          value : ''
        }
      }
    },
    data:{ pageTitle: 'Ask Questions' }
  });
})

.controller( 'AskListCtrl', function AskListCtrl( $scope, $rootScope, $translate, $filter, $timeout, $stateParams, $q, Question, Tag, QuestionTagJunction, User ) {


    console.log("in ask ctrl");
    $scope.gotQuestion = false;
    $scope.showCard = false;
    $scope.loggedIn = User.isAuthenticated();
    var userId = User.getCurrentId();
    console.log('userId', userId);
    console.log('$stateParams.tagId', $stateParams.tagId);

    if ($stateParams.tagId === '') {
      $translate('ASK_RECENT_HEADER').then(function (translation) {
        $scope.listHeader = translation;
      });
    }
    else
    {
    $translate('ASK_BY_TAG_HEADER').then(function (translation) {
      $scope.listHeader = translation;
    });
    Tag.findById({ id: $stateParams.tagId })
      .$promise.then(function(cb) {
        $scope.tagHeader = cb.tag;
      });
    }


    $rootScope.$on('$translateChangeSuccess', function (tagId) {
      if (tagId==='') {
        $translate('ASK_RECENT_HEADER').then(function (translation) {
          $scope.listHeader = translation;
        });
      }
      else
      {
        $translate('ASK_BY_TAG_HEADER').then(function (translation) {
          $scope.listHeader = translation;
        });

      }
    });

    if ( $stateParams.tagId === '' ){

      Question.recentQuestions()
        .$promise.then(function (cb) {
          console.log("question success", cb);
          $scope.questions = cb.recentQuestions;
          console.log("$scope.questions", $scope.questions);
          $timeout(function(){
            $scope.showCard = true;
          },100);

        });

    }
    else {
      getQuestionsByTag($stateParams.tagId);
    }

    function getQuestionsByTag(tagId) {

      Tag.questionsByTag({"tagId":tagId})
        .$promise.then(function (cb) {
          console.log("questions by tag success", cb);


          $scope.questions = cb.questionsByTag[0].question;

          console.log("$scope.questions", $scope.questions);
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
      $scope.gotQuestion = true;
    };


    Tag.getAllTags()
      .$promise.then(function (cb) {
        console.log("getAllTags success", cb);
        var tagText = [];
        cb.allTags.forEach( function(tag) {
          tagText.push({text: tag.tag});
        });
        $scope.allTags = tagText;
        console.log($scope.allTags);
      });


    $scope.tagAdding = function(tag) {
      if ($scope.allTags.indexOf(tag) === -1){
        console.log('New Tag adding: ', tag);
      }
    };





    $scope.submitQuestion = function() {

      $scope.question.rating = 0;
      $scope.question.userId = userId;
      $scope.question.created = $scope.question.updated = $filter('date')(new Date(), 'medium');
      $scope.question.languageId = "1";
      console.log("submitting question", $scope.question);
      Question.upsert($scope.question)
        .$promise.then(function(res) {

          console.log("Question.upsert.res", res);

          console.log("$scope.question.tags", $scope.question.tags);

          //save tags
          var questionTagJunction = {questionId: res.id};
          var requests = [];
          angular.forEach($scope.question.tags, function(tag) {
            console.log('Saving tag: ', tag);


            var deferredTagJunction = $q.defer();
            requests.push(deferredTagJunction.promise);

            var deferredTag = $q.defer();
            requests.push(deferredTag.promise);

            //create saveTag so screen doesn't lose data
            var saveTag={tag:tag.text};
            if (!("id" in tag)){
               Tag.findByTag({"tag":tag.text})
                .$promise.then(function (cb) {
                  console.log("tag found", cb);
                  if (cb.tag.length===0) {
                    saveTag.created = saveTag.updated = $filter('date')(new Date(), 'medium');

                    console.log('cb length 0 pushed deferredTag', deferredTag);
                    Tag.upsert(saveTag)
                      .$promise.then(function (res) {
                          deferredTag.resolve(res);
                          console.log('tag upserted: ', tag);
                          //set the tag id
                          tag.id = res.id;
                          questionTagJunction.tagId = tag.id;
                          QuestionTagJunction.upsert(questionTagJunction)
                                .$promise.then(function (res) {
                                  deferredTagJunction.resolve(res);
                                  console.log("questionTagJunction", res);
                                  console.log(res);
                                });


                      });
                  }
                  else {
                    deferredTag.resolve();
                    questionTagJunction.tagId = cb.tag[0].id;
                    QuestionTagJunction.upsert(questionTagJunction)
                      .$promise.then(function (res) {
                        deferredTagJunction.resolve(res);
                        console.log("questionTagJunction", res);
                        console.log(res);
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
                  console.log("questionTagJunction", res);
                  console.log(res);
                });
            }

          });

          $q.all(requests).then(function() {
            requests.forEach( function(request) {
              console.log('request ', request);

            });
            console.log('requests in $q.all', requests, requests.length);
            Question.recentQuestions()
              .$promise.then(function (res) {
                console.log("question success");
                console.log(res);
                $scope.questions = res.recentQuestions;
              });
          });
        });

        $scope.gotQuestion = false;
        $scope.messageSaved = true;
        $scope.$broadcast('show-errors-reset');


      };

    $scope.closeBoxes = function () {
      $scope.gotQuestion = false;
      $scope.$broadcast('show-errors-reset');
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

