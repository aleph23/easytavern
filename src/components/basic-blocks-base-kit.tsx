/* Plate JS - Hihgly configurable text editor / presenter
*
* This file is for defining the basic block-level plugins and their static components. */

import { BaseBlockquotePlugin, BaseH1Plugin, BaseH2Plugin,
  BaseH3Plugin, BaseH4Plugin, BaseHorizontalRulePlugin, } from '@platejs/basic-nodes'
import { BaseParagraphPlugin } from 'platejs'

/* Avoid Static Components -- Server-Side Only */
import { BlockquoteElementStatic } from '@/components/ui/blockquote-node-static'
import { H1ElementStatic, H2ElementStatic, H3ElementStatic, H4ElementStatic } from '@/components/ui/heading-node-static'
import { HrElementStatic } from '@/components/ui/hr-node-static'
import { ParagraphElementStatic } from '@/components/ui/paragraph-node-static'

export const BaseBasicBlocksKit = [
  BaseParagraphPlugin.withComponent(ParagraphElementStatic),
  BaseH1Plugin.withComponent(H1ElementStatic),
  BaseH2Plugin.withComponent(H2ElementStatic),
  BaseH3Plugin.withComponent(H3ElementStatic),
  BaseH4Plugin.withComponent(H4ElementStatic),
  BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
  BaseHorizontalRulePlugin.withComponent(HrElementStatic),
];
