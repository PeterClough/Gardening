/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryEntryImageDoc){

  DiaryEntryImageDoc.getIdsByDiaryEntryId = function(diaryEntryId, cb) {

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




  DiaryEntryImageDoc.deleteFiles = function(diaryEntryId, cb1) {

    var dEIModel = DiaryEntryImageDoc.app.models.DiaryEntryImage;


    DiaryEntryImageDoc.find({
        "fields": ['id','extension'],
        "where": {"diaryEntryId": diaryEntryId},
        "order": "uploaded DESC"
      },
      function(err, cb2) {
        var fileNames = [];
        cb2.forEach(function(file){
          fileNames.push(file.id+file.extension);
        });

        dEIModel.deleteFiles(fileNames, function(err, cb3){

          DiaryEntryImageDoc.destroyAll({ diaryEntryId: diaryEntryId},
            function(err, cb4) {

              cb1(null, cb4);

            });


        });


      });
  };


  DiaryEntryImageDoc.remoteMethod(
    'deleteFiles',
    {
      accepts: {arg: 'diaryEntryId', type: 'array'},
      returns: {arg: 'success', type: 'object'}
    }
  );






}
