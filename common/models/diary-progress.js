/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryProgress){

  DiaryProgress.findByDiaryEntryId = function(diaryEntryId, cb) {
    DiaryProgress.find({ where: {diaryEntryId: diaryEntryId} }, function(err, cb2) {
      cb(null, cb2);
    });
  };

  DiaryProgress.remoteMethod(
      'findByDiaryEntryId',
      {
        accepts: [{arg: 'diaryEntryId', type: 'number'}],
        returns: {arg: 'diaryProgression', type: 'object'}
      }
  );




}