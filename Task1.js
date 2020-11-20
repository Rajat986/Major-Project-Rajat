var http = require('http');
var fs = require('fs');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/data.txt', {flags : 'w'});
var log_stdout = process.stdout;

printt = function(d) { 
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const Git = require('git-commands')
const git = new Git({ reps:__dirname + '/Test-Repo' })

console.log(`Port ${8000}`)

function comments()
{
	printt(git.command('log --pretty="%s:%b"'));
}
comments()
var server = http.createServer(function(req, res) {
    fs.readFile(__dirname + '/data.txt', function (err, data) {
        res.end(data);
    });
});
server.listen(8000);

module.exports = { printt, comments};
