const { src, dest, series, parallel, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

// gulp的插件
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

const loadPlugins = require('gulp-load-plugins')
// loadPlugins()返回一个对象，package中依赖的所有gulp插件都会成为它的属性
// gulp插件命名'gulp-<plugin name>'
// loadPlugins的插件使用：<plugin name>（如果有-连接符，则转为驼峰）
const plugins = loadPlugins()

// 创建一个开发服务器
const bs = browserSync.create()

// 清除文件
const clean = () => {
  return del(['dist', 'temp'])
}

// 编译sass
const style = () => {
  // base指定基准目录，用于将目录路径一起拷贝过去
  return src('src/assets/styles/*.scss', { base: 'src' })
    // 设置转化的风格，expanded大括号全展开
    // sass任务文件名以'_'开头的文件都是主文件中依赖的文件，所以不会去转化它们
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    // .pipe(dest('dist'))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

// 编译js
const script = () => {
  return src('src/assets/scripts/**.js', { base: 'src'})
    // presets是一些编译JS的插件的集合
    // preset-env是最新的一些所有特性的打包
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    // .pipe(dest('dist'))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

// 编译模板文件
// 页面引擎中使用的数据
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/'
        },
        {
          name: 'About',
          link: 'https://weibo.com/'
        },
        {
          name: 'divider'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
// 本项目使用swig项目引擎
const page = () => {
  return src('src/**.html', { base: 'src' })
    .pipe(plugins.swig({
      data,
      defaults: {
        cache: false
      }
    }))
    // .pipe(dest('dist'))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

// 图片转化-压缩
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

// 字体转化
// 字体文件也可以用imagemin进行拷贝
// 其中svg被imagemin识别为可压缩文件，转化时会被压缩
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    // .pipe(imagemin())
    .pipe(dest('dist'))
}

// 拷贝其他文件，如public
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

// 启动服务器任务
const serve = () => {
  // gulp的watch方法用于监视文件变化
  // watch(dir[监视文件], task[执行的务])
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/**js', script)
  watch('src/**.html', page)
  
  // 不需要编译的文件开发时不需要监听
  // 在运行时直接将此类资源指向源路径
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)

  // 监视不需要编译的文件的改动，刷新页面
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  // 初始化web服务器相关配置
  bs.init({
    // 配置端口 默认3000
    port: 8080,
    // 启动后打开浏览器，默认开启
    open: true,
    // 监听文件变化，自动更新浏览器
    // files: 'dist/**',
    // 服务器配置
    server: {
      // 网站根目录
      // 值为数组时，会按顺序查找资源
      baseDir: [/*'dist'*/ 'temp', 'src', 'public'],

      // 将一些路径指向指定目录
      // routes优先于baseDir，寻找路径时会先在routes中寻找，其次去baseDir下寻找
      // key:页面中路径前缀 value:指向的相对路径（相对于当前文件gulpfile.js）
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

/** useref 用于打包处理html中引入的资源，例如脚本、样式，进行合并打包、压缩等处理
 * 该插件通过查询页面中构建注释，来处理对应的资源
 * 构建注释格式：
 * build:[类型] [打包目标文件]
 * 资源引入，如link、script
 * endbuild
 */
/** 效果
  处理前：
  <!-- build:js assets/scripts/vendor.js -->
  <script src="/node_modules/jquery/dist/jquery.js"></script>
  <script src="/node_modules/popper.js/dist/umd/popper.js"></script>
  <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
  <!-- endbuild -->
  <!-- build:js assets/scripts/main.js -->
  <script src="assets/scripts/main.js"></script>
  <!-- endbuild -->

  处理后：
  <script src="assets/scripts/vendor.js"></script>
  <script src="assets/scripts/main.js"></script>
 */
const useref = () => {
  return src('temp/**.html', { base: 'temp' })
    .pipe(plugins.useref({
      // 使用数组时一般将使用更多的放在前面
      // 此项目dist用于查找assets下的资源
      // 此项目.用于查找node_modules下的资源
      searchPath: ['temp', '.']
    }))
    
    // 分别压缩html js css文件
    // 注意：
    // useref处理后，原dist下html文件中的构建注释被清除，所以不会再触发useref打包
    // 每次执行前还需要重新编译下html
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true, // 删除html换行
      minifyCSS: true, // 压缩css代码
      minifyJS: true // 压缩js代码
    }))) // html压缩默认删除无意义空格，但会保留换行
    
    // 写入dist时因为读写同时进行，需要处理的文件会冲突导致写入失败
    // 可指定一个中间层的临时目录用于放置中间阶段的文件
    // 将需要二次处理的文件写入temp，处理后再写入dist
    .pipe(dest('dist'))
}

// 创建组合任务
const compile = parallel(style, script, page)

// 为区分任务类型，重新组合编译任务和拷贝任务
// 上线之前执行的任务
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
)

const dev = series(compile, serve)

module.exports = {
  clean,
  build,
  dev
}