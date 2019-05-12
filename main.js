/*
Copyright (C) 2019 TurtleCoin

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


var term = new Terminal();
term.open(document.getElementById('terminal'));

const gitCommands = ['git init', 'git clone', 'git remote',
'git status', 'git add', 'git commit', 'git pull', 'git push', 'git help'];
var remoteURLs = [];
var remoteNames = [];

var noCommitsYet = true
var untrackedFiles = true
var madeGitRepo = false

// helper funcs
function ifGitRepoMade() {
    if (!(madeGitRepo)) {
        term.writeln('')
        term.writeln('Must initialize a Git repository first!')
        return false
    } else {
        return true
    }
}

function randomCommitId() {
    var result = '';
    for (var i = 7; i > 0; --i) result += '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.round(Math.random() * ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.length - 1))];
    return result;
}

function removeSpaces(xyzCommand) {
    try {
        xyzCommand = xyzCommand.filter(xWord => xWord != "")
        term.writeln('')
        return xyzCommand
    } catch (e) {
        console.log(e)
    }
}

// real code
function gitPushCommand(pushCommand) { // git push origin master
    
    // check if a git repo has initted yet
    if (!(ifGitRepoMade())) {return;}

    if (noCommitsYet) {
        term.writeln('')
        term.writeln('You must commit something first!')
        return;
    }
    
    // get rid of any blanks
    pushCommand = removeSpaces(pushCommand)

    if (!(pushCommand.length === 4)) { //  only 4 words
        term.writeln('');
        term.writeln('Invalid argument!');
        return;
    }
    term.writeln('')
    term.writeln('Enumerating objects...')
    term.writeln('Counting objects...')
    term.writeln('Compressing objects..')
    term.writeln('Writing objects...')
    term.writeln('remote: Resolving deltas...')
    term.writeln('Done')
}

function gitPullCommand(pullCommand) { // git pull
    
    // check if a git repo has initted yet
    if (!(ifGitRepoMade())) {return;}
    
    //get rid of spaces
    pullCommand = removeSpaces(pullCommand)

    if (!(pullCommand.length === 2)) { // only 2 words
        term.writeln('');
        term.writeln('Invalid argument!');
        return;
    }
    term.writeln('')
    term.writeln('Updating...')
    term.writeln('Fast-forward...')
    term.writeln('Done!')
    return;
}

function gitCommitCommand(commitCommand) { // git commit -am "thing"
    
    // check if a git repo has initted yet
    if (!(ifGitRepoMade())) {return;}
    
    if (untrackedFiles) { // quit if there are untracked files
        term.writeln('');
        term.writeln('You must stage some files first!');
        return;
    
    }
    // remove any spaces
    commitCommand = removeSpaces(commitCommand)

    if (!(commitCommand.length >= 4)) { // at least 4 stuff
        term.writeln('');
        term.writeln('Invalid argument!');
        return;
    }
    noCommitsYet = false // first commit

    var commitMessages = commitCommand.slice(3) // get the commit message (list)

    var commitMessage = ""
    for (msg in commitMessages) { // go through each message and add it to a var as a string
        msg = commitMessages[msg]
        commitMessage += msg
        commitMessage += ' '
    }
    
    commitMessage = commitMessage.slice(1,-2); // get rid of starting quote and (ending quote and space)
    var commitId = randomCommitId() // random commit id

    term.writeln(' ');
    term.writeln('Commited');
    term.writeln('[' + commitId + ']' + ' ' + commitMessage);
    return;

}

function gitAddCommand(addCommand) { // git add file.txt
    
    // check if a git repo has initted yet
    if (!(ifGitRepoMade())) {return;}
    
    // remove any spaces
    addCommand = removeSpaces(addCommand)

    if (!(addCommand.length === 3)) { // improper length
        term.writeln('');
        term.writeln('Invalid argument!');
        return;
    }
    // before you run git add, all files will be untracked; regardless of whether they are or not
    // after you run git add once, all files will be tracked; regardless of whether they are or not
    // keep that in mind
    untrackedFiles = false // make all files tracked, since idc
    return;
}

function gitStatusCommand(statusCommand) { // git status
     
    // check if a git repo has initted yet
    if (!(ifGitRepoMade())) {return;}
    
    // remove any spaces
    statusCommand = removeSpaces(statusCommand)

    if (!(statusCommand.length === 2)) { //improper length
        term.writeln('');
        term.writeln('Invalid argument!');
        return;
    }
    if (noCommitsYet) { // not a single commit yet
        term.writeln('')
        term.writeln('No commits yet')
        return;
    }
    if (untrackedFiles) { // any untracked files (not git add . 'd)
        term.writeln('')
        term.writeln('Untracked files to be added!')
    } else { // all files added, but also not the first commit
        term.writeln('')
        term.writeln('Your branch is up to date')
        term.writeln('')
        term.writeln('Nothing to commit, working tree clean')
    }
}

function gitRemoteCommand(remoteCommand) {
    
    // check if a git repo has initted yet
    if (!(ifGitRepoMade())) {return;}
   
    // if there are any blanks in the list, get rid of them
    remoteCommand = removeSpaces(remoteCommand)

    if (remoteCommand.length === 2) { // git remote
        if (remoteURLs.length === 0) { // no urls to show
            term.writeln('');
            return;
        }
        term.writeln('')
        for (var i = 0; i < remoteURLs.length; i++) { // list of urls
            term.write('  ')
            term.write(remoteNames[i])
            term.write('\t')
            term.write(remoteURLs[i])
            term.writeln('');
        };
        return;
    }
    if (!((remoteCommand.length <= 5) && (remoteCommand.length >= 4))) { // improper length
        term.writeln('');
        term.writeln('Invalid argument!');
        return;
    }
    if (remoteCommand[2] === 'add') { //git remote add master xyz.com
        if (!(remoteCommand.length === 5)){ // at least 5 words
            term.writeln('')
            term.writeln('Invalid argument!')
            return;
        }
        // add url and name to list
        remoteURLs.push(remoteCommand[4])
        remoteNames.push(remoteCommand[3])
        term.writeln('')
        return;
    } else if (remoteCommand[2] === 'rename') { // git remote rename master overlord
        if (!(remoteCommand.length === 5)) { // at least 5 words
            term.writeln('')
            term.writeln('Invalid argument!')
            return;
        }
        // rename the name
        var remoteNamePos = remoteNames.indexOf(remoteCommand[3]) // get pos of current name
        remoteNames[remoteNamePos] = remoteCommand[4] // change it to new one
        term.writeln('');
        return;
    } else if (remoteCommand[2] === 'remove') { // git remote remove overlord
        if (!(remoteCommand.length === 4)) { // 4 words min.
            term.writeln('')
            term.writeln('Invalid argument!')
            return;
        }
        // remove the name and ur
        var remoteRemoveNamePos = remoteNames.indexOf(remoteCommand[3]) // get pos of name
        // same index position for both of them
        // get rid of name and url 
        remoteNames.splice(remoteRemoveNamePos, 1);
        remoteURLs.splice(remoteRemoveNamePos, 1);
        term.writeln('');
        return;
    }
}

function gitCloneCommand(cloneCommand) {
    
    // get rid of any blanks
    cloneCommand = removeSpaces(cloneCommand)

    if (!(cloneCommand.length === 3)) { // git clone https://github.com/turtlecoin/turtlecoin
        term.writeln('')
        term.writeln('Invalid argument!')
        return;
    }
    var cloneUrl = cloneCommand[2];
    var cloneDir = cloneUrl.split('/');
    cloneDir = cloneDir[4];

    term.writeln('');
    term.writeln("Cloning into '" + cloneDir + "'...");
    term.writeln("remote: Enumerating objects...");
    term.writeln("remote: Counting objects...");
    term.writeln("remote: Compressing objects...");
    term.writeln("Receiving objects...");
    term.writeln("Resolving deltas...");
    term.writeln("Done"); 
}

function gitResponse(command) {
    
    var gitCommand = command.split(' ');
    gitCommand = gitCommand[0] + ' ' + gitCommand[1];
    
    var commandIndex = gitCommands.indexOf(gitCommand);
    
    if (commandIndex === 0) {
        // git init
        //console.log('Initialized empty Git repository')
        term.writeln('')
        term.writeln('Initialized empty Git repository')
        madeGitRepo = true
    }
    else if (commandIndex === 1) {
        // git clone https://github.com/turtlecoin/turtlecoin
        var cloneCommand = command.split(' ');
        gitCloneCommand(cloneCommand);

    } else if (commandIndex === 2) {
        // git remote add master https://github.com/turtlecoin/sajodocs
        // git remote rename master overlord
        // git remote remove master
        var remoteCommand = command.split(' ')
        gitRemoteCommand(remoteCommand)

    } else if (commandIndex === 3) {
        // git status
        var statusCommand = command.split(' ')
        gitStatusCommand(statusCommand)
    } else if (commandIndex === 4) {
        // git add filename.txt
        var addCommand = command.split(' ')
        gitAddCommand(addCommand)
    } else if (commandIndex === 5) {
        //git commit -am "message here"
        var commitCommand = command.split(' ')
        gitCommitCommand(commitCommand)
    } else if (commandIndex === 6) {
        // git pull
        var pullCommand = command.split(' ')
        gitPullCommand(pullCommand)
    } else if (commandIndex === 7) {
        // git push orign master
        var pushCommand = command.split(' ')
        gitPushCommand(pushCommand)
    } else if (commandIndex === 8) { 
        // git help
        term.writeln('');
        term.writeln('Available commands:');
        term.writeln('git init');
        term.writeln('git clone');
        term.writeln('git remote');
        term.writeln('git status');
        term.writeln('git add');
        term.writeln('git commit');
        term.writeln('git pull');
        term.writeln('git push');
        term.writeln('git help');
        return;
    }
}

function runGitTerminal() {
    word = "";

    term.prompt = () => {
        term.write('\r\n$ ');
    };

    term.writeln('Welcome to the Git terminal!');
    term.writeln('');
    term.prompt();

    term.on('key', function(key, ev) {
        const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) { // enter

            var gitCommand = word.split(' ')
            gitCommand = gitCommand[0] + ' ' + gitCommand[1]
            
            if (gitCommands.includes(gitCommand)) {
                gitResponse(word)
            }
            
            term.prompt();
            word = "";
        } else if (ev.keyCode === 8) { // backspace
            // Do not delete the prompt
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
            }
            word = word.slice(0, -1); // remove last character from word
        } else if (printable) {
            word += key
            term.write(key);
        }
    });

    term.on('paste', function(data) {
        term.write(data);
        word += data;
    });
}
runGitTerminal();