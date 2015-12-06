/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(Diary){

  Diary.findByUserId = function(userId, cb) {
    console.log('about to Diary.find with :'+ userId);


    Diary.find({ "where": {"userId": userId} }, function(err, cb2) {
        console.log('userId:'+ userId);
        console.log(err);
        console.log("cb2");
        console.log(cb2);
        cb(null, cb2);
    });
  };

  Diary.remoteMethod(
      'findByUserId',
      {
        accepts: {arg: 'userId', type: 'string'},
        returns: {arg: 'diary', type: 'object'}
      }
  );


}
