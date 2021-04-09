const fs = require('fs');
const util=require('util');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');
const { promisify } = require('util')
const sleep = require('sleep-async')();
const sleep1=require('sleep-promise');

//var drive_file=fs.createWriteStream(__dirname+'/drive_files.txt',{flags:'w'});
var drive_activity_file=fs.createWriteStream(__dirname+'/drive_activity_files.txt',{flags:'w'});
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.activity'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
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
    if (err) return getAccessToken(oAuth2Client, callback);
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
function getAccessToken(oAuth2Client, callback) {
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
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  const driveactivity=google.driveactivity({version: 'v2', auth});

  const fileList = [];
  let NextPageToken = "";
  do {
    const params = {
      orderBy:"name",
      pageToken: NextPageToken || "",
      pageSize: 300,
      fields: "nextPageToken, files(id, name, owners)",
    };
    const res = await drive.files.list(params);
    Array.prototype.push.apply(fileList, res.data.files);
    res.data.files.map((file)=>{
      var owners=file.owners;
      owners.map(async (owner)=>{
        //var d=`${file.id}***${owner.emailAddress}***${file.name}***`;
        driveactivity.activity.query({
          requestBody:{
            itemName:`items/${file.id}`
          }
        },(err,res2)=>{
          if(err) console.log("API RETURNED AN ERROR: "+err);
                d=`${file.id}***${file.owners.map((owner)=>owner.emailAddress)}***${file.name}***${res2.data.activities.map((activity)=>activity.timestamp)}-${res2.data.activities.map((activity)=>activity.actors.map((actor)=>actor.user.knownUser.personName))}*&*`;
                drive_activity_file.write(d+'\n');
                console.log(d);
          
          //console.log(d);
          //drive_activity_file.write(d+'\n');
        })
      })
      
    })
    NextPageToken = res.data.nextPageToken;
    await sleep1(65000);//Wait for a minute at least as the API allows only 1000 requests per minute.

  } while(NextPageToken);
}
