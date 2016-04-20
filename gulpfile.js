var mod;
var option = {
    postcssPath: './webapp/postcss',
    cssDest: './webapp/css',
    imgPath: './webapp/images',
    pathSever: './webapp',
    jsPath: './webapp/js',
    jadePath: './webapp/jade',
    dir: ['./webapp', './webapp/css', './webapp/postcss', './webapp/js', './webapp/images', './webapp/images/icon', './webapp/jade']
};


var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    opn = require('opn'),
    cleanf = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require("gulp-rename"),
    copy = require("gulp-copy"),
    autorem = require('autorem'),
    browserSync = require('browser-sync'),
    cssMqpacker = require('css-mqpacker'),
    atImport = require("postcss-import"),
    opacity = require('postcss-opacity'),
    del = require('del'),
    autoprefixer = require('autoprefixer'),
    cache = require('gulp-cache'),
    gulpPostcss = require('gulp-postcss'),
    postcss = require('postcss'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminOptipng = require('imagemin-optipng'),
    postcssShort = require('postcss-short'),
    postcssSorting = require('postcss-sorting'),
    sprites = require('postcss-sprites').default,
    updateRule = require('postcss-sprites').updateRule,
    reload = browserSync.reload,
    postcssNested = require('postcss-nested'),
    crip = require('postcss-crip'),
    clean = require('postcss-clean'),
    ip = require('ip'),
    ipn = ip.address(),
    zip = require('gulp-zip'),
    jade = require('gulp-jade'),
    fs = require('fs'),
    notify = require('gulp-notify');





// pc模式(px模式)
gulp.task('ppx', function() {
    var processors = [
        require('precss')({}),
        sprites({
            stylesheetPath: option.cssDest,
            spritePath: option.imgPath,
            basePath: option.imgPath + '/icon',
            spritesmith: {
                padding: 5
            },
            hooks: {
                onUpdateRule: function(rule, token, image) {
                    var backgroundSizeX = image.spriteWidth;
                    var backgroundSizeY = image.spriteHeight;
                    var backgroundPositionX = image.coords.x;
                    var backgroundPositionY = image.coords.y;
                    backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
                    backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
                    backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
                    backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

                    var backgroundImage = postcss.decl({
                        prop: 'background-image',
                        value: 'url(' + image.spriteUrl + ')'
                    });

                    var backgroundSize = postcss.decl({
                        prop: 'background-size',
                        value: backgroundSizeX + 'px ' + backgroundSizeY + 'px'
                    });

                    var backgroundPosition = postcss.decl({
                        prop: 'background-position',
                        value: -backgroundPositionX + 'px ' + -backgroundPositionY + 'px'
                    });

                    var minSpriteWidth = postcss.decl({
                        prop: 'width',
                        value: image.coords.width + 'px'
                    });

                    var minSpriteHeight = postcss.decl({
                        prop: 'height',
                        value: image.coords.height + 'px'
                    });

                    rule.insertAfter(token, backgroundImage);
                    rule.insertAfter(backgroundImage, backgroundPosition);
                    rule.insertAfter(backgroundPosition, backgroundSize);
                    rule.insertAfter(minSpriteWidth, minSpriteWidth);
                    rule.insertAfter(minSpriteHeight, minSpriteHeight);
                }
            },

            filterBy: function(image) {
                if (!/\icon/.test(image.url))
                    return Promise.reject();
                return Promise.resolve();
            }
        }),
        cssMqpacker({
            sort: function(a, b) {
                return a.localeCompare(b);
            }
        }),
        autoprefixer({
            browsers: [
                'last 9 versions'
            ]
        }),
        postcssSorting({
            "sort-order": "yandex"
        }),
        postcssShort,
        opacity,
        crip,
        clean,
    ];
    return gulp.src([option.postcssPath + '/**/*.css'])
        .pipe(plumber({ errorHandler: notify.onError("错误信息: <%= error.message %>") }))
        .pipe(gulpPostcss(processors))
        .pipe(gulp.dest(option.cssDest))
        .pipe(reload({ stream: true })),
        mod = 'ppx';
});
// 移动px(自己缩倍数)
gulp.task('mpx', function() {
    var processors = [
        require('precss')({}),
        sprites({
            stylesheetPath: option.cssDest,
            spritePath: option.imgPath,
            basePath: option.imgPath + '/icon',
            spritesmith: {
                padding: 10
            },
            hooks: {
                onUpdateRule: function(rule, token, image) {
                    var backgroundSizeX = image.spriteWidth;
                    var backgroundSizeY = image.spriteHeight;
                    var backgroundPositionX = (image.coords.x / 2);
                    var backgroundPositionY = (image.coords.y / 2);
                    backgroundSizeX = isNaN(backgroundSizeX) ? 0 : (backgroundSizeX / 2);
                    backgroundSizeY = isNaN(backgroundSizeY) ? 0 : (backgroundSizeY / 2);
                    backgroundPositionX = isNaN(backgroundPositionX) ? 0 : (backgroundPositionX / 2);
                    backgroundPositionY = isNaN(backgroundPositionY) ? 0 : (backgroundPositionY / 2);

                    var backgroundImage = postcss.decl({
                        prop: 'background-image',
                        value: 'url(' + image.spriteUrl + ')'
                    });

                    var backgroundSize = postcss.decl({
                        prop: 'background-size',
                        value: backgroundSizeX + 'px ' + backgroundSizeY + 'px'
                    });

                    var backgroundPosition = postcss.decl({
                        prop: 'background-position',
                        value: -backgroundPositionX + 'px ' + -backgroundPositionY + 'px'
                    });

                    var minSpriteWidth = postcss.decl({
                        prop: 'width',
                        value: image.coords.width + 'px'
                    });

                    var minSpriteHeight = postcss.decl({
                        prop: 'height',
                        value: image.coords.height + 'px'
                    });

                    rule.insertAfter(token, backgroundImage);
                    rule.insertAfter(backgroundImage, backgroundPosition);
                    rule.insertAfter(backgroundPosition, backgroundSize);
                    rule.insertAfter(minSpriteWidth, minSpriteWidth);
                    rule.insertAfter(minSpriteHeight, minSpriteHeight);
                }
            },

            filterBy: function(image) {
                if (!/\icon/.test(image.url))
                    return Promise.reject();
                return Promise.resolve();
            }
        }),
        cssMqpacker({
            sort: function(a, b) {
                return a.localeCompare(b);
            }
        }),
        autoprefixer({
            browsers: [
                'last 4 versions'
            ]
        }),
        postcssSorting({
            "sort-order": "yandex"
        }),
        postcssShort,
        crip,
        clean,
    ];
    return gulp.src([option.postcssPath + '/**/*.css'])
        .pipe(plumber({ errorHandler: notify.onError("错误信息: <%= error.message %>") }))
        .pipe(gulpPostcss(processors))
        .pipe(gulp.dest(option.cssDest))
        .pipe(reload({ stream: true })),
        mod = 'mpx';
});


// 移动rem模式
gulp.task('mrem', function() {
    var processors = [
        require('precss')({}),
        sprites({
            stylesheetPath: option.cssDest,
            spritePath: option.imgPath,
            basePath: option.imgPath + '/icon',
            spritesmith: {
                padding: 10
            },
            hooks: {
                onUpdateRule: function(rule, token, image) {
                    var backgroundSizeX = (image.spriteWidth / image.coords.width) * 100;
                    var backgroundSizeY = (image.spriteHeight / image.coords.height) * 100;
                    var backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
                    var backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

                    backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX.toFixed(3);
                    backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY.toFixed(3);
                    backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX.toFixed(3);
                    backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY.toFixed(3);

                    var backgroundImage = postcss.decl({
                        prop: 'background-image',
                        value: 'url(' + image.spriteUrl + ')'
                    });

                    var backgroundSize = postcss.decl({
                        prop: 'background-size',
                        value: backgroundSizeX + '% ' + backgroundSizeY + '%'
                    });

                    var backgroundPosition = postcss.decl({
                        prop: 'background-position',
                        value: backgroundPositionX + '% ' + backgroundPositionY + '%'
                    });

                    var minSpriteWidth = postcss.decl({
                        prop: 'width',
                        value: image.coords.width + 'px'
                    });

                    var minSpriteHeight = postcss.decl({
                        prop: 'height',
                        value: image.coords.height + 'px'
                    });

                    rule.insertAfter(token, backgroundImage);
                    rule.insertAfter(backgroundImage, backgroundPosition);
                    rule.insertAfter(backgroundPosition, backgroundSize);
                    rule.insertAfter(minSpriteWidth, minSpriteWidth);
                    rule.insertAfter(minSpriteHeight, minSpriteHeight);
                }
            },

            filterBy: function(image) {
                if (!/\icon/.test(image.url))
                    return Promise.reject();
                return Promise.resolve();
            }
        }),
        cssMqpacker({
            sort: function(a, b) {
                return a.localeCompare(b);
            }
        }),
        autoprefixer({
            browsers: [
                'last 4 versions'
            ]
        }),
        postcssSorting({
            "sort-order": "yandex"
        }),
        postcssShort,
        autorem({
            legacy: false,
            baseFontSize: 100,
            skipMediaQueries: true
        }),
        crip,
        clean
    ];
    return gulp.src([option.postcssPath + '/**/*.css'])
        .pipe(plumber({ errorHandler: notify.onError("错误信息: <%= error.message %>") }))
        .pipe(gulpPostcss(processors))
        .pipe(gulp.dest(option.cssDest))
        .pipe(reload({ stream: true })),
        mod = 'mrem';
});


// jade编译
gulp.task('jadeBuild', function() {
    return gulp.src(option.jadePath + '/**/*.jade')
        .pipe(plumber({ errorHandler: notify.onError("错误信息: <%= error.message %>") }))
        .pipe(jade({
            pretty: true,
            compileDebug: true
        }))
        .pipe(gulp.dest(option.pathSever))
});

// 压缩后打开图片文件
gulp.task('imgOpen', function() {
    opn(option.imgPath);
});

//压缩图片
gulp.task('imgmin', function() {
    var jpgmin = imageminJpegRecompress({
            accurate: true,
            quality: "high",
            method: "smallfry",
            min: 70,
            loops: 2,
            progressive: false,
            subsample: "default"
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 4
        });
    gulp.src([option.imgPath + '/**/*.*', '!' + option.imgPath + '/_imgbackups/**/*.*'])
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest(option.imgPath));
});

