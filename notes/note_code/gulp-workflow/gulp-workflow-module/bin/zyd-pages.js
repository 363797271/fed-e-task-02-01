#!/usr/bin/env node

/** process.argv 获取当前命令行中的全部参数，它返回一个数组
 * 第一个参数返回node.js进程的可执行文件（node.exe）的绝对路径
 * 例如: zyd-pages --arg1 arg2
 * 执行时等效: node bin/zyd-pages.js --arg1 arg2
 * 返回参数：[
 *    'node.exe的绝对路径',
 *    'zyd-pages.js的绝对路径',
 *    '--arg1',
 *    'arg2'
 * ]
 */

// 可以手动向argv中添加参数
// 将这些参数添加进去 --gulpfile <gulpfile path> --cwd <project path>
process.argv.push('--gulpfile')
// require.resolve接收一个相对路径，返回绝对路径
// process.argv.push(require.resolve('../lib/index.js'))
// 也可以直接指定到模块目录下，会自动查找package.json中的main属性指定的文件
process.argv.push(require.resolve('..'))
process.argv.push('--cwd')
process.argv.push(process.cwd())

require('gulp/bin/gulp')
