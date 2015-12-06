/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryProgressImageDoc){

  DiaryProgressImageDoc.getIdsByDiaryProgressId = function(diaryProgressId, cb) {
    console.log("DiaryProgressImageDoc.getIdsByDiaryProgressId: " + diaryProgressId)
    DiaryProgressImageDoc.find({
        "fields": {"id": true, "extension": true},
        "where": {"diaryProgressId": diaryProgressId},
        "order": "uploaded DESC"
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  DiaryProgressImageDoc.remoteMethod(
    'getIdsByDiaryProgressId',
    {
      accepts: {arg: 'diaryProgressId', type: 'string'},
      returns: {arg: 'diaryProgressImageIds', type: 'object'}
    }
  );

  DiaryProgressImageDoc.objectId = function(cb) {

    var app = require('../../server/server');
    var ds = app.dataSources.db;
    var id = new ds.ObjectID();

    cb(null,id);
  };

  DiaryProgressImageDoc.remoteMethod(
    'objectId',
    {
      returns: {arg: 'id', type: 'object'}
    }
  );

}
