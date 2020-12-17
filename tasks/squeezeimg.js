'use strict';

const request = require('request');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'error',
  format: combine(
      timestamp(),
      myFormat
  ),
  transports: [
      new transports.Console(),
      new transports.File({
          filename: path.join(__dirname, 'error.log'),
          level: 'error',
      })
  ],
  handleExceptions : true,
  colorize: true,
  exitOnError: false
});

const PLUGIN_NAME = 'grunt-squeezeimg'
const URL = 'https://api.squeezeimg.com/plugin';
const EXTENSIONS = ['.jpg', '.png', '.svg', '.jpeg', '.jp2', '.gif', '.tiff', '.bmp', '.PNG', '.JPEG', '.GIF', '.SVG', '.TIFF', '.BMP',];

module.exports = function (grunt) {

  grunt.registerMultiTask('squeezeimg', function () {
    var options = this.options();

    if (!options.token) {
       logger.error(`${PLUGIN_NAME} Not token options`)
       grunt.fail.fatal(`${PLUGIN_NAME}  error : Not token options`);
    }
  
    if (!this.files[0]) {
      logger.error(`${PLUGIN_NAME} No src or invalid src provided.`)
      grunt.fail.fatal(`${PLUGIN_NAME} error : No src or invalid src provided.`);
      return;
    }
    grunt.file.preserveBOM = false;
    var done = this.async();
    let dest = this.files[0].orig.dest;
    let count = 0;
    try {
      this.files.forEach(function (f) {
        var src = f.src.map(function (filepath) {
          if (EXTENSIONS.includes(`.${filepath.split('.').pop()}`)) {
            count++;
            let req = request.post({ url: URL, encoding: 'binary' }, (err, resp, body) => {
              if (err) {
                logger.error(`${PLUGIN_NAME} error : ${err.message}`)
              } else if (resp.statusCode === 200) {
                let filename = filepath.split('/').pop();
                if (options.rename) {
                  filename = resp.headers["content-disposition"].split('=').pop().replace(/"/g, '');
                }
                filename = filename.replace(path.extname(filename), path.extname(resp.headers["content-disposition"].split('=').pop().replace(/"/g, '')));
                grunt.file.write(`${dest}${filename}`, Buffer.from(body, 'binary'));

              } else if (resp.statusCode > 200 ) {
                let str = Buffer.from(body, 'binary').toString();
                let res = {};
                try {
                  res = JSON.parse(str);
                } catch (err) { }
                logger.error(`${PLUGIN_NAME} error : ${res.error.message || res.message || str}`)
              }
              count--;
              if (count === 0) done();

            });
            let data = grunt.file.read(filepath, { encoding: null });
            let formData = req.form();
            formData.append('file_name', filepath.split('/').pop());
            formData.append('qlt', options.qlt || 60);
            formData.append('token', options.token);
            formData.append('method', options.method || 'compress');
            formData.append('file', data, { filename: filepath.split('/').pop() });
            formData.append('to', options.to || 'webp');
          }
        });
      });
    } catch (err) {
      logger.error(`${PLUGIN_NAME} error : ${err.message}`)
      grunt.fail.fatal(`${PLUGIN_NAME} error : ${err.message}`);
    }
  });
};