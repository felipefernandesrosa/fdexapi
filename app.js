var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

  //// Mongoose Schema definition
  Schema = new mongoose.Schema({
    id              : String, 
    name            : String,
    description     : String,
    type            : String,
    value           : String,
    place           : [{address : String}],
    image           :  [{desc: String, url: String}],
    contact         : String
  }),
  
  //setting model
  Realty = mongoose.model('Realty', Schema);
  
  //setting database uristring
  var uristring = 
    process.env.MONGODB_URI || 
  'mongodb://boilingmountain:boilingmountain123@ds017246.mlab.com:17246/boilingmountain';

  // Makes connection asynchronously.  Mongoose will queue up database
  // operations and release them when the connection is complete.
  mongoose.connect(uristring, function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + uristring);
    }
  });

  express()
    .use(bodyParser.json()) // support json encoded bodies
    .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
  
  
  //Allowing external access
  .all('*', function(req, res,next) {
      /**
       * Response settings
       * @type {Object}
       */
      var responseSettings = {
          "AccessControlAllowOrigin": req.headers.origin,
          "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
          "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
          "AccessControlAllowCredentials": true
      };
  
      /**
       * Headers
       */
      res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
      res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
      res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
      res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
  
      if ('OPTIONS' == req.method) {
          res.send(200);
      }
      else {
          next();
      }
  })
  
  /**
   * Api starts
   **/
  
  .get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
  })

  //return all realties
  .get('/api/realty', function (req, res) {
    
    Realty.find( function ( err, realty ){
      res.json(200, realty);
    });
  })
  
  .get('/api/realty/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Realty.findById( req.params.id, function ( err, realty ) {
      res.json(200, realty);
    });
  })
  
  // post and realty
  .post('/api/realty', function (req, res) {
    var realty = new Realty( req.body );
    
    realty.id = realty._id;
    
    realty.save(function (err,realty) {
      res.json(200, realty);
    });
  })

  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);
