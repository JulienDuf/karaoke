const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

const tsProject = ts.createProject("tsconfig.json");

let node = null;

gulp.task("build", function() {
    return tsProject
        .src()
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(tsProject())
        .js.pipe(sourcemaps.write())
        .pipe(gulp.dest("build"));
});

gulp.task("lint", function() {
    return tsProject
        .src()
        .pipe(tslint({ formatter: "stylish" }))
        .pipe(tslint.report({ summarizeFailureOutput: true }));
});

gulp.task("default", gulp.series("build", "lint"));

gulp.task("dev", gulp.series("build"));

process.on("exit", function() {
    if (!!node) {
        node.kill();
    }
});
