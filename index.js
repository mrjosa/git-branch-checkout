var exec = require('child_process').exec;
var sprintf = require('sprintf').sprintf;
var fs = require('fs-extra');

var args = process.argv;
	
if (args.length == 4) {
	fs.ensureDir(sprintf("%s/output", args[3]), function(err) {
		execute_git_diff(args[2], "master", args[3]);
	});
}
else if (args.length == 5) {
	fs.ensureDir(sprintf("%s/output", args[4]), function(err) {
		execute_git_diff(args[2], args[3], args[4]);
	});
}
else {
	console.log("Usage: node index.js <branch> <otherbranch> <output_root>");
}

function execute_git_diff(branch, otherBranch, output_root) 
{
	var cmd = exec(sprintf("git diff --name-only %s %s", branch, otherBranch), function(error, stdout, stderr) {
		
		var files = stdout.split(/\n/);
		
		files.forEach(function(file) {
			if (file.length > 0) {
				console.log(sprintf("cp --parents %s %s/output/%s", file, output_root, file));
				fs.copy(file, sprintf("output/%s", file), function(err) {
					if (err != null) {
						console.log(sprintf("ERROR: %s", err));
					}
				});
			}
		});
	});
}
