const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')


module.exports = grunt => {
  grunt.initConfig({
    sass: {
      options: {
        // 生成source map
        sourceMap: true,
        // 必选配置 implementation 指定使用哪个模块处理sass文件的编译
        implementation: sass
      },
      main: {
        files: {
          // key 输出路径
          // value 源路径
          'dist/css/main.css': 'src/scss/main.scss'
        }
      }
    },
    babel: {
      options: {
        // 生成source map
        sourceMap: true,
        // babel预设
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/js/app.js': 'src/js/app.js'
        }
      }
    },
    watch: {
      js: {
        // 监听的文件
        // files: ['src/js/app.js'],
        // files: ['src/js/*.js']'],
        files: ['src/js/**'],

        // 监听文件变化执行的任务
        tasks: ['babel']
      },
      css: {
        files: ['src/scss/**'],
        tasks: ['sass']
      }
    }
  })

  // grunt.loadNpmTasks('grunt-sass')
  // loadGruntTasks 会自动加载所有的 grunt 插件中的任务
  loadGruntTasks(grunt)

  grunt.registerTask('default', ['sass', 'babel', 'watch'])
}