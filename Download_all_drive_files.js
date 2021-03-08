const fs = require('fs');
const util = require('util');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');

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
async function activity_doc_log(auth, callback) {
  //Lists 10 activities of a student given in 'name'
  stu_email="'hithesh9591@gmail.com' in writers";
  email="hithesh9591@gmail.com";
  nameS="Hithesh Kumar N";
  stu_identify="name contains 'Ujjwal'";
  var log_file = fs.createWriteStream(__dirname + '/drive_files.txt', {flags : 'w'});

  const drive = google.drive({version: 'v3', auth});
  const driveactivity=google.driveactivity({version: 'v2', auth});

  const fileList=[];
  let NextPageToken="";
  do{
    const params = {
      //q:stu_email,
      q:"not 'rsrajat123456789@gmail.com' in writers",
      orderBy: "name",
      pageToken: NextPageToken || "",
      pageSize: 1000,
      fields: "nextPageToken, files/owners, files/id, files/name"
    };
    const res=await drive.files.list(params);
    Array.prototype.push.apply(fileList, res.data.files);
    NextPageToken=res.data.nextPageToken;
  } while (NextPageToken);
  console.log("Total number of files in my drive are: "+fileList.length);
  fileList.map((file) => {
    //console.log(`${file.name} (${file.id})`)
    var owners=file.owners;
    owners.map((owner)=>{
      //if(`${owner.emailAddress}` == email)
      {
        driveactivity.activity.query({
          requestBody:{
            itemName:`items/${file.id}`
          }
        },(err, res)=>{
          if(err) console.log("Activity API returned error: "+err);
          const activities=res.data.activities;
          s=`${owner.emailAddress} [${file.name}] (${file.id}) `;
          if(activities.length && `${owner.emailAddress}` !== 'rsrajat123456789@gmail.com') {
            activities.map((activity) => {
              //console.log(`${activity.timestamp}`);
              const targetS=activity.targets;
              targetS.map((targets)=>{
                const drive_item=targets.driveItem;
                s=s+`${activity.timestamp} ${drive_item.owner.user.knownUser.personName} `;
              })
            })
          }
          console.log(s);
          console.log();
          log_file.write(util.format(s + '\n'));
        })
        //console.log(`${owner.emailAddress} [${file.name}] (${file.id})`);
        //log_file.write(util.format(`${owner.emailAddress} [${file.name}] (${file.id})`+ '\n'));
      }
    })
  })

}
