/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(PlantFamily) {


  PlantFamily.getList = function (languageId, cb) {

    PlantFamily.find({
      where: {languageId: languageId},
      order: "name asc",
      fields: ['name', 'id']
    }, function (err, cb2) {
      cb(null, cb2);
    });
  };


  PlantFamily.remoteMethod(
    'getList',
    {
      accepts: {arg: 'languageId', type: 'string'},
      returns: {arg: 'plantFamilies', type: 'object'}
    }
  );


  PlantFamily.getPlantFamily = function (plantFamilyName, cb) {

    var pattern = new RegExp('.*'+plantFamilyName+'.*', "i"); /* case-insensitive RegExp search */


    PlantFamily.find({
      where: {name: pattern},
      fields: ['name', 'id'],
      include: [
        {
          relation: 'plantFamilyVersion',
          scope: {
            where: {state: 1},
            fields: ['plantingAdvice', 'created', 'id', 'authorId'],
            include: [
              {
                relation: 'author',
                scope: {
                  fields: ['firstName', 'lastName', 'profilePicture']
                }
              },
              {
                relation: 'helps',
                scope: {
                  fields: ['name', 'id']
                }
              },
              {
                relation: 'helpedBy',
                scope: {
                  fields: ['name', 'id']
                }
              },
              {
                relation: 'badFor',
                scope: {
                  fields: ['name', 'id']
                }
              }
            ]
          }
        }
      ]
      }, function (err, cb2) {

         cb(null, cb2);
    });
  };


  PlantFamily.remoteMethod(
    'getPlantFamily',
    {
      accepts: {arg: 'plantFamilyName', type: 'string'},
      returns: {arg: 'plantFamily', type: 'object'}
    }
  );



  PlantFamily.getReviewList = function (languageId, cb) {

    PlantFamily.find({
      where: {languageId: languageId},
      order: "name asc",
      fields: ['name', 'id'],
      include: [
        {
          relation: 'plantFamilyVersion',
          scope: {
            where: {state: 0},
            fields: ['created', 'authorId', 'id'],
            include: [
              {
                relation: 'author',
                scope: {
                  fields: ['firstName', 'lastName', 'profilePicture']
                }
              }
            ]
          }
        }
      ]

    }, function (err, cb2) {
      cb(null, cb2);
    });
  };


  PlantFamily.remoteMethod(
    'getReviewList',
    {
      accepts: {arg: 'languageId', type: 'string'},
      returns: {arg: 'plantFamilyReviews', type: 'object'}
    }
  );










};
