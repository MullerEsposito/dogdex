export interface DogInfo {
  name: string;
  temperament: string[];
  energy: string;
  size: string;
  life: string;
  origin: string;
  group: string;
  image: string;
}

export const dogs: Record<string, DogInfo> = {
  "golden retriever": {
    name: "Golden Retriever",
    temperament: ["Amigável", "Inteligente", "Leal"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Escócia",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg"
  },

  "labrador retriever": {
    name: "Labrador Retriever",
    temperament: ["Amigável", "Ativo", "Brincalhão"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Canadá",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/labrador/n02099712_5648.jpg"
  },

  "german shepherd": {
    name: "Pastor Alemão",
    temperament: ["Corajoso", "Inteligente", "Protetor"],
    energy: "Alta",
    size: "Grande",
    life: "9-13 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/germanshepherd/n02106662_2031.jpg"
  },

  "bulldog": {
    name: "Bulldog Inglês",
    temperament: ["Calmo", "Corajoso", "Teimoso"],
    energy: "Baixa",
    size: "Médio",
    life: "8-10 anos",
    origin: "Inglaterra",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg"
  },

  "french bulldog": {
    name: "Bulldog Francês",
    temperament: ["Afetuoso", "Brincalhão", "Sociável"],
    energy: "Média",
    size: "Pequeno",
    life: "10-12 anos",
    origin: "França",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/bulldog-french/n02108915_1183.jpg"
  },

  "poodle": {
    name: "Poodle",
    temperament: ["Inteligente", "Ativo", "Elegante"],
    energy: "Alta",
    size: "Variado",
    life: "12-15 anos",
    origin: "Alemanha/França",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/poodle-standard/n02113799_491.jpg"
  },

  "beagle": {
    name: "Beagle",
    temperament: ["Curioso", "Amigável", "Determinado"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/beagle/n02089973_10075.jpg"
  },

  "rottweiler": {
    name: "Rottweiler",
    temperament: ["Confiante", "Leal", "Protetor"],
    energy: "Média",
    size: "Grande",
    life: "8-10 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/rottweiler/n02106504_10147.jpg"
  },

  "yorkshire terrier": {
    name: "Yorkshire Terrier",
    temperament: ["Corajoso", "Energético", "Afetuoso"],
    energy: "Alta",
    size: "Pequeno",
    life: "13-16 anos",
    origin: "Inglaterra",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/terrier-yorkshire/n02094435_1004.jpg"
  },

  "dachshund": {
    name: "Dachshund (Salsicha)",
    temperament: ["Teimoso", "Corajoso", "Brincalhão"],
    energy: "Média",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Alemanha",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/dachshund/n02090666_1003.jpg"
  },

  "siberian husky": {
    name: "Husky Siberiano",
    temperament: ["Energético", "Independente", "Amigável"],
    energy: "Muito alta",
    size: "Médio",
    life: "12-14 anos",
    origin: "Rússia",
    group: "Working",
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg"
  },

  "chihuahua": {
    name: "Chihuahua",
    temperament: ["Alerta", "Corajoso", "Leal"],
    energy: "Média",
    size: "Pequeno",
    life: "14-17 anos",
    origin: "México",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/chihuahua/n02085620_1004.jpg"
  },

  "border collie": {
    name: "Border Collie",
    temperament: ["Extremamente inteligente", "Energético", "Trabalhador"],
    energy: "Muito alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "Reino Unido",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/collie-border/n02106030_1002.jpg"
  },

  "shih tzu": {
    name: "Shih Tzu",
    temperament: ["Afetuoso", "Calmo", "Amigável"],
    energy: "Baixa",
    size: "Pequeno",
    life: "10-16 anos",
    origin: "China",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/shihtzu/n02099712_5648.jpg"
  },

  "doberman": {
    name: "Doberman Pinscher",
    temperament: ["Leal", "Alerta", "Protetor"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/doberman/n02099267_1004.jpg"
  },

  "great dane": {
    name: "Dogue Alemão",
    temperament: ["Gentil", "Amigável", "Protetor"],
    energy: "Média",
    size: "Gigante",
    life: "7-10 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/dane-great/n02107907_1004.jpg"
  },

  "cocker spaniel": {
    name: "Cocker Spaniel",
    temperament: ["Doce", "Afetuoso", "Brincalhão"],
    energy: "Média",
    size: "Médio",
    life: "12-15 anos",
    origin: "EUA/Reino Unido",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/spaniel-cocker/n02102177_1004.jpg"
  },

  "pug": {
    name: "Pug",
    temperament: ["Brincalhão", "Amigável", "Charmoso"],
    energy: "Baixa",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "China",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/pug/n02110958_1004.jpg"
  },

  "boxer": {
    name: "Boxer",
    temperament: ["Energético", "Brincalhão", "Leal"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/boxer/n02106662_2031.jpg"
  },

  "akita": {
    name: "Akita",
    temperament: ["Corajoso", "Leal", "Independente"],
    energy: "Alta",
    size: "Grande",
    life: "10-13 anos",
    origin: "Japão",
    group: "Working",
    image: "https://images.dog.ceo/breeds/akita/n02110627_1004.jpg"
  },
  "pomeranian": {
    name: "Lulu da Pomerânia",
    temperament: ["Extrovertido", "Amigável", "Inteligente"],
    energy: "Média",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Alemanha/Polônia",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/pomeranian/n02112018_1020.jpg"
  },
  "samoyed": {
    name: "Samioieda",
    temperament: ["Teimoso", "Amigável", "Sociável"],
    energy: "Alta",
    size: "Grande",
    life: "12-14 anos",
    origin: "Rússia",
    group: "Working",
    image: "https://images.dog.ceo/breeds/samoyed/n02111886_1004.jpg"
  },
  "saint bernard": {
    name: "São Bernardo",
    temperament: ["Gentil", "Calmo", "Amigável"],
    energy: "Baixa",
    size: "Gigante",
    life: "8-10 anos",
    origin: "Suíça/Itália",
    group: "Working",
    image: "https://images.dog.ceo/breeds/stbernard/n02109525_1021.jpg"
  }
};
