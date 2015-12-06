module.exports = function(AnswerRating){

  AnswerRating.userRated = function(answerId, userId, cb) {
    console.log('about to get check rated');

    AnswerRating.find({
        where:{
          answerId: answerId,
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
    console.log('about to delete rating');

    AnswerRating.delete({
        where:{
          answerId: answerId,
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
