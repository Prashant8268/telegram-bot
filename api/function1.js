// Import any required dependencies or modules
import {bootstrap} from '../src/main';

// Define the main handler function for your serverless function
exports.handler = async (event, context) => {
  try {
    bootstrap();

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
