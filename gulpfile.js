const gulp = require("gulp");
const workbox = require("workbox-build");
const shell = require("gulp-shell");

gulp.task("hugo-build", shell.task(["hugo --gc --minify --cleanDestinationDir"]));

gulp.task("hugo-algolia", shell.task(["hugo-algolia -s"]));

gulp.task('generate-service-worker', () => {
    return workbox.injectManifest({
        swSrc: './sw-template.js',
        swDest: './public/sw.js',
        globDirectory: './public',
        globPatterns: [
            "**/*.{css,js,ttf,woff,otf,woff2,json}"
        ],
        modifyURLPrefix: {
            "": "./"
        }
    });
});

gulp.task("build", gulp.series("hugo-build", "hugo-algolia", "generate-service-worker"));

