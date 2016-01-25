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



  DiaryProgress.deleteProgress = function(id, isEntry, cb) {
     var Q = require('q');

    var dPIDModel = DiaryProgress.app.models.DiaryProgressImageDoc;

    var found = [];
    if (isEntry===true) {
      var diaryProgressIds = [];
      var progress = Q.defer();
      found.push(progress.promise);
      DiaryProgress.find({ fields: ['id'],  where: {diaryEntryId: id}}, function (err, cb2) {
        if(cb2.length !==0) {
          cb2.forEach(function (val) {
            diaryProgressIds.push(val.id);
          });
        }
        progress.resolve(diaryProgressIds);
      });

    }
    else {
      var diaryProgressIds = id;
    }


    Q.all(found)
      .then(function (res) {
          dPIDModel.deleteFiles(diaryProgressIds, function (err, cb3) {
            DiaryProgress.destroyAll({ id: {inq: diaryProgressIds}},
              function(err, cb4) {
                cb(null, cb4);
              });

          });
      });



  };

  DiaryProgress.remoteMethod(
    'deleteProgress',
    {
      accepts: [{arg: 'id', type: 'id'}, {arg: 'isEntry', type: 'boolean'}],
      returns: {arg: 'diaryProgression', type: 'object'}
    }
  );



}
