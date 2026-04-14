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
  "affenpinscher": {
    name: "Affenpinscher",
    temperament: ["Curioso","Brincalhão","Confiante"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Alemanha",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/affenpinscher/n02110627_10047.jpg"
  },
  "afghan_hound": {
    name: "Afghan Hound",
    temperament: ["Independente","Elegante","Reservado"],
    energy: "Alta",
    size: "Grande",
    life: "12-14 anos",
    origin: "Afeganistão",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg"
  },
  "african_hunting_dog": {
    name: "African Hunting Dog",
    temperament: ["Social","Energético","Inteligente"],
    energy: "Muito alta",
    size: "Médio",
    life: "10-12 anos",
    origin: "África",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-african/n02116738_1005.jpg"
  },
  "airedale": {
    name: "Airedale Terrier",
    temperament: ["Corajoso","Inteligente","Independente"],
    energy: "Alta",
    size: "Grande",
    life: "11-14 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-airedale/n02096051_1003.jpg"
  },
  "akita": {
    name: "Akita",
    temperament: ["Corajoso","Leal","Independente"],
    energy: "Alta",
    size: "Grande",
    life: "10-13 anos",
    origin: "Japão",
    group: "Working",
    image: "https://images.dog.ceo/breeds/akita/n02110627_1004.jpg"
  },
  "american_staffordshire_terrier": {
    name: "American Staffordshire Terrier",
    temperament: ["Leal","Corajoso","Afetuoso"],
    energy: "Alta",
    size: "Médio",
    life: "12-16 anos",
    origin: "Estados Unidos",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-american/n02093428_1000.jpg"
  },
  "appenzeller": {
    name: "Appenzeller",
    temperament: ["Energético","Protetor","Leal"],
    energy: "Alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "Suíça",
    group: "Working",
    image: "https://images.dog.ceo/breeds/mountain-appenzeller/n02107908_100.jpg"
  },
  "australian_terrier": {
    name: "Australian Terrier",
    temperament: ["Alerta","Corajoso","Amigável"],
    energy: "Alta",
    size: "Pequeno",
    life: "11-15 anos",
    origin: "Austrália",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-australian/n02096294_1000.jpg"
  },
  "basenji": {
    name: "Basenji",
    temperament: ["Independente","Silencioso","Curioso"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "África",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/basenji/n02110806_1003.jpg"
  },
  "basset": {
    name: "Basset Hound",
    temperament: ["Calmo","Teimoso","Gentil"],
    energy: "Baixa",
    size: "Médio",
    life: "10-12 anos",
    origin: "França",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-basset/n02088238_1007.jpg"
  },
  "beagle": {
    name: "Beagle",
    temperament: ["Curioso","Amigável","Determinado"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/beagle/n02089973_10075.jpg"
  },
  "bedlington_terrier": {
    name: "Bedlington Terrier",
    temperament: ["Afetuoso","Alerta","Inteligente"],
    energy: "Média",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-bedlington/n02093647_1003.jpg"
  },
  "bernese_mountain_dog": {
    name: "Bernese Mountain Dog",
    temperament: ["Gentil","Leal","Calmo"],
    energy: "Média",
    size: "Grande",
    life: "7-10 anos",
    origin: "Suíça",
    group: "Working",
    image: "https://images.dog.ceo/breeds/mountain-bernese/n02107683_1005.jpg"
  },
  "bloodhound": {
    name: "Bloodhound",
    temperament: ["Persistente","Gentil","Independente"],
    energy: "Média",
    size: "Grande",
    life: "10-12 anos",
    origin: "Bélgica",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-blood/n02088466_1003.jpg"
  },
  "bluetick": {
    name: "Bluetick Coonhound",
    temperament: ["Determinado","Amigável","Energético"],
    energy: "Alta",
    size: "Médio",
    life: "11-12 anos",
    origin: "Estados Unidos",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-bluetick/n02088632_1007.jpg"
  },
  "border collie": {
    name: "Border Collie",
    temperament: ["Extremamente inteligente","Energético","Trabalhador"],
    energy: "Muito alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "Reino Unido",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/collie-border/n02106030_1002.jpg"
  },
  "border_terrier": {
    name: "Border Terrier",
    temperament: ["Afetuoso","Alerta","Determinado"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-border/n02093754_1000.jpg"
  },
  "borzoi": {
    name: "Borzoi",
    temperament: ["Calmo","Elegante","Independente"],
    energy: "Média",
    size: "Grande",
    life: "10-12 anos",
    origin: "Rússia",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/borzoi/n02090622_1000.jpg"
  },
  "boston_bull": {
    name: "Boston Terrier",
    temperament: ["Amigável","Animado","Inteligente"],
    energy: "Média",
    size: "Pequeno",
    life: "11-13 anos",
    origin: "Estados Unidos",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/terrier-boston/n02096585_1000.jpg"
  },
  "bouvier_des_flandres": {
    name: "Bouvier des Flandres",
    temperament: ["Protetor","Leal","Calmo"],
    energy: "Média",
    size: "Grande",
    life: "10-12 anos",
    origin: "Bélgica",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/bouvier/n02106382_1000.jpg"
  },
  "boxer": {
    name: "Boxer",
    temperament: ["Energético","Brincalhão","Leal"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/boxer/n02106662_2031.jpg"
  },
  "brabancon_griffon": {
    name: "Brabancon Griffon",
    temperament: ["Afetuoso","Alerta","Curioso"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Bélgica",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/brabancon/n02112706_1000.jpg"
  },
  "briard": {
    name: "Briard",
    temperament: ["Leal","Inteligente","Protetor"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "França",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/briard/n02105251_1000.jpg"
  },
  "bull_mastiff": {
    name: "Bullmastiff",
    temperament: ["Protetor","Corajoso","Calmo"],
    energy: "Baixa",
    size: "Gigante",
    life: "8-10 anos",
    origin: "Inglaterra",
    group: "Working",
    image: "https://images.dog.ceo/breeds/mastiff-bull/n02108422_1000.jpg"
  },
  "bulldog": {
    name: "Bulldog Inglês",
    temperament: ["Calmo","Corajoso","Teimoso"],
    energy: "Baixa",
    size: "Médio",
    life: "8-10 anos",
    origin: "Inglaterra",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg"
  },
  "cairn": {
    name: "Cairn Terrier",
    temperament: ["Alerta","Ativo","Corajoso"],
    energy: "Alta",
    size: "Pequeno",
    life: "13-15 anos",
    origin: "Escócia",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-cairn/n02096177_1000.jpg"
  },
  "cardigan": {
    name: "Cardigan Welsh Corgi",
    temperament: ["Leal","Inteligente","Protetor"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "País de Gales",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1000.jpg"
  },
  "chesapeake_bay_retriever": {
    name: "Chesapeake Bay Retriever",
    temperament: ["Inteligente","Leal","Protetor"],
    energy: "Alta",
    size: "Grande",
    life: "10-13 anos",
    origin: "Estados Unidos",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_1000.jpg"
  },
  "chihuahua": {
    name: "Chihuahua",
    temperament: ["Alerta","Corajoso","Leal"],
    energy: "Média",
    size: "Pequeno",
    life: "14-17 anos",
    origin: "México",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/chihuahua/n02085620_1004.jpg"
  },
  "chow": {
    name: "Chow Chow",
    temperament: ["Independente","Reservado","Leal"],
    energy: "Baixa",
    size: "Médio",
    life: "9-12 anos",
    origin: "China",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/chow/n02112137_1000.jpg"
  },
  "clumber": {
    name: "Clumber Spaniel",
    temperament: ["Calmo","Gentil","Leal"],
    energy: "Baixa",
    size: "Grande",
    life: "10-12 anos",
    origin: "Inglaterra",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/spaniel-clumber/n02101556_1000.jpg"
  },
  "cocker spaniel": {
    name: "Cocker Spaniel",
    temperament: ["Doce","Afetuoso","Brincalhão"],
    energy: "Média",
    size: "Médio",
    life: "12-15 anos",
    origin: "EUA/Reino Unido",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/spaniel-cocker/n02102177_1004.jpg"
  },
  "collie": {
    name: "Collie",
    temperament: ["Inteligente","Leal","Sensível"],
    energy: "Média",
    size: "Grande",
    life: "12-14 anos",
    origin: "Escócia",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/collie/n02106030_1000.jpg"
  },
  "curly": {
    name: "Curly-Coated Retriever",
    temperament: ["Inteligente","Independente","Ativo"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Inglaterra",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/retriever-curly/n02099429_1000.jpg"
  },
  "dachshund": {
    name: "Dachshund (Salsicha)",
    temperament: ["Teimoso","Corajoso","Brincalhão"],
    energy: "Média",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Alemanha",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/dachshund/n02090666_1003.jpg"
  },
  "dandie_dinmont": {
    name: "Dandie Dinmont Terrier",
    temperament: ["Afetuoso","Corajoso","Independente"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Escócia",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-dandie/n02096437_1000.jpg"
  },
  "dhole": {
    name: "Dhole",
    temperament: ["Social","Energético","Inteligente"],
    energy: "Muito alta",
    size: "Médio",
    life: "10-13 anos",
    origin: "Ásia",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/dhole/n02115913_1000.jpg"
  },
  "dingo": {
    name: "Dingo",
    temperament: ["Independente","Alerta","Ágil"],
    energy: "Alta",
    size: "Médio",
    life: "10-15 anos",
    origin: "Austrália",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/dingo/n02115641_1000.jpg"
  },
  "doberman": {
    name: "Doberman Pinscher",
    temperament: ["Leal","Alerta","Protetor"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/doberman/n02099267_1004.jpg"
  },
  "english_foxhound": {
    name: "English Foxhound",
    temperament: ["Amigável","Ativo","Determinado"],
    energy: "Alta",
    size: "Grande",
    life: "10-13 anos",
    origin: "Inglaterra",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-english/n02089973_1000.jpg"
  },
  "english_setter": {
    name: "English Setter",
    temperament: ["Gentil","Amigável","Energético"],
    energy: "Alta",
    size: "Grande",
    life: "11-15 anos",
    origin: "Inglaterra",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/setter-english/n02100735_1000.jpg"
  },
  "english_springer": {
    name: "English Springer Spaniel",
    temperament: ["Amigável","Energético","Inteligente"],
    energy: "Alta",
    size: "Médio",
    life: "12-14 anos",
    origin: "Inglaterra",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/springer-english/n02102040_1000.jpg"
  },
  "entlebucher": {
    name: "Entlebucher Mountain Dog",
    temperament: ["Leal","Energético","Inteligente"],
    energy: "Alta",
    size: "Médio",
    life: "11-13 anos",
    origin: "Suíça",
    group: "Working",
    image: "https://images.dog.ceo/breeds/mountain-entlebucher/n02108089_1000.jpg"
  },
  "eskimo_dog": {
    name: "American Eskimo Dog",
    temperament: ["Inteligente","Alerta","Amigável"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Estados Unidos",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/eskimo/n02109961_1000.jpg"
  },
  "flat": {
    name: "Flat-Coated Retriever",
    temperament: ["Energético","Amigável","Otimista"],
    energy: "Alta",
    size: "Grande",
    life: "8-10 anos",
    origin: "Inglaterra",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_1000.jpg"
  },
  "french bulldog": {
    name: "Bulldog Francês",
    temperament: ["Afetuoso","Brincalhão","Sociável"],
    energy: "Média",
    size: "Pequeno",
    life: "10-12 anos",
    origin: "França",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/bulldog-french/n02108915_1183.jpg"
  },
  "german shepherd": {
    name: "Pastor Alemão",
    temperament: ["Corajoso","Inteligente","Protetor"],
    energy: "Alta",
    size: "Grande",
    life: "9-13 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/germanshepherd/n02106662_2031.jpg"
  },
  "german_short": {
    name: "German Shorthaired Pointer",
    temperament: ["Inteligente","Ativo","Versátil"],
    energy: "Muito alta",
    size: "Grande",
    life: "10-14 anos",
    origin: "Alemanha",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/pointer-german/n02100236_1000.jpg"
  },
  "giant_schnauzer": {
    name: "Giant Schnauzer",
    temperament: ["Protetor","Inteligente","Dominante"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/schnauzer-giant/n02097130_1000.jpg"
  },
  "golden retriever": {
    name: "Golden Retriever",
    temperament: ["Amigável","Inteligente","Leal"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Escócia",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg"
  },
  "gordon_setter": {
    name: "Gordon Setter",
    temperament: ["Leal","Corajoso","Inteligente"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Escócia",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/setter-gordon/n02101006_1000.jpg"
  },
  "great dane": {
    name: "Dogue Alemão",
    temperament: ["Gentil","Amigável","Protetor"],
    energy: "Média",
    size: "Gigante",
    life: "7-10 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/dane-great/n02107907_1004.jpg"
  },
  "great_pyrenees": {
    name: "Great Pyrenees",
    temperament: ["Calmo","Protetor","Gentil"],
    energy: "Baixa",
    size: "Gigante",
    life: "10-12 anos",
    origin: "França",
    group: "Working",
    image: "https://images.dog.ceo/breeds/pyrenees/n02111500_1000.jpg"
  },
  "greater_swiss_mountain_dog": {
    name: "Greater Swiss Mountain Dog",
    temperament: ["Leal","Calmo","Confiante"],
    energy: "Média",
    size: "Gigante",
    life: "8-11 anos",
    origin: "Suíça",
    group: "Working",
    image: "https://images.dog.ceo/breeds/mountain-swiss/n02107574_1000.jpg"
  },
  "groenendael": {
    name: "Groenendael",
    temperament: ["Leal","Ativo"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Bélgica",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/groenendael/placeholder.jpg"
  },
  "ibizan_hound": {
    name: "Ibizan Hound",
    temperament: ["Ágil","Teimoso"],
    energy: "Alta",
    size: "Médio",
    life: "11-14 anos",
    origin: "Espanha",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-ibizan/placeholder.jpg"
  },
  "irish_setter": {
    name: "Irish Setter",
    temperament: ["Brincalhão","Afetuoso"],
    energy: "Alta",
    size: "Grande",
    life: "12-15 anos",
    origin: "Irlanda",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/setter-irish/placeholder.jpg"
  },
  "irish_terrier": {
    name: "Irish Terrier",
    temperament: ["Corajoso","Leal"],
    energy: "Alta",
    size: "Médio",
    life: "13-15 anos",
    origin: "Irlanda",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-irish/placeholder.jpg"
  },
  "irish_water_spaniel": {
    name: "Irish Water Spaniel",
    temperament: ["Ativo","Inteligente"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Irlanda",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/spaniel-irish/placeholder.jpg"
  },
  "irish_wolfhound": {
    name: "Irish Wolfhound",
    temperament: ["Gentil","Calmo"],
    energy: "Média",
    size: "Gigante",
    life: "6-8 anos",
    origin: "Irlanda",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/wolfhound-irish/placeholder.jpg"
  },
  "italian_greyhound": {
    name: "Italian Greyhound",
    temperament: ["Sensível","Afetuoso"],
    energy: "Alta",
    size: "Pequeno",
    life: "14-15 anos",
    origin: "Itália",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/greyhound-italian/placeholder.jpg"
  },
  "japanese_spaniel": {
    name: "Japanese Spaniel (Chin)",
    temperament: ["Afetuoso","Calmo"],
    energy: "Baixa",
    size: "Pequeno",
    life: "10-14 anos",
    origin: "Japão",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/spaniel-japanese/placeholder.jpg"
  },
  "keeshond": {
    name: "Keeshond",
    temperament: ["Brincalhão","Leal"],
    energy: "Média",
    size: "Médio",
    life: "12-15 anos",
    origin: "Holanda",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/keeshond/placeholder.jpg"
  },
  "kelpie": {
    name: "Australian Kelpie",
    temperament: ["Alert","Energético"],
    energy: "Muito alta",
    size: "Médio",
    life: "10-14 anos",
    origin: "Austrália",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/kelpie/placeholder.jpg"
  },
  "kerry_blue_terrier": {
    name: "Kerry Blue Terrier",
    temperament: ["Alerta","Gentil"],
    energy: "Alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "Irlanda",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-kerryblue/placeholder.jpg"
  },
  "komondor": {
    name: "Komondor",
    temperament: ["Protetor","Calmo"],
    energy: "Média",
    size: "Grande",
    life: "10-12 anos",
    origin: "Hungria",
    group: "Working",
    image: "https://images.dog.ceo/breeds/komondor/placeholder.jpg"
  },
  "kuvasz": {
    name: "Kuvasz",
    temperament: ["Protetor","Corajoso"],
    energy: "Média",
    size: "Grande",
    life: "10-12 anos",
    origin: "Hungria",
    group: "Working",
    image: "https://images.dog.ceo/breeds/kuvasz/placeholder.jpg"
  },
  "labrador retriever": {
    name: "Labrador Retriever",
    temperament: ["Amigável","Ativo","Brincalhão"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Canadá",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/labrador/n02099712_5648.jpg"
  },
  "lakeland_terrier": {
    name: "Lakeland Terrier",
    temperament: ["Confiante","Treinável"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-lakeland/placeholder.jpg"
  },
  "leonberg": {
    name: "Leonberger",
    temperament: ["Amigável","Compatível"],
    energy: "Média",
    size: "Gigante",
    life: "7-9 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/leonberg/placeholder.jpg"
  },
  "lhasa": {
    name: "Lhasa Apso",
    temperament: ["Confiante","Engraçado"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Tibet",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/lhasa/placeholder.jpg"
  },
  "malamute": {
    name: "Alaskan Malamute",
    temperament: ["Afetuoso","Leal"],
    energy: "Alta",
    size: "Grande",
    life: "10-14 anos",
    origin: "EUA",
    group: "Working",
    image: "https://images.dog.ceo/breeds/malamute/placeholder.jpg"
  },
  "malinois": {
    name: "Belgian Malinois",
    temperament: ["Protetor","Alerta"],
    energy: "Muito alta",
    size: "Grande",
    life: "14-16 anos",
    origin: "Bélgica",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/malinois/placeholder.jpg"
  },
  "maltese_dog": {
    name: "Maltese",
    temperament: ["Afetuoso","Doce"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Itália",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/maltese/placeholder.jpg"
  },
  "mexican_hairless": {
    name: "Mexican Hairless (Xoloitzcuintli)",
    temperament: ["Calmo","Leal"],
    energy: "Média",
    size: "Variado",
    life: "13-18 anos",
    origin: "México",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/mexicanhairless/placeholder.jpg"
  },
  "miniature_pinscher": {
    name: "Miniature Pinscher",
    temperament: ["Energético","Inteligente"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Alemanha",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/pinscher-miniature/placeholder.jpg"
  },
  "miniature_poodle": {
    name: "Miniature Poodle",
    temperament: ["Inteligente","Ativo"],
    energy: "Alta",
    size: "Pequeno",
    life: "10-18 anos",
    origin: "Alemanha/França",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/poodle-miniature/placeholder.jpg"
  },
  "miniature_schnauzer": {
    name: "Miniature Schnauzer",
    temperament: ["Inteligente","Destemido"],
    energy: "Média",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Alemanha",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/schnauzer-miniature/placeholder.jpg"
  },
  "newfoundland": {
    name: "Newfoundland",
    temperament: ["Doce","Paciente"],
    energy: "Média",
    size: "Gigante",
    life: "9-10 anos",
    origin: "Canadá",
    group: "Working",
    image: "https://images.dog.ceo/breeds/newfoundland/placeholder.jpg"
  },
  "norfolk_terrier": {
    name: "Norfolk Terrier",
    temperament: ["Alerta","Comunicativo"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-norfolk/placeholder.jpg"
  },
  "norwegian_elkhound": {
    name: "Norwegian Elkhound",
    temperament: ["Corajoso","Leal"],
    energy: "Alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "Noruega",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/elkhound-norwegian/placeholder.jpg"
  },
  "norwich_terrier": {
    name: "Norwich Terrier",
    temperament: ["Inteligente","Afetuoso"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-norwich/placeholder.jpg"
  },
  "old_english_sheepdog": {
    name: "Old English Sheepdog",
    temperament: ["Brincalhão","Inteligente"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "Inglaterra",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/sheepdog-english/placeholder.jpg"
  },
  "otterhound": {
    name: "Otterhound",
    temperament: ["Amiudado","Amigável"],
    energy: "Alta",
    size: "Grande",
    life: "10-13 anos",
    origin: "Inglaterra",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/otterhound/placeholder.jpg"
  },
  "papillon": {
    name: "Papillon",
    temperament: ["Feliz","Alerta"],
    energy: "Média",
    size: "Pequeno",
    life: "14-16 anos",
    origin: "França",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/papillon/placeholder.jpg"
  },
  "pekinese": {
    name: "Pekingese",
    temperament: ["Cativante","Fiel"],
    energy: "Baixa",
    size: "Pequeno",
    life: "12-14 anos",
    origin: "China",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/pekinese/placeholder.jpg"
  },
  "pembroke": {
    name: "Pembroke Welsh Corgi",
    temperament: ["Inteligente","Alert"],
    energy: "Média",
    size: "Pequeno",
    life: "12-13 anos",
    origin: "País de Gales",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/corgi-pembroke/placeholder.jpg"
  },
  "pomeranian": {
    name: "Lulu da Pomerânia",
    temperament: ["Extrovertido","Amigável","Inteligente"],
    energy: "Média",
    size: "Pequeno",
    life: "12-16 anos",
    origin: "Alemanha/Polônia",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/pomeranian/n02112018_1020.jpg"
  },
  "poodle": {
    name: "Poodle",
    temperament: ["Inteligente","Ativo","Elegante"],
    energy: "Alta",
    size: "Variado",
    life: "12-15 anos",
    origin: "Alemanha/França",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/poodle-standard/n02113799_491.jpg"
  },
  "pug": {
    name: "Pug",
    temperament: ["Brincalhão","Amigável","Charmoso"],
    energy: "Baixa",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "China",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/pug/n02110958_1004.jpg"
  },
  "redbone": {
    name: "Redbone Coonhound",
    temperament: ["Energético","Ternurento"],
    energy: "Alta",
    size: "Grande",
    life: "12-15 anos",
    origin: "Estados Unidos",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-redbone/placeholder.jpg"
  },
  "rhodesian_ridgeback": {
    name: "Rhodesian Ridgeback",
    temperament: ["Leal","Inteligente"],
    energy: "Alta",
    size: "Grande",
    life: "10-12 anos",
    origin: "África do Sul",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/ridgeback-rhodesian/placeholder.jpg"
  },
  "rottweiler": {
    name: "Rottweiler",
    temperament: ["Confiante","Leal","Protetor"],
    energy: "Média",
    size: "Grande",
    life: "8-10 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/rottweiler/n02106504_10147.jpg"
  },
  "saint bernard": {
    name: "São Bernardo",
    temperament: ["Gentil","Calmo","Amigável"],
    energy: "Baixa",
    size: "Gigante",
    life: "8-10 anos",
    origin: "Suíça/Itália",
    group: "Working",
    image: "https://images.dog.ceo/breeds/stbernard/n02109525_1021.jpg"
  },
  "saluki": {
    name: "Saluki",
    temperament: ["Distante","Calmo"],
    energy: "Alta",
    size: "Grande",
    life: "10-17 anos",
    origin: "Oriente Médio",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/saluki/placeholder.jpg"
  },
  "samoyed": {
    name: "Samioieda",
    temperament: ["Teimoso","Amigável","Sociável"],
    energy: "Alta",
    size: "Grande",
    life: "12-14 anos",
    origin: "Rússia",
    group: "Working",
    image: "https://images.dog.ceo/breeds/samoyed/n02111886_1004.jpg"
  },
  "schipperke": {
    name: "Schipperke",
    temperament: ["Curioso","Confiante"],
    energy: "Alta",
    size: "Pequeno",
    life: "13-15 anos",
    origin: "Bélgica",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/schipperke/placeholder.jpg"
  },
  "scotch_terrier": {
    name: "Scottish Terrier",
    temperament: ["Independente","Ativo"],
    energy: "Média",
    size: "Pequeno",
    life: "12-14 anos",
    origin: "Escócia",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-scottish/placeholder.jpg"
  },
  "scottish_deerhound": {
    name: "Scottish Deerhound",
    temperament: ["Gentil","Discreto"],
    energy: "Média",
    size: "Grande",
    life: "8-11 anos",
    origin: "Escócia",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/deerhound-scottish/placeholder.jpg"
  },
  "sealyham_terrier": {
    name: "Sealyham Terrier",
    temperament: ["Alerta","Animado"],
    energy: "Média",
    size: "Pequeno",
    life: "12-14 anos",
    origin: "País de Gales",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-sealyham/placeholder.jpg"
  },
  "shetland_sheepdog": {
    name: "Shetland Sheepdog",
    temperament: ["Inteligente","Ágil"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-14 anos",
    origin: "Escócia",
    group: "Herding",
    image: "https://images.dog.ceo/breeds/sheepdog-shetland/placeholder.jpg"
  },
  "shih tzu": {
    name: "Shih Tzu",
    temperament: ["Afetuoso","Calmo","Amigável"],
    energy: "Baixa",
    size: "Pequeno",
    life: "10-16 anos",
    origin: "China",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/shihtzu/n02099712_5648.jpg"
  },
  "siberian husky": {
    name: "Husky Siberiano",
    temperament: ["Energético","Independente","Amigável"],
    energy: "Muito alta",
    size: "Médio",
    life: "12-14 anos",
    origin: "Rússia",
    group: "Working",
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg"
  },
  "silky_terrier": {
    name: "Silky Terrier",
    temperament: ["Amigável","Alegre"],
    energy: "Alta",
    size: "Pequeno",
    life: "13-15 anos",
    origin: "Austrália",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/terrier-silky/placeholder.jpg"
  },
  "soft": {
    name: "Soft Coated Wheaten Terrier",
    temperament: ["Alegre","Leal"],
    energy: "Alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "Irlanda",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-wheaten/placeholder.jpg"
  },
  "staffordshire_bullterrier": {
    name: "Staffordshire Bull Terrier",
    temperament: ["Corajoso","Gentil"],
    energy: "Alta",
    size: "Médio",
    life: "12-14 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/bullterrier-staffordshire/placeholder.jpg"
  },
  "standard_poodle": {
    name: "Standard Poodle",
    temperament: ["Inteligente","Ativo"],
    energy: "Alta",
    size: "Grande",
    life: "12-15 anos",
    origin: "Alemanha/França",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/poodle-standard/placeholder.jpg"
  },
  "standard_schnauzer": {
    name: "Standard Schnauzer",
    temperament: ["Sagaz","Confiável"],
    energy: "Alta",
    size: "Médio",
    life: "13-16 anos",
    origin: "Alemanha",
    group: "Working",
    image: "https://images.dog.ceo/breeds/schnauzer-standard/placeholder.jpg"
  },
  "sussex_spaniel": {
    name: "Sussex Spaniel",
    temperament: ["Calmo","Amigável"],
    energy: "Média",
    size: "Médio",
    life: "13-15 anos",
    origin: "Inglaterra",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/spaniel-sussex/placeholder.jpg"
  },
  "tibetan_mastiff": {
    name: "Tibetan Mastiff",
    temperament: ["Protetor","Independente"],
    energy: "Baixa",
    size: "Gigante",
    life: "10-12 anos",
    origin: "Tibet",
    group: "Working",
    image: "https://images.dog.ceo/breeds/mastiff-tibetan/placeholder.jpg"
  },
  "tibetan_terrier": {
    name: "Tibetan Terrier",
    temperament: ["Afetuoso","Sensível"],
    energy: "Média",
    size: "Médio",
    life: "15-16 anos",
    origin: "Tibet",
    group: "Non-Sporting",
    image: "https://images.dog.ceo/breeds/terrier-tibetan/placeholder.jpg"
  },
  "toy_poodle": {
    name: "Toy Poodle",
    temperament: ["Inteligente","Ágil"],
    energy: "Alta",
    size: "Pequeno",
    life: "10-18 anos",
    origin: "Alemanha/França",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/poodle-toy/placeholder.jpg"
  },
  "toy_terrier": {
    name: "Toy Terrier",
    temperament: ["Atento","Curioso"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "TBD",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/terrier-toy/placeholder.jpg"
  },
  "vizsla": {
    name: "Vizsla",
    temperament: ["Energético","Afeituoso"],
    energy: "Alta",
    size: "Médio",
    life: "12-14 anos",
    origin: "Hungria",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/vizsla/placeholder.jpg"
  },
  "walker_hound": {
    name: "Walker Hound",
    temperament: ["Inteligente","Alerta"],
    energy: "Alta",
    size: "Grande",
    life: "12-13 anos",
    origin: "EUA",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/hound-walker/placeholder.jpg"
  },
  "weimaraner": {
    name: "Weimaraner",
    temperament: ["Destemido","Alert"],
    energy: "Alta",
    size: "Grande",
    life: "10-13 anos",
    origin: "Alemanha",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/weimaraner/placeholder.jpg"
  },
  "welsh_springer_spaniel": {
    name: "Welsh Springer Spaniel",
    temperament: ["Dócil","Corajoso"],
    energy: "Alta",
    size: "Médio",
    life: "12-15 anos",
    origin: "País de Gales",
    group: "Sporting",
    image: "https://images.dog.ceo/breeds/spaniel-welsh/placeholder.jpg"
  },
  "west_highland_white_terrier": {
    name: "West Highland White Terrier",
    temperament: ["Feliz","Valente"],
    energy: "Alta",
    size: "Pequeno",
    life: "13-15 anos",
    origin: "Escócia",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-westhighland/placeholder.jpg"
  },
  "whippet": {
    name: "Whippet",
    temperament: ["Brincalhão","Gentil"],
    energy: "Média",
    size: "Médio",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Hound",
    image: "https://images.dog.ceo/breeds/whippet/placeholder.jpg"
  },
  "wire": {
    name: "Wire Fox Terrier",
    temperament: ["Alerta","Determinado"],
    energy: "Alta",
    size: "Pequeno",
    life: "12-15 anos",
    origin: "Inglaterra",
    group: "Terrier",
    image: "https://images.dog.ceo/breeds/terrier-wire/placeholder.jpg"
  },
  "yorkshire terrier": {
    name: "Yorkshire Terrier",
    temperament: ["Corajoso","Energético","Afetuoso"],
    energy: "Alta",
    size: "Pequeno",
    life: "13-16 anos",
    origin: "Inglaterra",
    group: "Toy",
    image: "https://images.dog.ceo/breeds/terrier-yorkshire/n02094435_1004.jpg"
  }
};
