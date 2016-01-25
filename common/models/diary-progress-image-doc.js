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

    var dPIModel = DiaryProgressImageDoc.app.models.DiaryProgressImage;


    DiaryProgressImageDoc.find({
        "fields": ['id','extension'],
        "where": {"diaryProgressId":{inq: diaryProgressIds}},
        "order": "uploaded DESC"
      },
      function(err, cb2) {
        var fileNames = [];
        cb2.forEach(function(file){
          fileNames.push(file.id+file.extension);
        });

        dPIModel.deleteFiles(fileNames, function(err, cb3){
          DiaryProgressImageDoc.destroyAll({ diaryProgressId: {inq: diaryProgressIds}},
            function(err, cb4) {
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
