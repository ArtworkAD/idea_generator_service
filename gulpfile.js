const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('watch', function() {
	gulp.watch(['*.js', 'app/*.js', 'spec/**/*.spec.js'], ['nodemon']);
});

gulp.task('nodemon', function() {
	nodemon({
		script: 'app.js',
		nodeArgs: ['--harmony_async_await', '--harmony']
	}).on('restart');
});

gulp.task('default', ['nodemon']);
