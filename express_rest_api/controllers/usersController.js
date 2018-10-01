var objectid = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
const USRNAME = 'user123';
const PASSWORD = 'dbpass1';
const DATA_BASE = "learning-plan";
const USERS_COLLECTION = "Users_collection";
var url = `mongodb://${USRNAME}:${PASSWORD}@ds243931.mlab.com:43931/learning-plan`;

var dbo;
exports.connectDB = function(run_server) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        dbo = client.db(DATA_BASE);
        console.log("Database connection ready");
        run_server();
    });
};

exports.get_all_users = function(req, res, next) {  
    dbo.collection(USERS_COLLECTION).find({}).toArray(function(err, result) {
        if (err) {next();}
        res.status(200).json(result);
    });
};

exports.getUserById = function(req, res, next) {
    var id = objectid.isValid(req.params.id) ? objectid(req.params.id) : req.params.id;
    var query = { "_id": id };//{"_id":{$in: [id]} };
    dbo.collection(USERS_COLLECTION).find(query).toArray(function(err, result) {
        if (err) {next();}
        if (Object.keys(result).length === 0){
            res.status(404).send("Nepavyko rasti duomenų su tokiu id: " + req.params.id);
            next();
        }else{res.status(200).json(result);}
    });  
};

exports.create_user = function(req, res, next) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send("Klaida! Tuscias elementas");
        next();
    }else{
        dbo.collection(USERS_COLLECTION).insertOne(req.body, function(err, result) {
        if (err) {next();}
        res.location(req.url + '/' + result.insertedId);
        //result.ops[0] === req.body
        //console.log(JSON.stringify(req.body)); turi id
        res.status(201).json(result.ops[0]);
        //kitaip: res.status(201); res.end(JSON.stringify(req.body)); 
        });   
    }
};

exports.update_user = function(req, res, next) {
    var updateDoc = req.body;
    delete updateDoc._id; // istrinu id nes mongodb neleidzia updatinti id
    if (updateDoc.constructor === Object && Object.keys(updateDoc).length === 0){
        res.status(400).send("Klaida! Tuscias elementas");
        next();
    }else{
        var id = objectid.isValid(req.params.id) ? objectid(req.params.id) : req.params.id;
        var query = { "_id": id };//{"_id":{$in: [id]} };
        var newvalues = { $set: updateDoc };//When using the $set operator, only the specified fields are updated
        dbo.collection(USERS_COLLECTION).updateOne(query, newvalues, function(err, result) {
            if (err) {next();}
            if (result.matchedCount === 0){
                res.status(404).send("Nepavyko rasti duomenų su tokiu id: " + req.params.id);
                next();
            }else{
                updateDoc._id = req.params.id; // grazinu id
                res.status(200).json(updateDoc);
            }
        });
    }
};

exports.delete_user = function(req, res, next) {
    var id = objectid.isValid(req.params.id) ? objectid(req.params.id) : req.params.id;
    var query = { "_id": id };
    dbo.collection(USERS_COLLECTION).deleteOne(query, function(err, obj) {
        if (err) {next();}
        if (obj.deletedCount === 0){
            res.status(404).send("Nepavyko rasti duomenų su tokiu id: " + req.params.id);
            next();
        }else{res.status(200).json(req.params.id);}
    });
};