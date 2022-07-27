'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-exclusive-tests')

const RuleTester = require('eslint').RuleTester

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 2019 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()

ruleTester.run('no-exclusive-tests', rule, {
  valid: [
    { code: `it("tests stuff", () => {})`, parserOptions },
    { code: `context("context", () => {it("tests stuff", () => {})})`, parserOptions },
    { code: `it.skip("doesn't test this", () => {})`, parserOptions },
    { code: `context("context", () => {it.skip("doesn't test this", () => {})})`, parserOptions },
    { code: `describe("tests stuff", () => {})`, parserOptions },
    { code: `context("context", () => {describe("tests stuff", () => {})})`, parserOptions },
    { code: `describe.skip("doesn't test this", () => {})`, parserOptions },
    { code: `context("context", () => {describe.skip("doesn't test this", () => {})})`, parserOptions },
  ],

  invalid: [
    { 
      code: `it.only("tests only this", () => {})`, 
      parserOptions, 
      errors,
      output: `it("tests only this", () => {})`
    },
    { 
      code: `context("context", () => {it.only("tests only this", () => {})})`, 
      parserOptions, 
      errors,
      output: `context("context", () => {it("tests only this", () => {})})`
    },
    { 
      code: `describe.only("tests only this", () => {})`, 
      parserOptions, 
      errors,
      output: `it("tests only this", () => {})`
    },
    { 
      code: `context("context", () => {describe.only("tests only this", () => {})})`, 
      parserOptions, 
      errors,
      output: `context("context", () => {it("tests only this", () => {})})`
    },
  ],
})
