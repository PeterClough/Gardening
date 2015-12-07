module.exports = function(AnswerRating){

  AnswerRating.userRated = function(answerId, userId, cb) {

    AnswerRating.find({
        where:{
          answerId: answerId,
          userId: userId
        }
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  AnswerRating.remoteMethod(
    'userRated',
    {
      accepts: [
        {arg: 'answerId', type: 'string'},
        {arg: 'userId', type: 'string'}
      ],
      returns: {arg: 'rated', type: 'object'}
    }
  );



  AnswerRating.deleteRating = function(answerId, userId, cb) {

    AnswerRating.delete({
        where:{
          answerId: answerId,
          userId: userId
        }
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  AnswerRating.remoteMethod(
    'deleteRating',
    {
      accepts: [
        {arg: 'answerId', type: 'string'},
        {arg: 'userId', type: 'string'}
      ],
      returns: {arg: 'deleted', type: 'object'}
    }
  );





}
