'use strict'

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Actions should be at the end of chains, not in the middle',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://docs.cypress.io/guides/core-concepts/retry-ability#Actions-should-be-at-the-end-of-chains-not-the-middle',
    },
    schema: [],
    fixable: 'code',
    messages: {
      unexpected:
        'It is unsafe to chain further commands that rely on the subject after this command. It is best to split the chain, chaining again from `cy.` in the next command.',
    },
  },
  create (context) {
    return {
      CallExpression (node) {
        if (
          isRootCypress(node) &&
          isActionUnsafeToChain(node) &&
          node.parent.type === 'MemberExpression'
        ) {
          context.report({
            node,
            messageId: 'unexpected',
          })
        }
      },
    }
  },
}

/** @param {import("eslint").Rule.Node} node */
function isRootCypress (node) {
  while (node.type === 'CallExpression') {
    if (node.callee.type !== 'MemberExpression') {
      return false
    }

    if (
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'cy'
    ) {
      return true
    }

    node = node.callee.object
  }

  return false
}

/** @param {import("eslint").Rule.Node} node */
function isActionUnsafeToChain (node) {
  // commands listed in the documentation with text: 'It is unsafe to chain further commands that rely on the subject after xxx'
  const unsafeToChainActions = [
    'blur',
    'clear',
    'click',
    'check',
    'dblclick',
    'each',
    'focus',
    'rightclick',
    'screenshot',
    'scrollIntoView',
    'scrollTo',
    'select',
    'selectFile',
    'spread',
    'submit',
    'type',
    'trigger',
    'uncheck',
    'within',
  ]

  return (
    node.callee &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    unsafeToChainActions.includes(node.callee.property.name)
  )
}
