module.exports = function(AnswerComment){


  AnswerComment.getAnswerComment = function(commentId, cb) {

    AnswerComment.find({
        where: {id: commentId},
        fields: ['comment', 'userId', 'created'],
        include: [
          {
            relation: 'user',
            scope: {
              fields: ['firstName', 'lastName']
            }
          }
        ]
      },
      function(err, cb2) {
         cb(null, cb2);
      });
  };

  AnswerComment.remoteMethod(
    'getAnswerComment',
    {
      accepts: {arg: 'commentId', type: 'string'},
      returns: {arg: 'answerComment', type: 'object'}
    }
  );


}
