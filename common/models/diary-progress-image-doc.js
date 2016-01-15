/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(DiaryProgressImageDoc){

  DiaryProgressImageDoc.getIdsByDiaryProgressId = function(diaryProgressId, cb) {
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


  DiaryProgressImageDoc.deleteFiles = function(diaryProgressIds, cb1) {
    console.log("DiaryProgressImageDoc.deleteFiles: " + diaryProgressIds);

    var dPIModel = DiaryProgressImageDoc.app.models.DiaryProgressImage;


    DiaryProgressImageDoc.find({
        "fields": ['id','extension'],
        "where": {"diaryProgressId":{inq: diaryProgressIds}},
        "order": "uploaded DESC"
      },
      function(err, cb2) {
        console.log('DPIM.deleteFiles', cb2);
        var fileNames = [];
        cb2.forEach(function(file){
          fileNames.push(file.id+file.extension);
        });
        console.log('DPIM.fileNames', fileNames);

        dPIModel.deleteFiles(fileNames, function(err, cb3){

          console.log('cb3', cb3);
          console.log('About to DiaryProgressImageDoc.delete', diaryProgressIds);

          DiaryProgressImageDoc.destroyAll({ diaryProgressId: {inq: diaryProgressIds}},
            function(err, cb4) {

              console.log('DiaryProgressImageDoc.destroyAll', cb4);
              cb1(null, cb4);

            });


        });


      });
  };

  DiaryProgressImageDoc.remoteMethod(
    'deleteFiles',
    {
      accepts: {arg: 'diaryProgressIds', type: 'array'},
      returns: {arg: 'success', type: 'object'}
    }
  );

}
