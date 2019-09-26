const del = require("del");
const gulp = require("gulp");
const log = require("fancy-log");
const plumber = require("gulp-plumber");

const less = require("gulp-less");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const pxtransform = require("postcss-pxtransform");

const ts = require("gulp-typescript");
const insert = require("gulp-insert");
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
    .pipe(
      // 注入 less全局变量
      insert.transform((contents /* , file */) => {
        contents = `@import 'src/styles/variables.less';${contents}`;
        return contents;
      })
    )
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

/**
 * 生成`project.config.js`文件，同时修改appid
 */
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

  // 遍历环境变量，筛选指定内容，注入到 config.json
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

function watch() {
  const { tsFiles, wxmlFiles, lessFiles, lessDir, staticFiles, envFiles, projectConfigFile } = paths.src;

  gulp.watch(tsFiles, tsCompile);
  gulp.watch(wxmlFiles, wxmlCompile);
  gulp.watch(staticFiles, copyStatic);
  gulp.watch(lessDir, lessCompile);
  gulp.watch(lessFiles, lessCompile);

  gulp.watch(envFiles, injectGlobalConfig);
  gulp.watch(projectConfigFile, buildProjectConfig);
}

exports.build = gulp.series(
  cleanDist,
  buildProjectConfig,
  gulp.parallel(copyStatic, wxmlCompile, tsCompile, lessCompile),
  injectGlobalConfig
);

exports.default = gulp.series(exports.build, watch);
