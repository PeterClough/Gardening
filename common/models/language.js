/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(Language){



  Language.greet = function(cb) {
    cb(null, 'Greetings... ');
  }

  Language.remoteMethod(
      'greet',
      {
        returns: {arg: 'greeting', type: 'string'}
      }
  );


  Language.getList = function(cb) {
    Language.find({ fields: {name: true, code: true} }, function(err, cb2) {

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