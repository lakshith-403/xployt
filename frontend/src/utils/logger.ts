// Function to check if the directive is present in the file
const hasLogDirective = (source: string): boolean => {
  console.log('Checking source for directive...');
  const directive = '// LOG: ENABLED';
  return source.includes(directive);
};

// Function to retrieve the source of the calling file
const getFileContent = async (filePath: string): Promise<string> => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  return await response.text();
};

// Check if logging is enabled for the given file
const shouldLog = async (filePath: string): Promise<boolean> => {
  try {
    const source = await getFileContent(filePath);
    return hasLogDirective(source);
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return false;
  }
};

// Log a message if logging is enabled
const log = async (message: string): Promise<void> => {
  const stack: string | undefined = new Error().stack;
  if (!stack) return;

  // Split stack trace into lines and iterate through possible lines
  const stackLines = stack.split('\n');
  for (let i = 2; i < stackLines.length; i++) {
    const line = stackLines[i]?.trim();
    if (!line) continue;

    // Attempt to extract file path from the current line
    const callerFilePathMatch = line.match(/\((.*):\d+:\d+\)/);
    if (!callerFilePathMatch) continue;

    const filePath: string = callerFilePathMatch[1];

    // Check if the directive exists in the file
    if (await shouldLog(filePath)) {
      console.log(message); // Log the message if the directive is found
      console.log(`Logged from: ${filePath}`); // Debug information
      return;
    }
  }

  console.warn('No suitable file with the directive found in the stack trace.');
};

// Attach the log function to the global object
if (typeof global !== 'undefined') {
  (global as any).log = log; // For Node.js-like environments
} else if (typeof window !== 'undefined') {
  (window as any).log = log; // For browser environments
}
