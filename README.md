# squeezeimg grunt

The Grunt Squeezeimg plugin is destined to optimize unlimited images without any visible loss in quality.

Using the plugin Grunt Squeezeimg you can easily minify the size of all your images, speed up loading of your websites and applications.

You can compress your images of such formats - .png, .jpg/.jpeg, .gif, .svg, .bmp, .tiff.

Also plugin allows you to convert your images to webP and jp2 format.

Try the plugin functions right now. To do this, go to https://squeezeimg.com/.

## Install

```sh
$ npm install --save-dev grunt-squeezeimg
```

## Usage

 Gruntfile.js 
```js

module.exports = function (grunt) {
    grunt.initConfig({
    squeezeimg: {
        taskName: {
            options: {
                tables: true,
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
    grunt.loadNpmTasks('grunt-squeezeimg');
    grunt.registerTask('default', ['squeezeimg']);
  };

```

## API

### squeezeimg(option)

#### Options
### token : 
 'Your API token', https://squeezeimg.com/
### qlt :
 Quality precentage (max 80), default 60
### method : 
'convert or compress', default 'compress'
### to
convert to format ( jp2, webp ) default 'webp'
### rename 
rename image, default false


### License MIT License (c) PintaWebware