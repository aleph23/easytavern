// Holder for all Plate components, two replace the current user text input component.

import { HeadingPlugin } from '@platejs/basic-nodes/react';
import { CodeLinePlugin } from '@platejs/code-block';
import { CodeBlockPlugin } from '@platejs/code-block/react';
import { PlateEditor, usePlateEditor } from 'platejs/react';

// Import ALL Plate plugins needed to represent the HTML content
// ... and so on for bold, italic, tables, lists, etc.

function MyHtmlImporter({ htmlString }: { htmlString: string }) {
  const editor = usePlateEditor({
    plugins: [
      HeadingPlugin,     // For <h1>, <h2>, etc.
      // ... include all plugins corresponding to the HTML you expect to parse
    ],
  });

  const handleImport = () => {
    const slateValue = editor.api.html.deserialize(htmlString);
    editor.tf.setValue(slateValue);
  };

  // ... render your editor and a button to trigger handleImport ...
  return <button onClick={handleImport}>Import HTML</button>;
}


/* CodeBlock elemtns */
const CodeBkPlugin = CodeBlockPlugin.configure({
  parsers: {
    html: {
      deserializer: {
        // Inherit most rules and properties, then override or add
      o  ...CdeBlockPlugin.parsers.html.deserializer,
        parse: ({ element, editor }) => { // editor might be needed for getType
          const language = element.getAttribute('data-custom-lang') || element.className.match(/language-(?<lang>[^\s]+)/)?.groups?.lang;
          const textContent = element.textContent || '';
          const lines = textContent.split('\n');

          return {
            type: CodeBlockPlugin.key, // Or editor.getType(CodeBlockPlugin.key)
            lang: language,
            code: textContent, // Example: store full code string
            children: lines.map((line) => ({
              type: editor.getType(CodeLinePlugin.key),
              children: [{ text: line }],
            })),
          };
        },
        rules: [
          // Inherit existing rules if desired
          ...(CodeBlockPlugin.parsers.html.deserializer.rules || []),
          // Add a new rule to match based on a custom attribute
          { validAttribute: { 'data-custom-lang': true } },
        ],
      },
    },
  },
});

// Simplified concept from ListPlugin
export const ListPluginConfig = {
  // ... other configurations ...
  parsers: {
    html: {
      deserializer: {
        isElement: true,
        // query: ({ element }) => hasListAncestor(element), // Example condition
        parse: ({ editor, element }) => ({
          type: 'p', // Converts <li> to <p>
          indent: Number(element.getAttribute('aria-level') || '1'),
          listStyleType: element.style.listStyleType || undefined,
          // Children are processed by Plate's default deserializer after this node is created
        }),
        rules: [
          { validNodeName: 'LI' }, // Only applies to <li> elements
        ],
      },
    },
  },
};
