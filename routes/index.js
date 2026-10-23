/**
 * NodeJS + Express (w/ ejs) code to test reading form data and returning a response.
 *
 */

var express = require('express');
var router = express.Router();

//########################################
//to process data sent in on request need body-parser module
var bodyParser = require('body-parser');
var path = require ('path'); //to work with separtors on any OS including Windows

var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value
var { getCustomersCollection } = require('../db');

router.use(bodyParser.json()); // for parsing application/json

router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//#########################################

async function loadFirstCustomers() {
  var collection = await getCustomersCollection();
  return collection.find({}).sort({ _id: 1 }).limit(10).toArray();
}

async function renderHome(res, extras) {
  var customers = [];
  var dbError = '';
  try {
    customers = await loadFirstCustomers();
  } catch (err) {
    dbError = err.message;
  }
  res.render('index', {
    title: 'ReadFormDataSaveMongoDB',
    customers: customers,
    notice: extras.notice || '',
    dbError: extras.dbError || dbError
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var notice = req.query.saved === '1' ? 'Customer saved.' : '';
  renderHome(res, { notice: notice }).catch(next);
});

// GET with  URI  /read/Lynne   which means name=Lynne
router.get('/read/:name', function(req, res, next) {
  //expecting data variable called name --retrieve value using body-parser
  var body = JSON.stringify(req.body);  //if wanted entire body as JSON
  var params = JSON.stringify(req.params);//if wanted parameters
  var value_name = req.params.name;  //retrieve the data associated with name
  res.send("hello " + value_name);
})

/* the URI /readNameAndRespond */

// GET with URI with querry  /readNameAndRespond?name=Lynne
router.get('/readNameAndRespond', function(req, res, next) {
  //expecting data variable called name --retrieve value using body-parser
  var body = JSON.stringify(req.body);  //if wanted entire body as JSON
  var params = JSON.stringify(req.params);//if wanted parameters
  var query = req.query;  //if wanted the query
  var value_name = req.query.name;  //retrieve the data associated with name
  res.send("hello " + value_name);
});


//Processing Post to read post data called name
//now processing post
router.post('/readNameAndRespond', function(req, res, next) {

  //expecting data variable called name --retrieve value using body-parser
  var body = JSON.stringify(req.body);  //if wanted entire body as JSON
  var params = JSON.stringify(req.params);//if wanted parameters
  var value_name = req.body.name;  //retrieve the data associated with name
  res.send("hello now " + value_name);
});






//Processing Post to read post data called name and email, then save a customer
router.post('/readCustomerInfoAndRespond', function(req, res, next) {

  //expecting data variable called name --retrieve value using body-parser
  var body = JSON.stringify(req.body);  //if wanted entire body as JSON
  var params = JSON.stringify(req.params);//if wanted parameters
  var value_name = (req.body.name || '').trim();  //retrieve the data associated with name
  var value_email = (req.body.email || '').trim();  //retrieve the data associated with email

  if (!value_name || !value_email) {
    renderHome(res, { notice: 'Enter both a name and an email before saving.' }).catch(next);
    return;
  }

  getCustomersCollection().then(function(collection) {
    return collection.insertOne({ name: value_name, email: value_email });
  }).then(function() {
    res.redirect('/?saved=1');
  }).catch(function(err) {
    renderHome(res, { dbError: err.message }).catch(next);
  });
});

module.exports = router;
