#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const inquirer = require('inquirer')

const cwd = process.cwd()
const tpl = path.join(__dirname, 'tpl')

// cli-task -o <path>
let dest = cwd
const argv = process.argv
const oIndex = argv.indexOf('-o')
if (oIndex !== -1 && argv[oIndex+1]) {
  dest = path.join(cwd, argv[oIndex+1])
  if (!(fs.existsSync(dest) && fs.statSync(dest).isDirectory)) {
    fs.mkdirSync(dest)
  }
}

const questions = [
  {
    type: 'input',
    name: 'name',
    message: '请输入你的姓名：',
    default: '张英丹'
  },
  {
    type: 'input',
    name: 'part',
    message: '请输入part：',
    default: '01'
  },
  {
    type: 'input',
    name: 'module',
    message: '请输入module：',
    default: '01'
  },
  {
    type: 'confirm',
    name: 'include_code',
    message: '是否拷贝code目录：',
    default: true
  }
]

inquirer.prompt(questions)
  .then(answer => {
    const { part, module, include_code } = answer

    const rootName = `fed-e-task-${part}-${module}`
    const root = path.join(dest, rootName)

    if (fs.existsSync(root)) {
      clearDir(root)
      writeDir(tpl, root)
    } else {
      fs.mkdirSync(root)
      writeDir(tpl, root)
    }

    function clearDir(readPath) {
      const files = fs.readdirSync(readPath)
      files.forEach(file => {
        const filePath = path.join(readPath, file)
        if (fs.statSync(filePath).isDirectory()) {
          clearDir(filePath)
          fs.rmdirSync(filePath)
        } else {
          fs.unlinkSync(filePath)
        }
      })
    }

    function writeDir(readPath, writePath) {
      const files = fs.readdirSync(readPath)
      files.forEach(file => {
        if (!include_code && file === 'code') return;

        const filePath = path.join(readPath, file)
        const outFilePath = path.join(writePath, file)
        if (fs.statSync(filePath).isDirectory()) {
          fs.mkdirSync(outFilePath)
          writeDir(filePath, outFilePath)
        } else {
          ejs.renderFile(filePath, answer, (err, result) => {
            if (err) throw err
            fs.writeFileSync(outFilePath, result)
          })
        }
      })
    }
  })