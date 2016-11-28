module.exports = function(DiaryProgressImage) {

  var app;

  var async = require('async');
  var fs = require('fs');
  var AWS = require('aws-sdk');
  var path = require('path');

  DiaryProgressImage.disableRemoteMethod('download', true);
  DiaryProgressImage.disableRemoteMethod('removeFile', true);
  DiaryProgressImage.disableRemoteMethod('getFiles', true);
  DiaryProgressImage.disableRemoteMethod('getFile', true);

  DiaryProgressImage.on('attached', function () {
    app = DiaryProgressImage.app;

    AWS.config.update({
      accessKeyId: app.get('DiaryProgressImage').s3.accessKeyId,
      secretAccessKey: app.get('DiaryProgressImage').s3.secretAccessKey
    });

    AWS.config.region = app.get('DiaryProgressImage').s3.region;

  });

  DiaryProgressImage.afterRemote('upload', function (ctx, res, next) {
    //var header = ctx.req.headers['image-type'];

    var file = res.result.files.file[0];
    var ds = DiaryProgressImage.app.datasources.diaryProgressDS.settings;
    var fp = ds.root;
    var filePath = app.get('DiaryProgressImage').originalPath;
    var fileThumbPath = app.get('DiaryProgressImage').thumbPath;
    var fileLightboxPath = app.get('DiaryProgressImage').lightboxPath;
    var amazonDir = app.get('DiaryProgressImage').amazonDir;
    var originalFile = fp + "/"  + filePath + "/" + file.name;
    var smallWidth = app.get('DiaryProgressImage').smallWidth;
    var largeWidth = app.get('DiaryProgressImage').largeWidth;



    require('lwip').open(originalFile, function(err, image) {
      var fileThumbHeight = '';
      var fileThumbWidth = '';
      if (image.width() > image.height()) {
        fileThumbHeight = image.height()*smallWidth/image.width();
        fileThumbWidth = smallWidth;
      }
      else {
        fileThumbHeight = smallWidth; // square
        fileThumbWidth = image.width()*smallWidth/image.height();

      }
      var fileLightboxHeight = image.height()*largeWidth/image.width();
      var fileLightboxWidth = largeWidth;


      var fileExt = path.extname(file.name).replace(/^./, '');
      // can't use path.parse
      var fileName = file.name.substr(0, file.name.lastIndexOf('.'));



      var resize = [
        {fileWidth: 0, filePath: filePath, fileName: fileName, fileExt: fileExt, compression: ''},
        {fileWidth: fileThumbWidth, fileHeight: fileThumbHeight, filePath: fileThumbPath, fileName: fileName, fileExt: 'png', params:{compression: 'high'}},
        {fileWidth: fileLightboxWidth, fileHeight: fileLightboxHeight, filePath: fileLightboxPath, fileName: fileName, fileExt: 'png', params: {compression: 'high'}}
      ];






      var s3obj;

      async.eachSeries(resize, function (spec, cb) {
          if (spec.fileWidth === 0) {
            return cb();
          }


          image.clone(function(err, lightbox) {
            lightbox.batch()
              .resize(spec.fileWidth, spec.fileHeight)
              .writeFile(fp + "/"  + spec.filePath + "/" +spec.fileName + '.' + spec.fileExt, spec.fileExt, spec.params, function (err) {
                cb();
              });
          });

        },
        function (err) {
          if (err) {
            return next(err);
          }

          async.eachSeries(resize, function (spec, cb) {

              if (spec.fileWidth === 0) {
                return cb();
              }

              //Read the file
              fs.readFile(fp + "/"  + spec.filePath + "/" + spec.fileName + '.' + spec.fileExt, function (err, buffer) {

                s3obj = new AWS.S3(
                  {
                    params: {
                      Bucket: app.get('AWS_S3_BUCKET'),
                      Key: amazonDir + spec.filePath + '/' + spec.fileName + '.' + spec.fileExt,
                      ContentType: app.get('DiaryProgressImage').contentType,
                      ACL: 'public-read'
                    }
                  });
                // Upload the file to S3
                s3obj.upload({Body: buffer})
                  .on('httpUploadProgress', function (evt) {
                  }).send(function (err, data) {
                  if (err) {
                    return cb(err);
                  }

                  spec.aws = data;

                  cb();
                });
              });
            },
            function (err) {
              if (err) {
                return next(err);
              }

              // Return the files we've uploaded
              res.result.files.file[0].path = filePath;
              res.result.files.file[0].resize = resize;


              //Return success to the client.  No need to wait for the files to be deleted.
              next();

              // Delete the local storage
              async.eachSeries(resize, function (spec, cb) {
                  fs.unlink(fp + "/"  + spec.filePath + "/" + spec.fileName + '.' + spec.fileExt, function (err) {
                    if (err) {
                      return cb(err);
                    }

                    cb();
                  })
                },
                function (err) {
                  if (err) {
                  }
                });
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
