module.exports = function(DiaryProgressImage) {

  DiaryProgressImage.afterRemote('upload', function(ctx, res, next) {

    var ds = DiaryProgressImage.app.datasources.diaryProgressDS.settings;
    var file = res.result.files.file[0];
    var fp = ds.root;

    var filePath = fp + "/" + file.container + "/" + file.name;
    var fileThumbPath = fp + "/"  + "thumbs/" + file.name;
    var fileLightboxPath = fp + "/"  + "lightbox/" + file.name;


    // obtain an image object:
      require('lwip').open(filePath, function(err, image){

        var fileHeight = image.height();
        var fileWidth = image.width();

        fileHeight = fileHeight*400/fileWidth;
        fileWidth = 400;

        image.clone(function(err, thumb) {
          thumb.batch()
            .resize(34, 34)
            .writeFile(fileThumbPath, function (err) {
            });
        });

        image.clone(function(err, lightbox) {
          lightbox.batch()
            .resize(fileWidth, fileHeight)
            .writeFile(fileLightboxPath, function (err) {
              next(err);
            });
        });

     });
  });



  DiaryProgressImage.deleteFiles = function(fileNames, cb) {

     var fs = require('fs');
    var Q = require('q');

    var ds = DiaryProgressImage.app.datasources.diaryProgressDS.settings;
    var fp = ds.root;

    var filePath = fp + "/" + "original/";
    var fileThumbPath = fp + "/"  + "thumbs/";
    var fileLightboxPath = fp + "/"  + "lightbox/";

    var deleted = [];

    fileNames.forEach(function(fileName) {
      var original = Q.defer();
      deleted.push(original.promise);
      fs.unlink(filePath+fileName, function (err) {
        if (err) {
          original.reject(err);
        }
        else {
          original.resolve(filePath+fileName);
        }
      });
      var thumb = Q.defer();
      deleted.push(thumb.promise);
      fs.unlink(fileThumbPath+fileName, function (err) {
        if (err) {
          thumb.reject(err);
        }
        else {
          thumb.resolve(fileThumbPath+fileName);
        }
      });
      var lightbox = Q.defer();
      deleted.push(lightbox.promise);
      fs.unlink(fileLightboxPath+fileName, function (err) {
        if (err) {
          lightbox.reject(err);
        }
        else {
          lightbox.resolve(fileLightboxPath+fileName);
        }
      });


    });

    Q.all(deleted)
      .then(function (res) {
        cb(null,true);
      });
  };

  DiaryProgressImage.remoteMethod(
    'deleteFiles',
    {
      accepts: {arg: 'fileNames', type: 'array'},
      returns: {arg: 'success', type: 'object'}
    }
  );



};
