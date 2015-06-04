module.exports = function(DiaryEntryImage) {

  DiaryEntryImage.afterRemote('upload', function(ctx, res, next) {



    var file = res.result.files.file[0];
    console.log("file uploaded", JSON.stringify(file));


    var filePath = "../client/src/storage/assets/images/diary_entry/" + file.container + "/" + file.name;
    var fileThumbPath = "../client/src/storage/assets/images/diary_entry/"  + "thumbs/" + file.name;
    var fileLightboxPath = "../client/src/storage/assets/images/diary_entry/"  + "lightbox/" + file.name;

    setTimeout(function() {

      // obtain an image object:
    require('lwip').open(filePath, function(err, image){

      console.log('in image open err', err);

      var fileHeight = image.height();
      var fileWidth = image.width();

      fileHeight = fileHeight*400/fileWidth;
      fileWidth = 400;

      image.clone(function(err, thumb) {
        thumb.batch()
          .resize(34, 34)
          .writeFile(fileThumbPath, function (err) {
            console.log("Thumb", fileThumbPath);
          });
      });

      image.clone(function(err, lightbox) {
        lightbox.batch()
          .resize(fileWidth, fileHeight)
          .writeFile(fileLightboxPath, function (err) {
            console.log("Lightbox", fileLightboxPath);
            next(err);
          });
      });



     });
    },1000);

  });




};
