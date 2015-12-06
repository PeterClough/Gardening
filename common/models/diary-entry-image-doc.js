/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryEntryImageDoc){

  DiaryEntryImageDoc.getIdsByDiaryEntryId = function(diaryEntryId, cb) {
    console.log("DiaryEntryImageDoc.getIdsByDiaryEntryId: " + diaryEntryId)
    DiaryEntryImageDoc.find({
        "fields": {"id": true, "extension": true},
        "where": {"diaryEntryId": diaryEntryId},
        "order": "uploaded DESC"
      },
      function(err, cb2) {
        cb(null, cb2);
      });
  };

  DiaryEntryImageDoc.remoteMethod(
    'getIdsByDiaryEntryId',
    {
      accepts: {arg: 'diaryEntryId', type: 'string'},
      returns: {arg: 'diaryEntryImageIds', type: 'object'}
    }
  );

  DiaryEntryImageDoc.objectId = function(cb) {

    var app = require('../../server/server');
    var ds = app.dataSources.db;
    var id = new ds.ObjectID();

    cb(null,id);
  };

  DiaryEntryImageDoc.remoteMethod(
    'objectId',
    {
      returns: {arg: 'id', type: 'object'}
    }
  );

}
