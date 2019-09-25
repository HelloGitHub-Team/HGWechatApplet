const path = require("path");
const del = require("del");
const gulp = require("gulp");
const log = require("fancy-log");
const plumber = require("gulp-plumber");

const less = require("gulp-less");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const pxtransform = require("postcss-pxtransform");

const ts = require("gulp-typescript");
const replace = require("gulp-replace");
const jsonEditor = require("gulp-json-editor");

const loadEnv = require("./tools/loadEnv");

// 加载环境变量
loadEnv();

const paths = {
  src: {
    baseDir: "src",
    tsFiles: "src/**/*.ts",
    lessDir: "src/styles",
    lessFiles: ["src/**/*.less", "!src/styles/**/*.less"],
    wxmlFiles: "src/**/*.wxml",
    staticFiles: ["src/**/*.{png,js,json}", "!src/config.json"],
    envFiles: [".env", ".env.local"],

    // 项目配置文件
    projectConfigFile: "project.config.json",
    // 应用全局配置文件
    appGlobalConfigFile: "dist/config.js"
  },

  dist: {
    baseDir: "dist"
  }
};

function tsCompile() {
  const tsProject = ts.createProject("tsconfig.json");
  const tsResult = gulp
    .src(paths.src.tsFiles)
    .pipe(plumber())
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest(paths.dist.baseDir));
}

function lessCompile() {
  /**
   * postcss-pxtransform
   *
   * @link https://github.com/NervJS/taro/tree/master/packages/postcss-pxtransform
   */
  const transformOpt = { platform: "weapp", designWidth: 750 };

  return gulp
    .src(paths.src.lessFiles)
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([pxtransform(transformOpt)]))
    .pipe(rename({ extname: ".wxss" })) // 修改后缀
    .pipe(gulp.dest(paths.dist.baseDir));
}

function wxmlCompile() {
  return gulp.src(paths.src.wxmlFiles).pipe(gulp.dest(paths.dist.baseDir));
}

function copyStatic() {
  return gulp.src(paths.src.staticFiles).pipe(gulp.dest(paths.dist.baseDir));
}

function buildProjectConfig() {
  return (
    gulp
      .src(paths.src.projectConfigFile)
      .pipe(plumber())
      // 替换生产环境 Appid
      .pipe(jsonEditor({ miniprogramRoot: "./", appid: process.env.APPID }))
      .pipe(gulp.dest(paths.dist.baseDir))
  );
}

/**
 * 注入全局变量
 *
 * ! 注意：这里只筛选了以"APP_"开头的环境变量，其他非"APP_"开头的环境变量不允许动态注入
 */
function injectGlobalConfig() {
  const config = {};
  const prefix = "APP_";

  // 遍历环境变量，筛选指定内容，注入 config.json
  const keys = Object.keys(process.env).filter(key => key.startsWith(prefix));
  keys.forEach(key => {
    config[key] = process.env[key];
  });

  log.info("替换全局变量：");
  return gulp
    .src(paths.src.appGlobalConfigFile)
    .pipe(plumber())
    .pipe(
      // 匹配双下划线
      replace(/__(.*)__/g, (match, p1) => {
        const res = config[p1];
        log.info(`replace "${p1}" -> ${res}`);
        return res;
      })
    )
    .pipe(gulp.dest(paths.dist.baseDir));
}

function cleanDist() {
  return del(paths.dist.baseDir);
}

function watch(callback) {
  const watcher = gulp.watch([paths.src.baseDir, paths.src.projectConfigFile], { ignored: /[\/\\]\./ });

  watcher.on("change", file => {
    log.info(`File ${file} was changed`);
    fileChangHandler(file);
  });

  watcher.on("add", file => {
    log.info(`File ${file} was added`);
    fileChangHandler(file);
  });

  watcher.on("unlink", file => {
    log.info(`File ${file} was removed`);
    fileChangHandler(file);
  });

  callback && callback();
}

function fileChangHandler(file) {
  if (file === paths.src.projectConfigFile) {
    return buildProjectConfig();
  }

  if (file === paths.src.appGlobalConfigFile && paths.src.envFiles.includes(file)) {
    return injectGlobalConfig();
  }

  const extname = path.extname(file);

  switch (extname) {
    case ".wxml":
      wxmlCompile();
      break;
    case ".less":
      lessCompile();
      break;
    case ".ts":
      tsCompile();
    default:
      copyStatic();
  }
}

exports.build = gulp.series(
  gulp.series(cleanDist, buildProjectConfig, copyStatic, tsCompile, wxmlCompile, lessCompile, injectGlobalConfig)
);

exports.default = gulp.series(exports.build, watch);
