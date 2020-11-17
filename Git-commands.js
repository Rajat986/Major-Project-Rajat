const Git = require('git-commands')
const git = new Git({ reps:__dirname + '/Test-Repo' })

console.log(git.command('log --pretty="%s:%b"'))