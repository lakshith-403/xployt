import NETWORK from '@/data/network/network';

interface importDBData {
  endpoint: string;
  location: string;
  format: 'json' | 'csv' | 'xml' | 'custom'; // Predefined formats
}

let dataValid: boolean = false;

const queryConfigs: importDBData[] = [
  { endpoint: '/api/new-project/admin', location: './src/data/imported/test.json', format: 'json' },
  // Add more configurations as needed
];

export async function importDBData() {
  if (dataValid) {
    return;
  }
  for (const queryConfig of queryConfigs) {
    const response = await NETWORK.get(queryConfig.endpoint, { showLoading: true, handleError: true, throwError: true, showSuccess: false });
    console.log('response', response);
    const jsonData = response.data.projects;
    console.log('jsonData', jsonData);
    // const formattedData = formatData(jsonData, queryConfig.format);
    // localStorage.setItem(queryConfig.location, formattedData);
  }
}

function formatData(data: any, format: 'json' | 'csv' | 'xml' | 'custom'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'csv':
      return convertToCSV(data);
    case 'xml':
      return convertToXML(data);
    case 'custom':
      return convertToCustomFormat(data);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function convertToCSV(data: any): string {
  // Implement CSV conversion logic
  return '';
}

function convertToXML(data: any): string {
  // Implement XML conversion logic
  return '';
}

function convertToCustomFormat(data: any): string {
  // Implement your custom format logic
  return data.map((item: any) => `Item: ${JSON.stringify(item)}`).join('\n');
}