// 删除临时文件及其原图
gulp.task('clear', function() {
    return gulp.src([option.imgPath + '/_imgbackups'])
        .pipe(cleanf({ force: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('wat', function() {
    gulp.watch([
        option.postcssPath + '/**/*.css',
        option.pathSever + '/**/*.html',
        option.jadePath + '/**/*.jade',
        option.jsPath + '/**/*.js'
    ], [mod, 'jadeBuild']).on('change', reload)
});

// 监听文件
gulp.task('serve', function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['./webapp'],
            directory: true
        },
        open: 'external'
    })
    gulp.start('jadeBuild', 'wat')
})

// js脚本编译
gulp.task('scripts', function() {
    return gulp.src('./js/**/*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sourcemaps.write('.'))
        .pipe(seajs('mainID'))
        .pipe(gulp.dest('./js'))
        .pipe(reload({ stream: true }));
});


//将相关项目文件复制到dest 文件夹下
gulp.task('copy', function() {
    gulp.src(option.pathSever + '/*.html')
        .pipe(gulp.dest('./dest'));
    gulp.src(option.cssDest + '/**/*.css')
        .pipe(gulp.dest('./dest/css'));
    gulp.src(option.imgPath + '/**/*.*')
        .pipe(gulp.dest('./dest/images'));

});


// 防止图片压缩后无法恢复，做了备份
gulp.task('backups', function() {
    gulp.src([option.imgPath + '/**/*'])
        .pipe(gulp.dest(option.imgPath + '/_imgbackups'));
});


// 判断平台输出对应的斜杠
function pfmLine() {
    if (process.platform == 'darwin') {
        return '/'
    } else {
        return '\\'
    }
}


// 默认任务
gulp.task('default', ['ppx', 'serve'], function() {
    gulp.start('help')
});

// 编译
gulp.task('build', ['copy', 'scripts'], function() {});


// 帮助
gulp.task('help', function() {
    console.log('[\x1B[34mBS\x1B[39m] \x1B[34mAll API\x1B[39m:');
    console.log(' ---------------------------------------');
    console.log(' gulp                PC端px单位编译');
    console.log(' gulp init           初始化项目目录结构');
    console.log(' gulp px             移动端px单位编译');
    console.log(' gulp rem            移动端rem单位编译');
    console.log(' gulp help           gulp参数说明');
    console.log(' gulp bak            备份原始图片');
    console.log(' gulp min            压缩图片');
    console.log(' gulp clean          删除原始图片');
    console.log(' gulp zip            打包dest目录');
    console.log(' ---------------------------------------');
});

// 移动px
gulp.task('px', ['mpx', 'serve', 'createInfo'], function() {});
// 移动REM
gulp.task('rem', ['mrem', 'serve', 'createInfo'], function() {});

// 原始图片备份
gulp.task('bak', ['backups'], function() {
    console.log('您的原始图片已经备份至，当前文件夹‘_imgbackups’目录下！！')
});

// 图片压缩
gulp.task('min', ['imgmin', 'imgOpen', 'createInfo'], function() {
    console.log('您的原始图片已经备份至，当前文件夹‘_imgbackups’目录下！！')
    return gulp.src([option.imgPath + '/*.*']).pipe(size({ title: '图片压缩和Gzip压缩之后的大小为：', gzip: true }));
});

// 确定无误之后可以删除备份文件
gulp.task('clean', ['clear', 'createInfo'], function() {
    console.log('您已删除原始图片！！路径为：' + option.imgPath + '/_imgbackups')
});

gulp.task('createInfo', function() {
    var path = process.cwd();
    var pfm = path.split(pfmLine())[path.split(pfmLine()).length - 1];
    fs.open("README.md", "w", function(err, fd) {
        var buf = new Buffer(
            '#您的项目名:' + pfm + '\n\n' +
            '#项目平台:' + process.platform + '\n\n' +
            '#项目创建时间：' + (fs.statSync(process.cwd()).birthtime + '').slice(0, 24) + '\n\n' +
            '#最后修改时间：' + (fs.statSync(process.cwd()).mtime + '').slice(0, 24) + '\n\n'
        );
        fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
    })
});

// // 打包项目
gulp.task('zip', function() {
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }
    var d = new Date();
    var year = d.getFullYear();
    var month = checkTime(d.getMonth() + 1);
    var day = checkTime(d.getDate());
    var hour = checkTime(d.getHours());
    var minute = checkTime(d.getMinutes());

    return gulp.src(['./dest/**/*'])
        .pipe(zip(year + month + day + hour + minute + '.zip'))
        .pipe(gulp.dest('./zip'));
});

// 初始化文件
gulp.task('init', function() {
    for (var dirItem in option.dir) {
        if (!fs.existsSync(option.dir[dirItem])) {
            fs.mkdirSync(option.dir[dirItem]);
        } else {
            console.log('目录已经创建！')
        }
    }
    fs.open(".gitignore", "w", function(err, fd) {
        var buf = new Buffer(
            '/.sass-cache/' + '\n' +
            '.DS_Store ' + '\n' +
            'node_modules/' + '\n' +
            '.svn' + '\n' +
            '*.ini' + '\n' +
            '*.tmp' + '\n' +
            '*.doc' + '\n' +
            '*.dll' + '\n' +
            '*.txt' + '\n' +
            '*.exe' + '\n' +
            '*.bat' + '\n' +
            '*.log' + '\n' +
            '*.psd' + '\n' +
            '*.ai'
        );
        fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
    });

});
