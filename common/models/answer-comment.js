module.exports = function(AnswerComment){


  AnswerComment.getAnswerComment = function(commentId, cb) {
    console.log('about to get answerComment id: ', commentId);

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
        console.log(err);
        console.log("cb2");
        console.log(cb2);
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
