module.exports = function(Tag){


  Tag.getAllTags = function(languageId, cb) {

    Tag.find({
        order: 'tag ASC',
        where: {languageId: languageId},
        fields: ['tag', 'id']
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  Tag.remoteMethod(
    'getAllTags',
    {
      accepts: {arg: 'languageId', type: 'string'},
      returns: {arg: 'allTags', type: 'object'}
    }
  );


  Tag.findByTagName = function(tag, languageId, cb) {

    Tag.find({ "where": {and:[{"tag": tag}, {"languageId": languageId}]} }, function(err, cb2) {
      cb(null, cb2);
    });
  };

  Tag.remoteMethod(
    'findByTagName',
    {
      accepts: [
        {arg: 'tag', type: 'string'},
        {arg: 'languageId', type: 'string'},

      ],
      returns: {arg: 'tag', type: 'object'}
    }
  );



  Tag.questionsByTag = function(tagId, cb) {

    Tag.find({
      where: {"id": tagId},
      fields: ['id'],
        include: [
          {
            relation: 'question',
            scope: {
              fields: ['question', 'created', 'userId', 'id'],
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
            }
          }
        ]
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  Tag.remoteMethod(
    'questionsByTag',
    {
      accepts: {arg: 'tagId', type: 'string'},
      returns: {arg: 'questionsByTag', type: 'object'}
    }
  );


}
