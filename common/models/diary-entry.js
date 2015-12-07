/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryEntry){

  DiaryEntry.findByDiaryId = function(diaryId, cb) {
    DiaryEntry.find({"where":{"diaryId": diaryId},
                      "order": "entryDate DESC",
                      "include": {
                        "relation": "diaryProgression",
                        "order": "entryDate DESC"
                      }
                    },
    function(err, cb2) {
      cb(null, cb2);
    });
  };

  DiaryEntry.remoteMethod(
      'findByDiaryId',
      {
        accepts: {arg: 'diaryId', type: 'string'},
        returns: {arg: 'diaryEntries', type: 'object'}
      }
  );

  DiaryEntry.objectId = function(cb) {

    var app = require('../../server/server');
    var ds = app.dataSources.db;
    var id = new ds.ObjectID();

    cb(null,id);
  };

  DiaryEntry.remoteMethod(
    'objectId',
    {
      returns: {arg: 'id', type: 'object'}
    }
  );

}
