var request = require('request-promise');

var ZURMO_sessionId = '';
var ZURMO_token = '';

var peopleToLeads = function(person){
  var lead = {
    'data': {
      'items': {
        'api_idCstm': person.id,
        'description': person.notes || '',
        'firstName': '',
        'lastName': '',
        'state': 'New',
        'mobilePhone': person.contact && person.contact.phone || '',
        'website': person.url || '',
        'primaryEmail': person.contact && person.contact.email || ''
      }
    }
  }
  if(person && person.name){
    var splitName = person.name.split(" ");
    if(splitName.length == 1){
      lead.data.items['firstName'] = splitName[0];
      lead.data.items['firstName'] = '.';
    } else {
      lead.data.items['firstName'] = splitName[0];
      lead.data.items['lastName'] = splitName[1];
    }
  }
  console.log(lead);
  request({
    url: 'http://bd.techatnyu.org/app/index.php/leads/contact/api/create/',
    method: 'POST',
    form: lead,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ZURMO_API_REQUEST_TYPE': 'REST',
      'ZURMO_SESSION_ID': ZURMO_sessionId,
      'ZURMO_TOKEN': ZURMO_token
    }
  }).then(function(returnBody) {
    console.log(returnBody);
  });
}

request({
  url: 'http://bd.techatnyu.org/app/index.php/zurmo/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ZURMO_AUTH_USERNAME': process.env.ZURMO_AUTH_USERNAME,
    'ZURMO_AUTH_PASSWORD': process.env.ZURMO_AUTH_PASSWORD
  }
}).then(function(body){
  var jsonData = JSON.parse(body);
  var data = jsonData.data;
  if(!data){
    console.error("Status: " + jsonData.status + ".\nMessage: "  + jsonData.message);
    return
  }
  ZURMO_sessionId = data.sessionId;
  ZURMO_token = data.token;

  return request({
    url: 'https://api.tnyu.org/v2/people', 
    rejectUnauthorized: false,
    headers: {
      'x-api-key': process.env.ApiKey,
      'accept': 'application/vnd.api+json'
    }
  });
}).then(function(peopleBody){
  var people = JSON.parse(peopleBody).data;
  peopleToLeads(people[0]);
  //people.forEach(peopleToLeads);
})