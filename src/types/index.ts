// src/types/index.ts

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category: 'Produce' | 'Dairy' | 'Pantry' | 'Other'; // [cite: 20]
  checked: boolean;
}

export interface VoiceCommand {
  originalTranscript: string;
  action: 'ADD' | 'REMOVE' | 'SEARCH' | 'UNKNOWN';
  item?: string;
  quantity?: number;
  category?: string;
}