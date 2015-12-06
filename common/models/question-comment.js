module.exports = function(QuestionComment){


  QuestionComment.getQuestionComment = function(commentId, cb) {
    console.log('about to get questionComment id: ', commentId);

    QuestionComment.find({
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

  QuestionComment.remoteMethod(
    'getQuestionComment',
    {
      accepts: {arg: 'commentId', type: 'string'},
      returns: {arg: 'questionComment', type: 'object'}
    }
  );


}
