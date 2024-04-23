import babel from '@babel/core'
import fs from 'fs'
import plugin from './index.js'

const code = fs.readFileSync(`${import.meta.dirname}/program.js`).toString()

const transformedCode = babel.transform(code, {
  plugins: [plugin],
  code: true,
  ast: false,
}).code

fs.writeFileSync(`${import.meta.dirname}/out.js`, transformedCode)
console.log(transformedCode);
