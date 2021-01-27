var Git = require('nodegit');
var path = require('path');
url = 'https://github.com/Rajat986/Test-Repo.git';

function clone_git_repo(url)
{
    Git.Clone(url, 'tmp').then(function(repo){
            console.log("Cloning successful!")
            console.log("Cloned " + path.basename(url) + " to " + repo.workdir());
        }).catch(function (err) {
            console.log(err);
    })
}
clone_git_repo(url);
module.exports = {clone_git_repo};
