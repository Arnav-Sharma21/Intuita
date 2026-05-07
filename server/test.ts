const apiKey = 'AIzaSyBYdVyUc9zUWH_LOZP57qrLYG4cYokNxic';

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error.message);
      return;
    }
    
    console.log('✅ Models available for your API key:');
    const modelNames = data.models.map((m: any) => m.name);
    console.log(modelNames.join('\n'));
    
    if (modelNames.length === 0) {
      console.log('No models are available! You need a new API key from a new project.');
    }
  } catch (e: any) {
    console.error('Fetch error:', e.message);
  }
}

listModels();
