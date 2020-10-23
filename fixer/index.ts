// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as ts from 'typescript';

/**
 * Asserts that the argument passed is a ts.BinaryExpression.
 */
function assertBinaryExpression(node: ts.Node):
    asserts node is ts.BinaryExpression {
  if (!ts.isBinaryExpression(node)) {
    throw new Error(
        `Matched node \`${node.getText()}\` is not a BinaryExpression; ` +
        `probably an upstream bug or a configuration error`);
  }
}

/**
 * Fixer which suggest using assignment to Element.textContent instead of
 * Element.innerHTML.
 *
 * There are two ways how you can assign to innerHTML:
 *   1) element.innerHTML = value
 *   2) element['innerHTML'] = value
 * We will suggest a fix `element.textContent = value` for both of these cases.
 *
 * This fixer only produces the fix if the value is a string literal containing
 * no html.
 */
const innerHtmlToTextContentFixer = {
  getFixForFlaggedNode: (node: ts.Node) => {
    assertBinaryExpression(node);

    const valueNode = node.right;
    if (!ts.isStringLiteralLike(valueNode)) return undefined;

    const text = valueNode.getText();
    // only produce a fix if the text doesn't contain any html
    if (text.includes('<')) return undefined;

    const replaced = text.replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&apos;/g, '\'')
                         .replace(/&quot;/g, '"')
                         .replace(/&amp;/g, '&');

    const sinkNode = node.left;
    let replacement: string|undefined;
    if (ts.isElementAccessExpression(sinkNode)) {
      const {expression, argumentExpression} = sinkNode;
      // Verify that the property is indeed 'innerHTML'.
      // If fixers had access to type checker we could inspect the type of
      // the node instead of the value. For now, we require the name to be a
      // literal and matching 'innerHTML'.
      if (!ts.isStringLiteralLike(argumentExpression) ||
          argumentExpression.text !== 'innerHTML') {
        return undefined;
      }
      replacement = `${expression.getText()}.textContent = ${replaced}`;
    } else if (ts.isPropertyAccessExpression(sinkNode)) {
      const {expression, name} = sinkNode;
      // Verify that the property is indeed 'innerHTML'
      if (name.getText() !== 'innerHTML') {
        return undefined;
      }
      replacement = `${expression.getText()}.textContent = ${replaced}`;
    }

    // this case shouldn't ever happen
    if (!replacement) {
      return undefined;
    }

    return {
      changes: [{
        start: node.getStart(),
        end: node.getEnd(),
        replacement,
        sourceFile: node.getSourceFile(),
      }]
    };
  }
};

export default innerHtmlToTextContentFixer;