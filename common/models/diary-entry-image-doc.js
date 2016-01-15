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
    console.log("DiaryEntryImageDoc.deleteFiles: " + diaryEntryId);

    var dEIModel = DiaryEntryImageDoc.app.models.DiaryEntryImage;


    DiaryEntryImageDoc.find({
        "fields": ['id','extension'],
        "where": {"diaryEntryId": diaryEntryId},
        "order": "uploaded DESC"
      },
      function(err, cb2) {
        console.log('DEIM.deleteFiles', cb2);
        var fileNames = [];
        cb2.forEach(function(file){
          fileNames.push(file.id+file.extension);
        });
        console.log('DEIM.fileNames', fileNames);

        dEIModel.deleteFiles(fileNames, function(err, cb3){

          console.log('cb3', cb3);
          console.log('About to DiaryEntryImageDoc.delete', diaryEntryId);

          DiaryEntryImageDoc.destroyAll({ diaryEntryId: diaryEntryId},
            function(err, cb4) {

              console.log('DiaryEntryImageDoc.destroyAll', cb4);
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
