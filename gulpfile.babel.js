/**
 * Amaze UI Touch Building Tasks
 */

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from './webpack.config';
import webpackConfigDev from './webpack.docs.babel';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const banner = `/** ${pkg.title} v${pkg.version} | by Amaze UI Team
  * (c) ${$.util.date(Date.now(), 'UTC:yyyy')} AllMobilize, Inc., Licensed under ${pkg.license}
  * ${$.util.date(Date.now(), 'isoDateTime')}
  */
  `;

const paths = {
  scss: 'scss/amazeui.touch.scss',
  scssModules: 'scss/**/*.scss',
  fonts: 'scss/fonts/*',
  jsEntry: 'js/index.js',
  dist: 'dist',
  docsDist: 'www',
};

const autoprefixerOptions = {
  browsers: ['> 1%', 'last 2 versions', 'ie 10']
};

const replaceVersion = function() {
  return $.replace('__VERSION__', pkg.version);
};

const addBanner = function() {
  return $.header(banner);
};

gulp.task('clean', () => {
  return del(['dist', 'www', 'lib']);
});

/**
 * Build Amaze UI Touch
 */

gulp.task('build:clean', () => {
  return del([paths.dist, 'lib']);
});

gulp.task('style:scss', () => {
  return gulp.src(paths.scss)
    // inject fonts path
    .pipe($.replace(/\/\/ INJECT_SASS_VAR/g, ''))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      importer: require('node-sass-import-once'),
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe(addBanner())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .pipe($.csso())
    .pipe(addBanner())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('style:fonts', () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('style', ['style:scss', 'style:fonts', 'style:watch']);

gulp.task('build:style', ['style:scss', 'style:fonts']);

gulp.task('style:watch', () => {
  gulp.watch(paths.scssModules, ['style:scss'])
})

// transform ES6 & JSX into sigle file
gulp.task('build:babel', () => {
  return gulp.src('js/**/*')
    .pipe(replaceVersion())
    // .pipe($.replace(/(import '\.\.\/scss\/components)/g, '// $1'))
    .pipe($.babel({
      plugins: require('./scripts/babel-require-ignore'),
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('build:pack', () => {
  return gulp.src(paths.jsEntry)
    .pipe(webpackStream(webpackConfig))
    .pipe(replaceVersion())
    .pipe(addBanner())
    .pipe($.rename('amazeui.touch.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe($.uglify())
    .pipe(addBanner())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('zip', () => {
  return gulp.src(`${paths.dist}/**`)
  .pipe($.zip(`${pkg.version}.zip`))
  .pipe(gulp.dest(paths.docsDist))
})

gulp.task('copy', () => {
  return gulp.src(`${paths.dist}/**`)
  .pipe(gulp.dest(`${paths.docsDist}/${pkg.version}`))
})

gulp.task('build:showsize', () => {
  return gulp.src(`${paths.dist}/**`)
  .pipe($.size({
    title: 'files size: ',
    showFiles: true
  }))
})

gulp.task('build', (callback) => {
  return runSequence(
    'build:clean',
    ['build:style', 'build:babel', 'build:pack'],
    'build:showsize',
    callback
  );
})

gulp.task('deploy', () => {
  runSequence(
    'build',
    'zip',
    'copy'
  )
})


gulp.task('watch', () => {
  gulp.watch('js/**/*.js', ['build:babel']);
});

/**
 * Dev server
 */
gulp.task('docs:clean', () => {
  return del(paths.docsDist);
});

gulp.task('server', () => {
  const bundler = webpack(webpackConfigDev);
  const bs = browserSync.create();

  bs.init({
    open: false,
    logPrefix: 'AMT',
    port: 9527,
    server: {
      baseDir: [paths.docsDist],
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: '/', // webpackConfigDev.output.publicPath,
          stats: {colors: true}
        }),
        webpackHotMiddleware(bundler)
      ]
    },
  });
});

gulp.task('docs', (callback) => {
  runSequence('docs:clean', 'server', callback);
});

gulp.task('default', ['style', 'docs']);
