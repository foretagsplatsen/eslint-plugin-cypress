/**
 * @fileoverview Disallow use of it.only() and replace with it()
 * @author Sondre H Elgaaen
 */
 'use strict'

 //------------------------------------------------------------------------------
 // Rule Definition
 //------------------------------------------------------------------------------

 module.exports = {
  meta: {
    docs: {
      description: 'Disallow exclusive tests',
      category: 'Possible Errors',
      recommended: false,
    },
    messages: {
      unexpected: 'Unexpected exclusive test - usage of \'it.only\' is not allowed',
    },
    fixable: 'code'
  },
  create(context) {
      return {
        MemberExpression(node) {
          if (
            (node.object.name === 'it' || node.object.name === 'describe') 
            && node.property.name === 'only') {
            context.report({
              node: node,
              messageId: 'unexpected',
              fix: fixer => {
                return fixer.replaceText(node, context.getSourceCode().getText(node).replace('.only', ''));
              }
          });
        }
      }
    };
  }
};