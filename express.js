var express = require('express');
var multipart = require('connect-multipart-gridform');
var mongodb = require('mongodb');
var consolidate = require('consolidate');
var MongoClient = mongodb.MongoClient;

stashed change check pishkoooooo
piskkkk123232132131

MongoClient.connect('mongodb://CMP:CMP@localhost/CMP', function (err, db) {
    if (err) throw err;
    createApp(db);
});

function createApp(db) {
    var app = express();

    app.configure(function () {
        app.set('port', process.env.PORT || 3004);
        //app.set('views', __dirname + '/views');
        //app.set('view engine', 'jade');

        // assign the template engine to .html files
        app.engine('html', consolidate['swig'])
        // set .html as the default extension
        app.set('view engine', 'html');

        // Set views path, template engine and default layout
        //app.set('views', config.root + '/public/views');
        app.set('views', __dirname + '/public/views');

        // Enable jsonp
        app.enable('jsonp callback');
        app.use(express.logger('dev'));
        app.use(express.methodOverride());
        app.use(multipart({
            db: db,
            mongo: mongodb
        }));
        app.use(app.router);

        // Setting the fav icon and static folder
        app.use(express.favicon());
        app.use(express.static(__dirname + '/public'));
    });

    // You may want to read this post which details some common express / multipart gotchas:
    // http://stackoverflow.com/questions/11295554/how-to-disable-express-bodyparser-for-file-uploads-node-js

    var fileController = require('./server/controllers/fileController')(db);
    var article = require('./server/controllers/articles')(db);
    var category = require('./server/controllers/categories')(db);
    var index = require('./server/controllers/index')(db);

    app.get('/articles', article.findAll);
    app.get('/article/:articleId', article.findById);
    app.get('/articles/:categoryId', article.findAllInCategory);
    app.get('/categories', category.findAll);

    app.get('/', index.render);
    //app.get('/', fileController.getFiles, fileController.index);
    app.post('/', fileController.showUploadFiles, fileController.updateMetadata, fileController.index);
    app.get('/download/:fileId', fileController.download);
    app.get('/remove/:fileId', fileController.remove, fileController.getFiles, fileController.index);

    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

