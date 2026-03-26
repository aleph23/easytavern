import { BaseBasicBlocksKit } from '@/components/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '@/components/basic-marks-base-kit';
import { BaseAlignKit } from '@/components/ui/align-base-kit';
import { BaseCodeBlockKit } from '@/components/ui/code-block-base-kit';
import { BaseFontKit } from '@/components/ui/font-base-kit';
import { BaseLinkKit } from '@/components/ui/link-base-kit';
import { BaseListKit } from '@/components/ui/list-base-kit';
import { MarkdownKit } from '@/components/ui/markdown-kit';
import { BaseMathKit } from '@/components/ui/math-base-kit';
import { BaseMediaKit } from '@/components/ui/media-base-kit';
import { BaseSuggestionKit } from '@/components/ui/suggestion-base-kit';

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseCodeBlockKit,
  ...BaseMediaKit,
  ...BaseMathKit,
  ...BaseLinkKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseSuggestionKit,
  ...MarkdownKit,
];


const editor = usePlateEditor({
  // ... other plugins and options
  nodeId: {
    // Function to generate IDs (default: nanoid(10))
    idCreator: () => uuidv4(),

    // Exclude inline elements from getting IDs (default: true)
    filterInline: true,

    // Exclude text nodes from getting IDs (default: true)
    filterText: true,

    // Reuse IDs on undo/redo and copy/paste if not in document (default: false)
    // Set to true if IDs should be stable across such operations.
    reuseId: false,

    // Normalize all nodes in initial value (default: false - only checks first/last)
    // Set to true to ensure all initial nodes get IDs if missing.
    normalizeInitialValue: true,

    // Prevent overriding IDs when inserting nodes with an existing id (default: false)
    disableInsertOverrides: true,

    // Only allow specific node types to receive IDs (default: all)
    allow: ['all'],

    // Exclude specific node types from receiving IDs (default: [])
    exclude: [],

    // Custom filter function to determine if a node should get an ID
    filter: ([node, path]) => {
      // Example: Only ID on top-level blocks
      return path.length === 1;
    },
  },
});
