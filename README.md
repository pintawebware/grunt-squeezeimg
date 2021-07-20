# squeezeimg grunt

The Grunt Squeezeimg plugin is destined to optimize unlimited images without any visible loss in quality.

Using the plugin Grunt Squeezeimg you can easily minify the size of all your images, speed up loading of your websites and applications.

You can compress your images of such formats - .png, .jpg/.jpeg, .gif, .svg, .bmp, .tiff.

Also plugin allows you to convert your images to webP and jp2 format.

Try the plugin functions right now. To do this, go to https://squeezeimg.com/.

## Install

```sh
$ npm install --save-dev @pintawebware/grunt-squeezeimg
```

## Usage

 Gruntfile.js 
```js

module.exports = function (grunt) {
    grunt.initConfig({
    squeezeimg: {
        taskName: {
            options: {
                token: 'Your API token',
                qlt: 60,
                method: 'compress',
                to: 'webp',
                rename: true
                },
            src: 'images/*',
            dest: 'dest/'
            }
      }
    });
    grunt.loadNpmTasks('@pintawebware/grunt-squeezeimg');
    grunt.registerTask('default', ['squeezeimg']);
  };

```

## API

### squeezeimg(option)

#### Options
### token : 
 'Your API token', https://squeezeimg.com/account/api  or https://squeezeimg.com-> My account-> Api
### qlt :
 Quality precentage (max 80), default 60
### method : 
'convert or compress', default 'compress'
### to
convert to format ( jp2, webp, avif ) default 'webp'
### rename 
rename image, default false ( If true, the file name is assigned by the server )


### License MIT License (c) PintaWebware