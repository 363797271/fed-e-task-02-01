// 实现这个项目的构建任务
/*
gulp任务：
1. 编译输出scss文件 gulp-sass
2. 编译输出js文件 gulp-babel @babel/core @babel/preset-env
3. 拷贝public目录下文件和字体文件
4. 压缩输出图片文件 gulp-imagemin
5. 编译输出html文件 gulp-swig
6. 清理dist .tmp del
7. 启动一个服务器 browser-sync 
8. 监听文件改动，自动编译，刷新页面
10. 合并html中引用的资源 gulp-useref
11. 压缩css html js gulp-uglify gulp-htmlmin gulp-clean-css
*/

const {src, dest, watch, series, parallel} = require('gulp')
const del = require('del')
const browserSync = require('browser-sync')
const cwd = process.cwd()

// 插件管理
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

// 创建服务器
const bs = browserSync.create()

// 配置信息
let config = {
  build: {
    src: 'src',
    dest: 'release',
    temp: '.tmp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}
try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) {}



// 定义任务--------------------

const { build: cBuild } = config
const { paths } = cBuild

// 清除dist
const clean = () => {
  return del([cBuild.dest, cBuild.temp])
}

// 编译sass
const styles = () => {
  return src(paths.styles, {
    cwd: cBuild.src,
    base: cBuild.src
  })
    .pipe(plugins.sass({
      sourceMap: true,
      outputStyle: 'expanded'
    }))
    .pipe(dest(cBuild.temp))
    .pipe(bs.reload({stream: true}))
}

// 编译js
const scripts = () => {
  return src(paths.scripts, {
    cwd: cBuild.src,
    base: cBuild.src
  })
    .pipe(plugins.babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest(cBuild.temp))
    .pipe(bs.reload({stream: true}))
}

// 编译模板
const pages = () => {
  return src(paths.pages, {
    cwd: cBuild.src,
    base: cBuild.src
  })
    .pipe(plugins.swig({
      data: config.data,
      defaults: {
        cache: false
      }
    }))
    .pipe(dest(cBuild.temp))
    .pipe(bs.reload({stream: true}))
}

// 图片压缩
const images = () => {
  return src(paths.images, {
    cwd: cBuild.src,
    base: cBuild.src
  })
    .pipe(plugins.imagemin())
    .pipe(dest(cBuild.dest))
}

// 拷贝字体
const fonts = () => {
  return src(paths.fonts, {
    cwd: cBuild.src,
    base: cBuild.src
  })
    .pipe(dest(cBuild.dest))
}

// 拷贝public
const public = () => {
  return src('**', {
    cwd: cBuild.public,
    base: cBuild.public
  })
    .pipe(dest(cBuild.dest))
}

// 合并资源
const useref = () => {
  return src(paths.pages, {
    cwd: cBuild.temp,
    base: cBuild.temp
  })
    .pipe(plugins.useref({
      searchPath: [cBuild.temp, '.']
    }))

    // 压缩
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))

    .pipe(dest(cBuild.dest))
}

// 启动服务器
const serve = () => {
  watch(paths.styles, { cwd: cBuild.src }, styles)
  watch(paths.scripts, { cwd: cBuild.src }, scripts)
  watch(paths.pages, { cwd: cBuild.src }, pages)

  watch([
    paths.fonts,
    paths.images,
    cBuild.public
  ], {
    cwd: cBuild.src
  }, bs.reload)

  bs.init({
    port: 8080,
    server: {
      baseDir: [cBuild.temp, cBuild.src, cBuild.public],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}


// 编译任务
const compile = parallel(styles, scripts, pages)

// 打包
const build = series(
  clean,
  parallel(
    series(compile, useref),
    images,
    fonts,
    public
  )
)

// 开发
const dev = series(clean, compile, serve)

module.exports = {
  clean,
  build,
  dev
}

