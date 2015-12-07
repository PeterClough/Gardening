module.exports = function(Question){

  Question.recentQuestions = function(cb) {

    Question.find({
        fields: ['question', 'created', 'userId', 'id'],
        order: "created DESC",
        limit: 30,
        include: [
          {
            relation: 'user',
            scope: {
              fields: ['firstName', 'lastName']
            }
          },
          {
            relation: 'tag',
            scope: {
              fields: ['tag']
            }
          }
        ]
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  Question.remoteMethod(
    'recentQuestions',
    {
      returns: {arg: 'recentQuestions', type: 'object'}
    }
  );



  Question.getQuestion = function(questionId, cb) {

    Question.find({
        where: {id: questionId},
        fields: ['question', 'created', 'userId', 'id'],
        include: [
          {
            relation: 'user',
            scope: {
              fields: ['firstName', 'lastName']
            }
          },
          {
            relation: 'questionComment',
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
            relation: 'answer',
            scope: {
              fields: ['answer', 'created', 'userId', 'id'],
              include: [
                {
                  relation: 'user',
                  scope: {
                    fields: ['firstName', 'lastName']
                  }
                },
                {
                  relation: 'rating',
                  scope: {
                    fields: ['rating', 'userId']
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
                }
              ]
            }
          },
          {
            relation: 'tag',
            scope: {
              fields: ['tag']
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

  Question.remoteMethod(
    'getQuestion',
    {
      accepts: {arg: 'questionId', type: 'string'},
      returns: {arg: 'question', type: 'object'}
    }
  );


}
