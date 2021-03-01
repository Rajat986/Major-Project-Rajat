const fs = require('fs');
const util = require('util');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Docs API.
  authorize(JSON.parse(content), activity_doc_log);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
function activity_doc_log(auth) {
  //Lists 10 activities of a student given in 'name'
  stu_email="'eng19cs0015.adityabelludi@gmail.com' in writers";
  stu_identify="name contains 'ENG19CS0070_ Chandrashekar V'";
  var log_file = fs.createWriteStream(__dirname + '/student_activity.txt', {flags : 'w'});


  /*act_1_drive="'0Bya_X1cZJP9TfjZ6dE9nOWE5cF9Ic1k2ZVlsMnE1anc5S0xWNzFhSTI5eHZEWkN1cjQzNVE' in parents";
  act_2_drive="'0Bya_X1cZJP9TfklWRDRncXJhRVc3cV9lSXdPRkcwZWpqa1JtN1I4V2RDWEp3bGgwcnJCcXc' in parents";
  act_8_drive="'0Bya_X1cZJP9Tfk1aN2R0aU45ZWVJX256SUE2Q25sWmJQcEJZZS1vNmVvRy04OVFWZ2YzbTQ' in parents";
  act_1=(act_1_drive+" and "+stu_email);
  act_2=(act_2_drive+" and "+stu_email);
  act_8=(act_8_drive+" and "+stu_email);*/

  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    q: stu_identify,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    const nPT = res.data.nextPageToken;
    if (files.length) {
      console.log('Files:');
      files.map((file, nPT) => {
        console.log(`${nPT+1}  ${file.name} (${file.id})`);
        log_file.write(util.format(`${file.id}`)+'\n');
      });
    } else {
      console.log('No files found.');
    }
  });
  drive_activity(auth);
}

function drive_activity(auth){
  //driveactivity.activity
  const driveactivity=google.driveactivity({version: 'v2', auth});
  driveactivity.activity.query({
    requestBody:{
      itemName:"items/1yHeuvBMz7ev3qaOFGjl9hgkLln3Dx_ZlG4eaBe9dGOg"  
    }
  }, (err, res) => {
    if(err) return console.log("The Activity API returned an error: "+err);
    var cou=0;
    var act_date_set=new Set();
    const act_files=res.data.activities;
    if(act_files.length) {
      console.log('\nActivity file:');
      act_files.map((act_file) => {
        console.log(`${act_file.timestamp.split('T')[0]}   ${act_file.timestamp.split('T')[1].split('.')[0]}   ${act_file.timestamp.split('T')[1].split('.')[1]}`);
        act_date_set.add(`${act_file.timestamp.split('T')[0]}`);
        /*const targeS=act_file.targets;
        if(targeS.length){
          targeS.map((targe_file) => {
            console.log(`${targe_file.driveItem}`)
          })
        }*/
        cou=cou+1
      })
    }
    console.log("Timestamp count: "+cou);
    console.log("Days worked for this activity: "+act_date_set.size);
    console.log("Days are: ");
    act_date_set.forEach(function(value) {
      console.log(value);
    })
  });

}

function readdataa()
{
  const lineReader = require('line-reader');
  {
    console.log("\nRead data:\n");
    lineReader.eachLine('./student_activity.txt', function(line) {
        console.log(line);
    });
  }
}


  /*const docs = google.docs({version: 'v1', auth});
  docs.documents.get({
    'documentId': '1yHeuvBMz7ev3qaOFGjl9hgkLln3Dx_ZlG4eaBe9dGOg',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    console.log('\nThe title of the document is: '+`${res.data.title}\n`); 
  });

  drive.revisions.list({
      fileId: "15vHo8kDqjQTaCFY0c4Im86zu2aDnj3wcaUT8eevXSgc"
  }).then(function(response) {
    // Handle the results here (response.result has the parsed body).
    console.log("Revisions of file:")
    console.log(response.data);
  },
  function(err) { console.error("Execute error", err); });*/
