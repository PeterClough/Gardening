angular.module( 'ask.view', [
  'ui.router',
  'pascalprecht.translate',
  'ui.bootstrap.showErrors',
  'ngTagsInput',
  'ngAnimate'
])


.config(function config( $stateProvider ) {

  $stateProvider.state( 'ask.view', {
    url: '/view/:questionId',
    views: {
      "ask": {
        controller: 'AskViewCtrl',
        templateUrl: 'ask/view/view.tpl.html',
      }
    },
    params: {
      questionId  : {
        value : ''
      }
    },

    data:{ pageTitle: 'View Question' }
  });
})



.controller( 'AskViewCtrl', function AskViewCtrl( $scope, $translate, $filter, $timeout, $stateParams, Question, QuestionRating, QuestionComment, Answer, AnswerRating, AnswerComment, User ) {

   $scope.showCard = false;
    $scope.gotAnswer = false;
    $scope.gotQuestionComment = false;
    $scope.gotAnswerComment = [];
    $scope.answerAlreadyRatedUp = [];
    $scope.answerAlreadyRatedDown= [];
    $scope.loggedIn = User.isAuthenticated();
    var userId = User.getCurrentId();

    Question.getQuestion({"questionId":$stateParams.questionId})
      .$promise.then(function (cb) {
        $scope.question = cb.question;
        var total=0;
        for(var i in $scope.question[0].rating) {
          total += $scope.question[0].rating[i].rating;
          if ($scope.question[0].rating[i].userId === userId){
            $scope.questionAlreadyRatedUp = ($scope.question[0].rating[i].rating===1);
            $scope.questionAlreadyRatedDown = ($scope.question[0].rating[i].rating===-1);
          }
        }
        $scope.question[0].rating = total;
        // Answer ratings

        $scope.question[0].answer.forEach(function(answer, index) {
          var total=0;
          var alreadyRatedUp = false;
          var alreadyRatedDown = false;
          for(var i in answer.rating) {
            total += answer.rating[i].rating;
            if (answer.rating[i].userId === userId){
              if (answer.rating[i].rating===1) {
                alreadyRatedUp = true;
              }
              else if (answer.rating[i].rating===-1) {
                alreadyRatedDown = true;
              }

            }
          }
          $scope.answerAlreadyRatedUp.push(alreadyRatedUp);
          $scope.answerAlreadyRatedDown.push(alreadyRatedDown);
          answer.rating = total;
        });


        $timeout(function(){
          $scope.showCard = true;
        },100);

      });


      $scope.getAnswer = function() {

        $scope.answer = {
          "answer" : "",
          "rating" : 0
        };
        $scope.gotAnswer = true;
        setSliders(true, false, -1);

        event.preventDefault();
      };


      $scope.submitAnswer = function() {
        $scope.answer.userId = userId;
        $scope.answer.questionId = $scope.question[0].id;
        $scope.answer.created = $scope.answer.updated = $filter('date')(new Date(), 'medium');
        Answer.upsert($scope.answer)
          .$promise.then(function(res) {
            $scope.answer.id = res.id;
            Answer.getAnswer({"answerId":$scope.answer.id})
              .$promise.then(function (cb) {
                var answer = cb.answer[0];
                answer.rating = 0;
                $scope.question[0].answer.push(answer);
                $scope.gotAnswer = false;
                $scope.messageSaved = true;
              });
         });
        $scope.$broadcast('show-errors-reset');

      };


      $scope.getQuestionComment = function() {

        $scope.questionComment = {
          "comment" : ""
        };
        $scope.gotQuestionComment = true;
        setSliders(true, true, -1);

        event.preventDefault();

      };


      $scope.submitQuestionComment = function() {
        $scope.questionComment.userId = userId;
        $scope.questionComment.questionId = $scope.question[0].id;
        $scope.questionComment.created = $scope.questionComment.updated = $filter('date')(new Date(), 'medium');
        QuestionComment.upsert($scope.questionComment)
          .$promise.then(function(res) {
            $scope.questionComment.id = res.id;
            QuestionComment.getQuestionComment({"commentId":$scope.questionComment.id})
              .$promise.then(function (cb) {
                var questionComment = cb.questionComment[0];
                $scope.question[0].questionComment.push(questionComment);
                $scope.gotQuestionComment = false;
                $scope.messageSaved = true;
              });
          });
        $scope.$broadcast('show-errors-reset');

      };


      $scope.getAnswerComment = function(index) {
        $scope.answerComment = {
          "comment" : ""
        };
        $scope.gotAnswerComment[index] = true;
        setSliders(false, true, index);

        event.preventDefault();

      };


      $scope.submitAnswerComment = function(index, answerId) {
        $scope.answerComment.userId = userId;
        $scope.answerComment.answerId = answerId;
        $scope.answerComment.created = $scope.answerComment.updated = $filter('date')(new Date(), 'medium');
        AnswerComment.upsert($scope.answerComment)
          .$promise.then(function(res) {
            $scope.answerComment.id = res.id;
            AnswerComment.getAnswerComment({"commentId":$scope.answerComment.id})
              .$promise.then(function (cb) {
                var answerComment = cb.answerComment[0];
                $scope.question[0].answer[index].answerComment.push(answerComment);
                $scope.gotAnswerComment[index] = false;
                $scope.messageSaved = true;
              });
          });
        $scope.$broadcast('show-errors-reset');

      };


      $scope.rateQuestion = function(questionId, rating) {
        $scope.questionAlreadyRatedUp = $scope.questionAlreadyRatedDown = false;
        $scope.rating=rating;
        $scope.questionId=questionId;
        //check the ratings table to see if record exists for user and questionId
        QuestionRating.userRated({"questionId":questionId,"userId": userId})
          .$promise.then(function (cb) {
            //if not exists upsert record
            if (cb.rated.length ===0){
              var rating = {"userId": userId, "questionId": $scope.questionId, "rating": $scope.rating};
              QuestionRating.upsert(rating)
                .$promise.then(function(res) {
                  $scope.question[0].rating += $scope.rating;
                  $scope.questionAlreadyRatedUp = ($scope.rating===1);
                  $scope.questionAlreadyRatedDown = ($scope.rating===-1);
                });
            }
            //if exists and is rated up return already rated up
            else if (cb.rated[0].rating ===1 && $scope.rating===1 ) {
              $scope.questionAlreadyRatedUp = true;

            }
            //if exists and is rated down return already rated down
            else if (cb.rated[0].rating ===-1 && $scope.rating===-1 ) {
              $scope.questionAlreadyRatedDown = true;

            }
            //if rating up and exists and is rated down delete record
            else if (cb.rated[0].rating ===-1 && $scope.rating===1) {
              QuestionRating.delete({"id":cb.rated[0].id})
                .$promise.then(function (cb) {
                  $scope.question[0].rating += $scope.rating;
                });

            }
            //if exists and is rated down delete record, finish
            else if (cb.rated[0].rating ===1 && $scope.rating===-1) {
              QuestionRating.delete({"id":cb.rated[0].id})
                .$promise.then(function (cb) {
                   $scope.question[0].rating += $scope.rating;
                });

            }
          });
        event.preventDefault();
      };




      $scope.rateAnswer = function(index, answerId, rating) {
        $scope.rating=rating;
        $scope.index=index;
        $scope.answerAlreadyRatedUp[$scope.index] = $scope.answerAlreadyRatedDown[$scope.index] = false;
        //check the ratings table to see if record exists for user and answerId
        AnswerRating.userRated({"answerId":answerId,"userId": userId})
          .$promise.then(function (cb) {
              //if not exists upsert record
            if (cb.rated.length ===0){
            var rating = {"userId": userId, "answerId": $scope.question[0].answer[$scope.index].id, "rating": $scope.rating};
              AnswerRating.upsert(rating)
                .$promise.then(function(res) {
                  $scope.question[0].answer[$scope.index].rating += $scope.rating;
                  $scope.answerAlreadyRatedUp[$scope.index] = ($scope.rating===1);
                  $scope.answerAlreadyRatedDown[$scope.index] = ($scope.rating===-1);
                });
            }
            //if exists and is rated up return already rated up
            else if (cb.rated[0].rating ===1 && $scope.rating===1 ) {
              $scope.answerAlreadyRatedUp[$scope.index] = true;

            }
            //if exists and is rated down return already rated down
            else if (cb.rated[0].rating ===-1 && $scope.rating===-1 ) {
              $scope.answerAlreadyRatedDown[$scope.index] = true;

            }
            //if rating up and exists and is rated down delete record
            else if (cb.rated[0].rating ===-1 && $scope.rating===1) {
              AnswerRating.delete({"id":cb.rated[0].id})
                .$promise.then(function (cb) {
                  $scope.question[0].answer[$scope.index].rating += $scope.rating;
                });

            }
            //if exists and is rated down delete record, finish
            else if (cb.rated[0].rating ===1 && $scope.rating===-1) {
              AnswerRating.delete({"id":cb.rated[0].id})
                .$promise.then(function (cb) {
                   $scope.question[0].answer[$scope.index].rating += $scope.rating;
                });

            }
          });
        event.preventDefault();
      };

    $scope.closeBoxes = function () {
      setSliders(false, true, -1);
     };




    function setSliders (isQuestion, isComment, index) {

      if (isQuestion) {
        if (isComment) {
          $scope.gotAnswer = false;
        }
        else {
          $scope.gotQuestionComment = false;
        }
        $scope.gotAnswerComment.forEach(function(ac, i) {
          $scope.gotAnswerComment[i] = false;
        });
      }
      else {

        $scope.gotAnswer = $scope.gotQuestionComment = false;
        $scope.gotAnswerComment.forEach(function(ac, i) {
          if (i != index){
            $scope.gotAnswerComment[i] = false;
          }
        });
    }
      $scope.$broadcast('show-errors-reset');
    }



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
