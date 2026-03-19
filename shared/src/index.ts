export interface DogData {
  name: string;
  temperament: string[];
  energy: string;
  size: string;
  life: string;
  origin: string;
  group: string;
  image: string;
}

export interface AnalyzeResult {
  success: boolean;
  breed: string;
  normalizedBreed: string;
  confidence: number;
  alternatives: string[];
  dogData: DogData | null;
  error?: string;
}

export const DOG_BREEDS = [
  'retriever',
  'bulldog',
  'poodle',
  'beagle',
  'labrador',
  'husky',
  'shepherd',
  'terrier',
  'golden'
];
