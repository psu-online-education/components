const gulp = require('gulp');

/**
 * Updates a file which contains a random build ID.
 *
 * This update will trigger an automatic pattern lab rebuild.
 */
const update_build_id = done => {
  require('fs').writeFileSync(
    'packages/patternlab/source/patterns/build.json',
    JSON.stringify({build_id: require('crypto').randomBytes(20).toString('hex')})
  );
  done();
};

/**
 * Compiles SCSS sources into an optimized build artifact.
 */
const compile_scss = done => {
  const fs = require('fs');
  const sass = require('gulp-sass')(require('sass'));
  const components = fs.readdirSync('packages').filter(function(file) {
    return file !== 'patternlab';
  });

  components.forEach(function(component) {
    const dist = 'packages/' + component + '/dist';

    if (fs.existsSync('packages/' + component + '/src/scss/styles.scss')) {
      gulp.src('packages/' + component + '/src/scss/styles.scss')
        .pipe(sass({
          style: 'compressed',
          precision: 6,
        })).on('error', sass.logError)
        .pipe(gulp.dest(dist));
    }
  });
  done();
};

const compile_twig = done => {
  done();
};

/**
 * Compiles JS sources into an optimized build artifact.
 */
const compile_js = done => {
  const fs = require('fs');
  const uglify = require('gulp-uglify-es').default;
  const components = fs.readdirSync('packages').filter(function(file) {
    return file !== 'patternlab';
  });

  components.forEach(function(component) {
    const dist = 'packages/' + component + '/dist';

    const js_src = 'packages/' + component + '/src/js/scripts.js';
    if (fs.existsSync(js_src)) {
      gulp.src(js_src)
        .pipe(uglify())
        .pipe(gulp.dest(dist));
    }
  });
  done();
};

/**
 * Compiles sprites into an optimized build artifact.
 */
const compile_sprites = function(done) {
  const fs = require('fs');
  const svgSprite = require('gulp-svg-sprite');
  const htmlmin = require('gulp-htmlmin');

  gulp.src('packages/sprite/src/assets/*.svg')
    .pipe(svgSprite({
      svg: {
        namespaceIDs: false,
        namespaceClassnames: false,
        xmlDeclaration: false,
        doctypeDeclaration: false,
      },
      mode: {
        defs: {
          inline: true,
        },
      },
      shape: {
        transform: [],
      }
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('packages/sprite/dist'))
    .on('end', () => {
      fs.copyFileSync('packages/sprite/dist/defs/svg/sprite.defs.svg', 'packages/sprite/dist/sprites.svg');
      fs.rmSync('packages/sprite/dist/defs/', { recursive: true });
    });
  done();
};

/**
 * Watches the sprite component for changes to SVG assets.
 */
const watch_sprites = () => {
  gulp.watch(
    'packages/sprite/src/assets',
    gulp.series(compile_sprites, update_build_id)
  );
};

/**
 * Watches all components for changes to CSS assets.
 */
const watch_scss = () => {
  gulp.watch(
    'packages/*/src/scss/*',
    gulp.series(compile_scss, update_build_id)
  );
};

/**
 * Watches all components for changes to JS assets.
 */
const watch_js = () => {
  gulp.watch(
    'packages/*/src/js/*',
    gulp.series(compile_js, update_build_id)
  );
};

/**
 * Watches all components for changes to twig templates.
 */
const watch_twig = () => {
  gulp.watch(
      'packages/*/*.twig',
      gulp.series(compile_twig, update_build_id)
  );
};

/**
 * Starts a local server instance of Pattern Lab and watches for changes.
 */
const watch_patternlab = () => {
  require('gulp-run')('patternlab serve --config packages/patternlab/patternlab-config.json').exec();
};


gulp.task('update_build_id', update_build_id);

gulp.task('compile_scss', gulp.series(compile_scss, update_build_id));
gulp.task('compile_js', gulp.series(compile_js, update_build_id));
gulp.task('compile_sprites', gulp.series(compile_sprites, update_build_id));
gulp.task('compile_twig', gulp.series(compile_twig, update_build_id));

gulp.task('compile_all', gulp.series(
  gulp.parallel(
    compile_scss,
    compile_js,
    compile_sprites,
    compile_twig
  ),
  update_build_id
));

gulp.task('default', gulp.series(
  gulp.parallel(
    compile_scss,
    compile_js,
    compile_sprites,
    compile_twig
  ),
  //update_build_id,
  gulp.parallel(
  //  watch_scss,
  //  watch_js,
   // watch_sprites,
    //watch_twig,
    watch_patternlab
  )
));


