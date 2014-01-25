var Script = require('../models/script').Script; 

/*
 * Scripts Routes
 */
exports.index = function(req, res) {
  Script.find({}, function(err, docs) {
    if(!err) {
      res.json(200, { scripts: docs });  
    } else {
      res.json(500, { message: err });
    }
  });
}

exports.show = function(req, res) {
  
  var id = req.params.id; // The id of the script the user wants to look up. 
  Script.findById(id, function(err, doc) {
    if(!err && doc) {
      res.json(200, doc);
    } else if(err) {
      res.json(500, { message: "Error loading script." + err});
    } else {
      res.json(404, { message: "Script not found."});
    }
  });
}

exports.create = function(req, res) {

  var script_name = req.body.script_name; // Name of script. 
  var description = req.body.script_description;  // Description of the script

  //Script.findOne({ name: script_name }, function(err, doc) {  // This line is case sensitive.
  Script.findOne({ name: { $regex: new RegExp(script_name, "i") } }, function(err, doc) {  // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      var newScript = new Script(); 

      newScript.name = script_name; 
      newScript.description = description; 
      
      newScript.save(function(err) {

        if(!err) {
          res.json(201, {message: "Script created with name: " + newScript.name });    
        } else {
          res.json(500, {message: "Could not create script. Error: " + err});
        }

      });

    } else if(!err) {
      
      // User is trying to create a script with a name that already exists. 
      res.json(403, {message: "Script with that name already exists, please update instead of create or create a new script with a different name."}); 

    } else {
      res.json(500, { message: err});
    } 
  });

}

exports.update = function(req, res) {
  
  var id = req.body.id; 
  var script_name = req.body.script_name;
  var script_description = req.body.script_description; 

  Script.findById(id, function(err, doc) {
      if(!err && doc) {
        doc.name = script_name; 
        doc.description = script_description; 
        doc.save(function(err) {
          if(!err) {
            res.json(200, {message: "Script updated: " + script_name});    
          } else {
            res.json(500, {message: "Could not update script. " + err});
          }  
        });
      } else if(!err) {
        res.json(404, { message: "Could not find script."});
      } else {
        res.json(500, { message: "Could not update script." + err});
      }
    }); 
}

exports.delete = function(req, res) {

  var id = req.body.id; 
  Script.findById(id, function(err, doc) {
    if(!err && doc) {
      doc.remove();
      res.json(200, { message: "Script removed."});
    } else if(!err) {
      res.json(404, { message: "Could not find script."});
    } else {
      res.json(403, {message: "Could not delete script. " + err });
    }
  });
}
