#!/usr/bin/env node

const fs = require('fs');
const browserify = require('browserify');

browserify({ entries: ["./scripts/try.js"] })
    .transform("babelify", {
        global: true,
        only: /^.*$/,
        presets: ["es2015", "es2016", "es2017", "react"]
    })
    .bundle()
    .pipe(fs.createWriteStream("./scripts/try.js"));