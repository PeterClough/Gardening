/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryDefault){

  DiaryDefault.findByDiaryId = function(diaryId, cb) {

    DiaryDefault.find({"where":{"diaryId": diaryId}},
        function(err, cb2) {
          cb(null, cb2);
        });

  };

  DiaryDefault.remoteMethod(
      'findByDiaryId',
      {
        accepts: [{arg: 'diaryId', type: 'string'}],
        returns: {arg: 'diaryDefault', type: 'object'}
      }
  );

}
