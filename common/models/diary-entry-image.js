module.exports = function(DiaryEntryImage) {

  DiaryEntryImage.afterRemote('upload', function(ctx, res, next) {

    var ds = DiaryEntryImage.app.datasources.diaryEntryDS.settings;
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




};
