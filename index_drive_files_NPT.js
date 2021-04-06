const fs = require('fs');
const util=require('util');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');

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
  c=0
  do {
    const params = {
      orderBy: "name",
      pageToken: NextPageToken || "",
      pageSize: 1000,
      q:"not 'rsrajat123456789@gmail.com' in writers",
      fields: "nextPageToken, files(id, name, owners)",
    };
    const res = await drive.files.list(params);
    Array.prototype.push.apply(fileList, res.data.files);
    NextPageToken = res.data.nextPageToken;
    c=c+1;
  } while(NextPageToken);

  //console.log(fileList);  // You can see the number of files here.
  console.log('FILE LIST: '+fileList.length);
  fileList.map((file) => {
    var owners=file.owners;
    owners.map((owner)=>{
      var d=`${file.id}***${owner.emailAddress}***${file.name}***`;
      //console.log(d);

      driveactivity.activity.query({
        requestBody:{
          itemName:`items/${file.id}`
        }
      },async (err, res2)=>{
        if(err) {
          console.log('Going to sleep '+err);
          await setTimeout(60000);
          console.log('Sleep end');
        }
        const activities=res2.data.activities;
        c=c+1;
        if(activities.length) {
          activities.map((activity)=>{
            const target_S=activity.targets;
            target_S.map((targets)=>{
              d=d+`${activity.timestamp}-${targets.driveItem.owner.user.knownUser.personName}*&*`;
            })
          })
        }
        //console.log(d);
        drive_activity_file.write(d+'\n');
        console.log(c);
      })
    })
  })
}