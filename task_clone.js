var Git = require('nodegit');
url = 'https://github.com/Rajat986/Test-Repo.git';

function clone_git_repo(url)
{
    Git.Clone(url, 'tmp')
}

module.exports = {clone_git_repo};
