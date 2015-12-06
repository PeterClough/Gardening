/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(SystemLanguage){

  SystemLanguage.getList = function(cb) {
      SystemLanguage.find({ fields: {name: true, code: true} }, function(err, cb2) {
         cb(null, cb2);
    });
  };

  SystemLanguage.remoteMethod(
      'getList',
      {
        returns: {arg: 'systemLanguages', type: 'object'}
      }
  );




}
