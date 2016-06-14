/**
 * Created by peterclough on 13/09/2014.
 */
module.exports = function(Diary){


  Diary.findByUserId = function(userId, cb) {

    Diary.find({ "where": {"userId": userId} }, function(err, cb2) {
      cb(null, cb2);
    });
  };

  Diary.remoteMethod(
    'findByUserId',
    {
      accepts: {arg: 'userId', type: 'string'},
      returns: {arg: 'diary', type: 'object'}
    }
  );



  Diary.getDiary = function(userId, cb) {

    Diary.find({
      where: {id: userId},
      order: "entryDate ASC",
      include: [
        {
          relation: 'diaryDefault',
          scope: {
            fields: ['diaryId', 'countryId', 'hardinessZoneId', 'soilAcidityId', 'soilTypeId']
          }
        },
        {
          relation: 'diaryEntries',
          scope: {
            include: [
              {
                relation: 'diaryProgression'
              }
            ]
          }
        }
      ]
    }, function(err, cb2) {
      cb(null, cb2);
    });
  };


  Diary.remoteMethod(
    'getDiary',
    {
      accepts: {arg: 'userId', type: 'string'},
      returns: {arg: 'diary', type: 'object'}
    }
  );


  Diary.findByDiaryId = function(diaryId, cb) {

    Diary.find({
        where: {id: diaryId},
        order: "entryDate ASC",
        include: [
          {
            relation: 'user',
            scope: {
              fields: ['firstName', 'lastName', 'profilePicture']
            }
          },
          {
            relation: 'diaryEntries',
            scope: {
              include: [
                {
                  relation: 'country',
                  scope: {
                    fields: ['translateKey']
                  }
                },
                {
                  relation: 'hardinessZone',
                  scope: {
                    fields: ['name']
                  }
                },
                {
                  relation: 'soilAcidity',
                  scope: {
                    fields: ['translateKey']
                  }
                },
                {
                  relation: 'soilType',
                  scope: {
                    fields: ['translateKey']
                  }
                },
                {
                  relation: 'plantRating',
                  scope: {
                    fields: ['name']
                  }
                },
                {
                  relation: 'diaryProgression',
                  scope: {
                    include: [
                      {
                        relation: 'plantRating',
                        scope: {
                          fields: ['name']
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }, function(err, cb2) {
      cb(null, cb2);
    });
  };

  Diary.remoteMethod(
    'findByDiaryId',
    {
      accepts: {arg: 'diaryId', type: 'string'},
      returns: {arg: 'diary', type: 'object'}
    }
  );



  Diary.getDiaryFeed = function(languageId, cb) {
    ONE_WEEK = 7*24*60*60*1000;
    ONE_MONTH = 30*24*60*60*1000;

    Diary.find({
        where: {isPrivate: false, created: {gt: Date.now()-ONE_WEEK}, languageId: languageId},
        limit: 20,
        order: 'created DESC',
        fields: ['updated', 'created', 'userId'],
        include: [
          {
            relation: 'user',
            scope: {
              fields: ['firstName', 'lastName', 'profilePicture']
            }
          }
        ]
      },
      function(err, dCb) {
        dCb.forEach(function(diary){
          diary.updated = diary.created;
        });

        Diary.app.models.DiaryEntry.find ({

            where: {isPrivate: false, updated: {gt: Date.now()-ONE_MONTH}},
            limit: 20,
            order: 'updated DESC',
            fields: ['updated', 'created', 'diaryId', 'plantFamily', 'plantCultivar', 'seedSource', 'notes', 'id'],
            include: [
              {
                relation: 'diaryEntryImageDocs',
                scope: {
                  fields: ['extension', 'id']
                }
              },
              {
                relation: 'diary',
                scope: {
                  fields: ['userId', 'isPrivate', 'languageId'],
                  include: [
                    {
                      relation: 'user',
                      scope: {
                        fields: ['firstName', 'lastName', 'profilePicture']
                      }
                    }
                  ]
                }
              }
            ]


          },
          function(err, dECb) {

            //there is no not inq operator
            Diary.app.models.DiaryEntryImageDoc.find ({

                where: {updated: {gt: Date.now()-ONE_MONTH}},
                limit: 20,
                order: 'updated DESC',
                fields: ['updated', 'extension', 'id', 'diaryEntryId'],
                include: [
                  {
                    relation: 'diaryEntry',
                    scope: {
                      fields: ['diaryId', 'isPrivate', 'id'],
                      include: [
                        {
                          relation: 'diary',
                          scope: {
                            fields: ['userId', 'isPrivate', 'languageId'],
                            include: [
                              {
                                relation: 'user',
                                scope: {
                                  fields: ['firstName', 'lastName', 'profilePicture']
                                }
                              }
                            ]
                          }
                        }

                      ]
                    }
                  }
                ]


              },
              function(err, dEIDCb) {

                Diary.app.models.DiaryProgress.find ({

                    where: {updated: {gt: Date.now()-ONE_MONTH}},
                    limit: 20,
                    order: 'updated DESC',
                    fields: ['updated', 'diaryEntryId', 'notes', 'id'],
                    include: [
                      {
                        relation: 'diaryProgressImageDocs',
                        scope: {
                          fields: ['extension', 'diaryEntryId', 'id']
                        }
                      },
                      {
                        relation: 'diaryEntry',
                        scope: {
                          fields: ['diaryId', 'isPrivate'],
                          include: [
                            {
                              relation: 'diary',
                              scope: {
                                fields: ['userId', 'isPrivate', 'languageId'],
                                include: [
                                  {
                                    relation: 'user',
                                    scope: {
                                      fields: ['firstName', 'lastName', 'profilePicture']
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]



                  },
                  function(err, dPCb) {

                    Diary.app.models.DiaryProgressImageDoc.find ({

                        where: {updated: {gt: Date.now()-ONE_MONTH}},
                        limit: 20,
                        order: 'updated DESC',
                        fields: ['updated', 'diaryProgressId','extension', 'id'],
                        include: [
                          {
                            relation: 'diaryProgress',
                            scope: {
                              fields: ['notes', 'diaryEntryId', 'id'],
                              include:[
                                {
                                  relation: 'diaryEntry',
                                  scope: {
                                    fields: ['diaryId', 'isPrivate'],
                                    include: [
                                      {
                                        relation: 'diary',
                                        scope: {
                                          fields: ['userId', 'isPrivate', 'languageId'],
                                          include: [
                                            {
                                              relation: 'user',
                                              scope: {
                                                fields: ['firstName', 'lastName', 'profilePicture']
                                              }
                                            }
                                          ]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          }
                        ]


                      },
                      function(err, dPIDCb) {
/** remove when parents edited - leave until later when more busy
                      //really needed not inq to stop this mess have to remove photo objects where parent edited.
                        for( var i = dEIDCb.length - 1; i >= 0; i--){
                          for( var j = 0; j < dECb.length; j++){
                            if(dEIDCb[i] && ( String(dEIDCb[i].diaryEntryId).valueOf() ===  String(dECb[j].id).valueOf())){
                              dEIDCb.splice(i, 1);
                            }
                          }
                        }


                        for( var i=dPIDCb.length - 1; i>=0; i--){
                          for( var j=0; j<dPCb.length; j++){
                            if(dPIDCb[i] && ( String(dPIDCb[i].diaryProgressId).valueOf() ===  String(dPCb[j].id).valueOf())){
                              dPIDCb.splice(i, 1);
                            }
                          }
                        }

**/


                        //check isPrivate status on records.

                        var dEIDObject = {};

                        for( var i=dEIDCb.length - 1; i>=0; i--) {
                          dEIDObject = dEIDCb[i].toObject().diaryEntry;
                          if (dEIDObject.isPrivate === true || dEIDObject.diary.isPrivate === true || String(dEIDObject.diary.languageId).valueOf() !== languageId) {
                            dEIDCb.splice(i, 1);
                          }
                        }

                        var dPIDObject = {};

                        for( var i=dPIDCb.length - 1; i>=0; i--) {
                          dPIDObject = dPIDCb[i].toObject().diaryProgress;
                          if (dPIDObject.diaryEntry.isPrivate === true || dPIDObject.diaryEntry.diary.isPrivate === true || String(dPIDObject.diaryEntry.diary.languageId).valueOf() !== languageId) {
                            dPIDCb.splice(i, 1);
                          }
                        }


                        for (var i = dECb.length - 1; i >= 0; i -= 1) {
                          if (dECb[i].toObject().diary.isPrivate === true || String(dECb[i].toObject().diary.languageId).valueOf() !== languageId) {
                              dECb.splice(i, 1);
                          }
                        }
                        var dPCbObject = {};

                        for (var i = dPCb.length - 1; i >= 0; i -= 1) {
                          dPCbObject = dPCb[i].toObject().diaryEntry;
                          if (dPCbObject.isPrivate === true || dPCbObject.diary.isPrivate === true || String(dPCbObject.diary.languageId).valueOf() !== languageId) {

                            dPCb.splice(i, 1);
                          }
                        }




                        var cb5 =  dCb.concat(dECb).concat(dEIDCb).concat(dPCb).concat(dPIDCb);

                        cb5.sort(compare);

                        function compare(a,b) {
                          if (a.updated < b.updated)
                            return 1;
                          else if (a.updated > b.updated)
                            return -1;
                          else
                            return 0;
                        }


                        cb(null, cb5);


                      })
                  })
              })
          })

      });
  };

  Diary.remoteMethod(
    'getDiaryFeed',
    {

      accepts: {arg: 'languageId', type: 'string'},
      returns: {arg: 'diaryFeed', type: 'object'}
    }
  );




};
