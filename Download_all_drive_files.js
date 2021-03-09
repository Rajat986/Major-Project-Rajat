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
function listFiles(auth) {
    var log_file = fs.createWriteStream(__dirname + '/drive_files.txt', {flags : 'a'});

    const drive = google.drive({version: 'v3', auth});
    const driveactivity=google.driveactivity({version: 'v2', auth});
    drive.files.list({
        orderBy: "name",
        pageSize: 1000,
        pageToken: "~!!~AI9FV7RoPbrOvGTSPtxspPKefBId8KM5AHBdHs4ck5-QZry-1UuM2fA4U7g5EXbONjHhPzbtA1CeqAuq6m6V4fyhVqeW1fI_RZPEmAtvtO081y4d_7xC_Mb6QDAQwWU4tRFeV6mRgOSeQ9a6NVLnuRejjEn9nu5pbpo4v7iW6_H6fCkhrEtV772XvCNDvh9iKF2PLhhPREhw-Y06vubJO8xQQXqRPKZzKD7RN5Utq91m2iROHMCB9SUz7ttWuUYxUC9CZVn8LA_NuvzIfGCmT2eEnUpZX1-8ZawRIWBfKhUjAzP2_4F4FKfahbqc5MFV5SNIOFz0Db0ep3KZm53esmoWNQDBILDUlyfkgqvkpODiO8o8QTn7NfbufQfQ8P9HU8v7UnZDNb3SdZKN00UtJvqbMr2JeieBijNlEDxzSirf9uRni3O5HBLn0c7iQpYccTAdxlWzD-lKCWdGY09KWgmZ-YM2N0f8UfkuQW54ThKKjDZ69Jft1SM=",
        q:"not 'rsrajat123456789@gmail.com' in writers",
        fields:"nextPageToken, files/owners, files/id, files/name",
    },(err, res1)=> {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res1.data.files;
        if(files.length) {
            files.map((file)=> {
                var owners=file.owners;
                owners.map((owner)=>{
                    driveactivity.activity.query({
                        requestBody:{
                            itemName:`items/${file.id}`
                        }
                    },(err,res2) => {
                        if(err) console.log("Activity API returned error: "+err);
                        const activities=res2.data.activities;
                        s=`${owner.emailAddress}$%[${file.name}]#@(${file.id})!*`;
                        if(activities.length) {
                            activities.map((activity)=> {
                                const target_S=activity.targets;
                                target_S.map((targets)=>{
                                    const drive_item=targets.driveItem;
                                    s=s+`${activity.timestamp}-${drive_item.owner.user.knownUser.personName}*&*`;
                                })
                            })
                        }
                        console.log(s);
                        log_file.write(s + '\n');
                    })
                })
            });
        }
    });
}
