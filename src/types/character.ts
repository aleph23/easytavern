// Character Card V3 Specification Types
// Based on https://github.com/malfoyslastname/character-card-spec-v3

// Asset for embedded resources (images, audio, etc.)
export interface CharacterAsset {
  type: string;
  uri: string;
  name: string;
  ext: string;
}

// Character Book Entry (lorebook/world info entry)
export interface CharacterBookEntry {
  keys: string[];
  content: string;
  extensions: Record<string, unknown>;
  enabled: boolean;
  insertion_order: number;
  case_sensitive?: boolean;
  use_regex: boolean;
  constant?: boolean;
  name?: string;
  priority?: number;
  id?: number;
  comment?: string;
  selective?: boolean;
  secondary_keys?: string[];
  position?: 'before_char' | 'after_char';
}

// Character Book (lorebook/world info collection)
export interface CharacterBook {
  name?: string;
  description?: string;
  scan_depth?: number;
  token_budget?: number;
  recursive_scanning?: boolean;
  extensions: Record<string, unknown>;
  entries: CharacterBookEntry[];
}

// V3 Character Card Data
export interface CharacterCardV3Data {
  name: string;
  description: string;
  tags: string[];
  creator: string;
  character_version: string;
  mes_example: string;
  extensions: Record<string, unknown>;
  system_prompt: string;
  post_history_instructions: string;
  first_mes: string;
  alternate_greetings: string[];
  personality: string;
  scenario: string;
  creator_notes: string;
  character_book?: CharacterBook;
  
  // V3 specific fields
  assets?: CharacterAsset[];
  nickname?: string;
  creator_notes_multilingual?: Record<string, string>;
  source?: string[];
  group_only_greetings?: string[];
  creation_date?: string;
  modification_date?: string;
}

// Full V3 Character Card
export interface CharacterCardV3 {
  spec: 'chara_card_v3';
  spec_version: '3.0';
  data: CharacterCardV3Data;
}

// V2 Character Card Data (for backward compatibility)
export interface CharacterCardV2Data {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creator_notes?: string;
  system_prompt?: string;
  post_history_instructions?: string;
  alternate_greetings?: string[];
  tags?: string[];
  creator?: string;
  character_version?: string;
  extensions?: Record<string, unknown>;
  character_book?: CharacterBook;
}

// Full V2 Character Card
export interface CharacterCardV2 {
  spec: 'chara_card_v2';
  spec_version: '2.0';
  data: CharacterCardV2Data;
}

// Union type for any supported character card format
export type CharacterCard = CharacterCardV3 | CharacterCardV2;

// Runtime character representation (internal use)
export interface RuntimeCharacter {
  id: string;
  filename: string;
  card: CharacterCard;
  avatar?: string; // Base64 or URL
  lastModified?: Date;
}

// Helper to check card version
export const isV3Card = (card: CharacterCard): card is CharacterCardV3 => {
  return card.spec === 'chara_card_v3';
};

export const isV2Card = (card: CharacterCard): card is CharacterCardV2 => {
  return card.spec === 'chara_card_v2';
};

// Convert V2 to V3 format
export const upgradeToV3 = (v2: CharacterCardV2): CharacterCardV3 => {
  return {
    spec: 'chara_card_v3',
    spec_version: '3.0',
    data: {
      name: v2.data.name,
      description: v2.data.description,
      tags: v2.data.tags ?? [],
      creator: v2.data.creator ?? '',
      character_version: v2.data.character_version ?? '',
      mes_example: v2.data.mes_example,
      extensions: v2.data.extensions ?? {},
      system_prompt: v2.data.system_prompt ?? '',
      post_history_instructions: v2.data.post_history_instructions ?? '',
      first_mes: v2.data.first_mes,
      alternate_greetings: v2.data.alternate_greetings ?? [],
      personality: v2.data.personality,
      scenario: v2.data.scenario,
      creator_notes: v2.data.creator_notes ?? '',
      character_book: v2.data.character_book,
      assets: [],
      group_only_greetings: [],
    },
  };
};
