'use strict';

const request = require('request');
const path = require('path');

const PLUGIN_NAME = 'grunt-squeezeimg'
const URL = 'https://api.squeezeimg.com/plugin';
const EXTENSIONS = ['.jpg', '.png', '.svg', '.jpeg', '.jp2', '.gif', '.tiff', '.bmp', '.PNG', '.JPEG', '.GIF', '.SVG', '.TIFF', '.BMP',];

module.exports = function (grunt) {
  grunt.registerMultiTask('squeezeimg', function () {
    if (!this.files[0]) {
      grunt.fail.fatal('No src or invalid src provided.');
      return;
    }
    grunt.file.preserveBOM = false;
    var done = this.async();
    var options = this.options();
    if (!options.token) {
      grunt.fail.fatal(`${PLUGIN_NAME}  error : Not token options`);
  }
    let dest = this.files[0].orig.dest;
    let count = 0;
    try {
      this.files.forEach(function (f) {
        var src = f.src.map(function (filepath) {
          if (EXTENSIONS.includes(`.${filepath.split('.').pop()}`)) {
            count++;
            let req = request.post({ url: URL, encoding: 'binary' }, (err, resp, body) => {
              if (err) {
                grunt.fail.fatal(`${PLUGIN_NAME} error : ${err.message}`);
              } else if (resp.statusCode === 200) {
                let filename = filepath.split('/').pop();
                if (options.rename) {
                  filename = resp.headers["content-disposition"].split('=').pop().replace(/"/g, '');
                }
                filename = filename.replace(path.extname(filename), path.extname(resp.headers["content-disposition"].split('=').pop().replace(/"/g, '')));
                grunt.file.write(`${dest}${filename}`, Buffer.from(body, 'binary'));

              } else if (resp.statusCode !== 504) {
                let str = Buffer.from(body, 'binary').toString();
                let res = {};
                try {
                  res = JSON.parse(str);
                } catch (err) { }
                grunt.fail.fatal(`${PLUGIN_NAME} error : ${res.error || res.message || str}`);
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
      grunt.fail.fatal(`${PLUGIN_NAME} error : ${err.message}`);
    }
  });
};