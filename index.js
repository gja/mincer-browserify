var Mincer = require("mincer"),
         _ = require("lodash"),
     child = require("child_process"),
      temp = require("temp").track(),
        fs = require("fs");

function browserifyEngine() { Mincer.Template.apply(this, arguments); }

require('util').inherits(browserifyEngine, Mincer.Template);

var options = {
  browserifyExecutable: "./node_modules/.bin/browserify",
  params: []
};

browserifyEngine.configure = function (opts) {
  options = _.assign({}, options, opts);
};

browserifyEngine.prototype.evaluate = function() {
  var tempfile = temp.openSync('application.js');
  var processResult = child.spawnSync(options.browserifyExecutable, _.concat(["-o", tempfile.path], options.params, [this.file]));
  var result = fs.readFileSync(tempfile.path, { encoding: "utf-8" });
  fs.close(tempfile.fd, temp.cleanup);
  if(processResult.status == 0) {
    return result;
  } else {
    throw new Error(processResult.stderr);
  }
}
browserifyEngine.defaultMimeType = 'application/javascript'

module.exports = browserifyEngine;
