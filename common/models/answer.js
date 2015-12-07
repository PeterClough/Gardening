module.exports = function(Answer){


  Answer.getAnswer = function(answerId, cb) {

    Answer.find({
        where: {id: answerId},
        fields: ['answer', 'created', 'userId', 'id'],
        include: [
          {
            relation: 'user',
            scope: {
              fields: ['firstName']
            }
          },
          {
            relation: 'answerComment',
            scope: {
              fields: ['comment', 'created', 'userId', 'id'],
              include: [
                {
                  relation: 'user',
                  scope: {
                    fields: ['firstName', 'lastName']
                  }
                }
              ]
            }
          },
          {
            relation: 'rating',
            scope: {
              fields: ['rating', 'userId']
            }

          }
        ]
      },
      function(err, cb2) {
         cb(null, cb2);
      });
  };

  Answer.remoteMethod(
    'getAnswer',
    {
      accepts: {arg: 'answerId', type: 'string'},
      returns: {arg: 'answer', type: 'object'}
    }
  );


}
