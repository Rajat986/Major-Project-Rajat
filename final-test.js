var http = require('http');
var fs = require('fs');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/data.txt', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};


const Git = require('git-commands')
const git = new Git({ reps:__dirname + '/Test-Repo' })

console.log(git.command('log --pretty="%s:%b"'))





var server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/data.txt', function (err, data) {
        res.end(data);
    });
});
server.listen(8000);