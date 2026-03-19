import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'https://dog.ceo/api';

function formatName(breed: string, subBreed?: string) {
  if (subBreed) {
    return `${subBreed} ${breed}`;
  }
  return breed;
}

function capitalize(str: string) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Configuração global do axios para evitar bloqueios simples de User-Agent
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

async function getBreeds() {
  try {
    const res = await api.get('/breeds/list/all');
    return res.data.message;
  } catch (error: any) {
    console.error('❌ Erro ao buscar lista de raças:', error.message);
    return {};
  }
}

async function getImage(breed: string, subBreed?: string) {
  const url = subBreed
    ? `/breed/${breed}/${subBreed}/images/random`
    : `/breed/${breed}/images/random`;

  try {
    const res = await api.get(url);
    return res.data.message;
  } catch (error: any) {
    // Se der erro 404 ou 520, apenas ignora o registro da imagem
    return null;
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateDatabase() {
  const breeds = await getBreeds();

  const dogs: Record<string, any> = {};

  for (const breed in breeds) {
    const subBreeds = breeds[breed];

    if (subBreeds.length === 0) {
      await sleep(150); // Delay de 150ms para evitar erro 520 (Cloudflare)
      const image = await getImage(breed);

      const key = breed.toLowerCase();

      dogs[key] = {
        name: capitalize(breed),
        temperament: [],
        energy: "Desconhecida",
        size: "Desconhecido",
        life: "Desconhecido",
        origin: "Desconhecido",
        group: "Desconhecido",
        image
      };

      console.log(`✔ ${key}`);
    } else {
      for (const sub of subBreeds) {
        await sleep(150); // Delay entre sub-raças
        const image = await getImage(breed, sub);

        const key = `${sub} ${breed}`.toLowerCase();

        dogs[key] = {
          name: capitalize(`${sub} ${breed}`),
          temperament: [],
          energy: "Desconhecida",
          size: "Desconhecido",
          life: "Desconhecido",
          origin: "Desconhecido",
          group: "Desconhecido",
          image
        };

        console.log(`✔ ${key}`);
      }
    }
  }

  const fileContent = `export interface DogInfo {
  name: string;
  temperament: string[];
  energy: string;
  size: string;
  life: string;
  origin: string;
  group: string;
  image: string;
}

export const dogs: Record<string, DogInfo> = ${JSON.stringify(dogs, null, 2)};
`;

  // Salva no local correto da arquitetura TypeScript
  if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data', { recursive: true });
  }
  
  fs.writeFileSync('src/data/dogs.ts', fileContent);

  console.log('\n🐶 Banco gerado com sucesso em src/data/dogs.ts!');
}

generateDatabase();