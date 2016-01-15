/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryEntry){

  DiaryEntry.findByDiaryId = function(diaryId, cb) {
    DiaryEntry.find({"where":{"diaryId": diaryId},
                      "order": "entryDate ASC",
                      "include": {
                        "relation": "diaryProgression",
                        "order": "entryDate ASC"
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



  DiaryEntry.deleteEntry = function(entryId, cb) {

    console.log('setting dPModel');
    var dPModel = DiaryEntry.app.models.DiaryProgress;
    var dEIDModel = DiaryEntry.app.models.DiaryEntryImageDoc;

    dPModel.deleteProgress(entryId, true, function(err, cb1){
      console.log('completed callback', cb1);


      dEIDModel.deleteFiles(entryId, function (err, cb3) {

        DiaryEntry.destroyById(entryId,
          function(err, cb2) {

            console.log(' DiaryEntry.delete', cb2);
            cb(null, cb2);
          });

      });


    });
    console.log('after dPModel.deleteProgress');


  };

  DiaryEntry.remoteMethod(
    'deleteEntry',
    {
      accepts: {arg: 'entryId', type: 'string'},
      returns: {arg: 'diaryEntries', type: 'object'}
    }
  );





}
