BBMarionetteProject: A Backbone.Marionette Application

## See It In Action
This is a sample application, based on
[Backbone.Marionette](http://github.com/marionettejs/backbone.marionette)
plugin for Backbone.js. You can see it in action at:

http://minus.zapto.org

## Running BBMarionetteProject On Your Computer

BBMarionetteProject is a NodeJS app built on Express.js using MVC architecture.
As the database uses MongoDB. Transferring data between client and server is done
via WebSocket. The project involves uploading data, namely, audio and image files.
After loading the data, server parses them. If files has mime type "audio/..", (mp4, ogg, wav or wma)
it will convert them to mp3 format. Other formats are ignored. Also provided loading image files for avatars.
Working with image content is done by libraries libvips. For generates styles using CSS preprocessor SASS. All code written AMD module structure via RequireJS.
To run project on your
computer you'll want to clone this repository to your machine somewhere,
and then follow these steps:

1. Install the latest [node.js](http://nodejs.org) if you don't have it already

2. Install [MongoDB]( http://docs.mongodb.org/manual/installation/)

3. Install Sass
    1. You'll need to install Ruby. Run following in your command prompt / terminal
     ```
     sudo apt-get install ruby-full rubygems1.8 &&
     gem install sass
    ```
4. Install Compass
    ` sudo gem install compass`
    Configuration file in [config.rb](https://github.com/FarhodKurbonov/BBMarionetteProject/blob/master/config.rb)

5. Install [bootsrap-sass](https://github.com/twbs/bootstrap-sass#b-compass-without-rails)

6. Install ffmpeg. Clone [that](https://gist.github.com/e4f713c8cd1a389a5917.git) .sh file and run following:
    `cd   /path/to/file`, ` chmod +x filename.sh`,  `sudo ./filename.sh`

7. Install  image processing library libvips (need for resize and other handle with images)
        run the following as a user with `sudo` access:

          `curl -s https://raw.githubusercontent.com/lovell/sharp/master/preinstall.sh | sudo bash -`

       or run the following as `root`:

          `curl -s https://raw.githubusercontent.com/lovell/sharp/master/preinstall.sh | bash -`

       The [preinstall.sh](https://github.com/lovell/sharp/blob/master/preinstall.sh) script requires `curl` and `pkg-config`.
8. If you want work with Grunt Task Manager, you will need install it also
    Configuration file [gruntfile.js](https://github.com/FarhodKurbonov/BBMarionetteProject/blob/master/gruntfile.js)
9. Open a command prompt / terminal window in the BBMarionetteProject project folder
10. Run `npm install` to install all of the needed components
11. Run `npm start` to start the server
12. Open http://localhost:3000 in your browser


Note that step 1 through 10 only have to be done once. After you have
done that, you just need to run step 11 and 12 any time you want to
see the app running on your computer.

## A Work In Progress

This project is always a work in progress. This project does not claim to be production version.  While there is still a lot of bugs needed to fix. I would be grateful if you give your assessment of this project as well as your recommendations. And I accept your pull reguests.

Also note that I haven't optimized the JavaScript downloads in any way. There
is no minification, and no asset packaging to create a single download for the
entire application at this point. As a result, the app takes a moment or two
to download all of the JavaScript files and start up.

I continue working on functionality of this app.


