import { AnalyzeService } from '../services/analyzeService';
import { visionClient } from '../config/vision';

// Mock Vision Client
jest.mock('../config/vision', () => ({
  visionClient: {
    labelDetection: jest.fn()
  }
}));

async function test() {
  const service = new AnalyzeService();
  
  console.log('Test 1: Normal dog');
  (visionClient.labelDetection as jest.Mock).mockResolvedValueOnce([
    {
      labelAnnotations: [
        { description: 'Golden Retriever', score: 0.95 },
        { description: 'Dog', score: 0.99 }
      ]
    }
  ]);
  const res1 = await service.analyzeImage('dummy.jpg');
  console.log(JSON.stringify(res1, null, 2));

  console.log('\nTest 2: No dog labels');
  (visionClient.labelDetection as jest.Mock).mockResolvedValueOnce([
    {
      labelAnnotations: [
        { description: 'Grass', score: 0.8 }
      ]
    }
  ]);
  const res2 = await service.analyzeImage('dummy.jpg');
  console.log(JSON.stringify(res2, null, 2));

  console.log('\nTest 3: Empty labels');
  (visionClient.labelDetection as jest.Mock).mockResolvedValueOnce([
    {
      labelAnnotations: []
    }
  ]);
  const res3 = await service.analyzeImage('dummy.jpg');
  console.log(JSON.stringify(res3, null, 2));
}

// Since I can't run jest easily here without setup, 
// I'll just create a simple script that I can run with ts-node if available, 
// or just manually verify the logic I wrote.
