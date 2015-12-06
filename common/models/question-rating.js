module.exports = function(QuestionRating){

  QuestionRating.userRated = function(questionId, userId, cb) {
    console.log('about to get check rated');

    QuestionRating.find({
        where:{
          questionId: questionId,
          userId: userId
        }
      },
      function(err, cb2) {
        console.log(err);
        console.log("cb2");
        console.log(cb2);
        cb(null, cb2);
      });
  };

  QuestionRating.remoteMethod(
    'userRated',
    {
      accepts: [
        {arg: 'questionId', type: 'string'},
        {arg: 'userId', type: 'string'}
      ],
      returns: {arg: 'rated', type: 'object'}
    }
  );



  QuestionRating.deleteRating = function(questionId, userId, cb) {
    console.log('about to delete rating');

    QuestionRating.delete({
        where:{
          questionId: questionId,
          userId: userId
        }
      },
      function(err, cb2) {
        console.log(err);
        console.log("cb2");
        console.log(cb2);
        cb(null, cb2);
      });
  };

  QuestionRating.remoteMethod(
    'deleteRating',
    {
      accepts: [
        {arg: 'questionId', type: 'string'},
        {arg: 'userId', type: 'string'}
      ],
      returns: {arg: 'deleted', type: 'object'}
    }
  );





}
