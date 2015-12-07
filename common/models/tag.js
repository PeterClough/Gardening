module.exports = function(Tag){


  Tag.getAllTags = function(cb) {

    Tag.find({
        order: 'tag ASC',
        fields: ['tag', 'id']
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  Tag.remoteMethod(
    'getAllTags',
    {
      returns: {arg: 'allTags', type: 'object'}
    }
  );


  Tag.findByTag = function(tag, cb) {

    Tag.find({ "where": {"tag": tag} }, function(err, cb2) {
      cb(null, cb2);
    });
  };

  Tag.remoteMethod(
    'findByTag',
    {
      accepts: {arg: 'tag', type: 'string'},
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
