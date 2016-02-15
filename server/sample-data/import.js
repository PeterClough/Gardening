/**
 * Created by peterclough on 01/09/2014.
 */
/**
 * Run `node import.js` to import the sample data into the db.
 */

var async = require('async');
var app = require('../server');
var ds = app.dataSources.db;

// sample data
console.log('Assigning file: languages.json');
var languages = require('./languages.json');


console.log('Assigning file: countries.json');
var countries = require('./countries.json');

console.log('Assigning file: hardiness-zones.json');
var hardinessZones = require('./hardiness-zones.json');

console.log('Assigning file: plant-ratings.json');
var plantRatings = require('./plant-ratings.json');

console.log('Assigning file: soil-acidities.json');
var soilAcidities = require('./soil-acidities.json');

console.log('Assigning file: soil-types.json');
var soilTypes = require('./soil-types.json');




module.exports = function(app, cb) {
//return;



  console.log('Assigning model: language');
  var language = app.models.Language;

  console.log('Assigning model: country');
  var country = app.models.Country;

  console.log('Assigning model: hardinessZone');
  var hardinessZone = app.models.HardinessZone;

  console.log('Assigning model: plantRating');
  var plantRating = app.models.PlantRating;

  console.log('Assigning model: soilAcidity');
  var soilAcidity = app.models.SoilAcidity;

  console.log('Assigning model: soilType');
  var soilType = app.models.SoilType;






  var db = app.dataSources.db;

  var ids = {
  };

  function importData(Model, data, cb) {
    console.log('Importing data for: ' + Model.modelName);

    Model.destroyAll(function(err) {
      if (err) {
        cb(err);
        return;
      }


      async.each(data, function(d, callback) {
        if (ids[Model.modelName] === undefined) {
          // The Oracle data has Location with ids over 80
          // and the index.html depends on location 88 being present
          //screw that on mongodb it's ok
          ids[Model.modelName] = new ds.ObjectID();
        }
        d.id = new ds.ObjectID();
        console.log(d);
        Model.create(d, callback);
      }, cb);
    });
  }

  async.series([
    function(cb) {
      db.autoupdate(cb);
      console.log('db.autoupdate');

    },
    importData.bind(null, language, languages),
    importData.bind(null, country, countries),
    importData.bind(null, hardinessZone, hardinessZones),
    importData.bind(null, plantRating, plantRatings),
    importData.bind(null, soilAcidity, soilAcidities),
    importData.bind(null, soilType, soilTypes)







  ], function(err/*, results*/) {
    cb(err);
  });
};

if (require.main === module) {
  // Run the import
  module.exports(require('../server.js'), function(err) {
    if (err) {
      console.error('Cannot import sample data - ', err);
    } else {
      console.log('Sample data was imported.');
    }
  });
}
