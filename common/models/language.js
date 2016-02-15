/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(Language){

  Language.getList = function(cb) {
      Language.find({ fields: ['name', 'code', 'id'] }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  Language.remoteMethod(
      'getList',
      {
        returns: {arg: 'languages', type: 'object'}
      }
  );




}
