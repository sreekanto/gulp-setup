const gulp = require('gulp')
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const concat = require("gulp-concat");
const minify = require('gulp-minify');
var imagemin = require('gulp-imagemin');
//variable for file manage
const [sassSource, 
		sassOutput, 
		pugSource, 
		pugOutput,
		imageSource,
		imageOutput,
		jsSource,
		jsOutput
	] = [
	'src/sass/**/*.+(scss|sass)', 
	'dist/assets/css', 
	'src/pug/**/*.pug', 
	'dist',
	'src/images/**/*.+(png|jpg|gif|svg)',
	'dist/assets/images',
	'src/js/**/*.js',
	'dist/assets/js'
	]
//task console for test
gulp.task('console', () => console.log('gulp starting...'))
//create function for sass compile
const sassCompile = () =>{
	//source file
	return gulp.src(sassSource)
	//compile through sass
          .pipe(sass({
	        	outputStyle: 'expanded'
	        }).on('error', sass.logError))
    //clean unuse css 
          .pipe(cleanCSS({
			    debug: true,
			    compatibility: 'ie8',
			    level: {
			        1: {
			            specialComments: 0,
			        },
			      },
			}))
    //prefix add for browser
          .pipe(autoprefixer('last 10 versions'))
    //concat in one file
          .pipe(concat('style.css'))
    //live reload
          .pipe(browserSync.reload({
               stream:true
           }))
    //file output
          .pipe(gulp.dest(sassOutput))
}
//task for sass compile
gulp.task('sass', () => sassCompile())
//create function for pug compilr
const pugCompine = () => gulp.src(pugSource)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(pugOutput))

//task for pug file compile
gulp.task('pug', () => {
    pugCompine()
});
//create function for js compilr
const jsCompile = () => {
	return gulp.src(jsSource)
            .pipe(babel({presets: ['@babel/preset-env'] })) 
            .pipe(concat('main.js'))
            .pipe(minify({
            	ext:{
	            src:'.min.js',
	            min:'.js'
	        }
            }))
            .pipe(gulp.dest(jsOutput))
            .pipe(browserSync.stream());
}
//task for js
gulp.task('js', async () => jsCompile());
//create function for image compile
const imageCompile = () => {
	return gulp.src(imageSource)
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest(imageOutput))
}
//task for images
gulp.task('image', () => imageCompile());

//gulp default
gulp.task('default', () => {
	pugCompine()
	sassCompile()
	jsCompile()
	imageCompile()
	//gulp.start('pug', 'sass', 'js', 'image')
	gulp.watch(pugSource, gulp.series('pug'))
    gulp.watch(sassSource, gulp.series('sass'))
	gulp.watch(jsSource, gulp.series('js'))
    gulp.watch(imageSource, gulp.series('image'))
	gulp.watch('dist').on('change', browserSync.reload)
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	})
})



