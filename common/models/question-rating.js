module.exports = function(QuestionRating){

  QuestionRating.userRated = function(questionId, userId, cb) {

    QuestionRating.find({
        where:{
          questionId: questionId,
          userId: userId
        }
      },
      function(err, cb2) {
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

    QuestionRating.delete({
        where:{
          questionId: questionId,
          userId: userId
        }
      },
      function(err, cb2) {
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
