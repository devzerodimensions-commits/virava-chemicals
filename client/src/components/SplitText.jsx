import { Children, cloneElement, isValidElement } from 'react';

/**
 * Splits its children into words so a heading can assemble one word at a time.
 *
 * The split happens in React, not by rewriting the DOM after render. Several of
 * these headings interpolate values that arrive from the API (the founding year,
 * the customer count), so React re-renders them; replacing the text nodes
 * underneath it risks React later trying to remove a node that is no longer
 * there, which throws and takes the page down.
 *
 * Nested elements — the italic <span class="serif"> accent inside most section
 * titles — are kept whole and animated as a single word rather than being torn
 * apart, which is what a naive innerHTML split does to them.
 *
 * The hidden state is scoped to html.js-anim, a class added at runtime, so with
 * scripting off every word is simply visible.
 */
export default function SplitText({ children, step = 55 }) {
  let i = 0;

  const wrap = (node, key) => {
    if (typeof node === 'string' || typeof node === 'number') {
      // keep the whitespace tokens, or the words run together
      return String(node).split(/(\s+)/).map((tok, j) => {
        if (!tok) return null;
        if (!tok.trim()) return tok;
        return (
          <span className="w" style={{ transitionDelay: `${i++ * step}ms` }} key={`${key}-${j}`}>
            {tok}
          </span>
        );
      });
    }
    if (isValidElement(node)) {
      return cloneElement(node, {
        key,
        className: `${node.props.className || ''} w`.trim(),
        style: { ...node.props.style, transitionDelay: `${i++ * step}ms` },
      });
    }
    return node;
  };

  return <span className="split-text">{Children.map(children, wrap)}</span>;
}
