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

export interface DeviceInfo {
  brand?: string | null;
  modelName?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  platform?: string;
}

export interface SupportReport {
  type: 'bug' | 'feature';
  text: string;
  userName?: string;
  userEmail?: string;
  screenshot?: string; // Base64 if needed, or we use Multipart upload
  deviceInfo?: DeviceInfo;
  timestamp: string;
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

export interface AdoptionDog {
  id: string;
  name: string;
  breedName: string;
  age?: string;
  description?: string;
  imageUri: string;
  status: 'available' | 'adopted';
  adoptionPointId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionPoint {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  contactPhone?: string;
  creatorId: string;
  dogs?: AdoptionDog[];
  createdAt: string;
  updatedAt: string;
}

export const DOG_BREEDS = [
  'affenpinscher',
  'afghan hound',
  'african hunting dog',
  'airedale',
  'american staffordshire terrier',
  'appenzeller',
  'australian terrier',
  'basenji',
  'basset',
  'beagle',
  'bedlington terrier',
  'bernese mountain dog',
  'black',
  'blenheim spaniel',
  'bloodhound',
  'bluetick',
  'border collie',
  'border terrier',
  'borzoi',
  'boston bull',
  'bouvier des flandres',
  'boxer',
  'brabancon griffon',
  'briard',
  'brittany spaniel',
  'bull mastiff',
  'cairn',
  'cardigan',
  'chesapeake bay retriever',
  'chihuahua',
  'chow',
  'clumber',
  'cocker spaniel',
  'collie',
  'curly',
  'dandie dinmont',
  'dhole',
  'dingo',
  'doberman',
  'english foxhound',
  'english setter',
  'english springer',
  'entlebucher',
  'eskimo dog',
  'flat',
  'french bulldog',
  'german shepherd',
  'german short',
  'giant schnauzer',
  'golden retriever',
  'gordon setter',
  'great dane',
  'great pyrenees',
  'greater swiss mountain dog',
  'groenendael',
  'ibizan hound',
  'irish setter',
  'irish terrier',
  'irish water spaniel',
  'irish wolfhound',
  'italian greyhound',
  'japanese spaniel',
  'keeshond',
  'kelpie',
  'kerry blue terrier',
  'komondor',
  'kuvasz',
  'labrador retriever',
  'lakeland terrier',
  'leonberg',
  'lhasa',
  'malamute',
  'malinois',
  'maltese dog',
  'mexican hairless',
  'miniature pinscher',
  'miniature poodle',
  'miniature schnauzer',
  'newfoundland',
  'norfolk terrier',
  'norwegian elkhound',
  'norwich terrier',
  'old english sheepdog',
  'otterhound',
  'papillon',
  'pekinese',
  'pembroke',
  'pomeranian',
  'pug',
  'redbone',
  'rhodesian ridgeback',
  'rottweiler',
  'saint bernard',
  'saluki',
  'samoyed',
  'schipperke',
  'scotch terrier',
  'scottish deerhound',
  'sealyham terrier',
  'shetland sheepdog',
  'shih',
  'siberian husky',
  'silky terrier',
  'soft',
  'staffordshire bullterrier',
  'standard poodle',
  'standard schnauzer',
  'sussex spaniel',
  'tibetan mastiff',
  'tibetan terrier',
  'toy poodle',
  'toy terrier',
  'vizsla',
  'walker hound',
  'weimaraner',
  'welsh springer spaniel',
  'west highland white terrier',
  'whippet',
  'wire',
  'yorkshire terrier'
];
