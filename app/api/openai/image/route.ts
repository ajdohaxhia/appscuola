import { NextResponse } from 'next/server';

// Check for required environment variable
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

// OpenAI API URL
const apiUrl = 'https://api.openai.com/v1/images/generations';

export async function POST(request: Request) {
  try {
    // Get request body
    const { 
      prompt, 
      n = 1, 
      size = '1024x1024', 
      quality = 'standard', 
      style = 'vivid',
      model = 'dall-e-3'
    } = await request.json();

    // Validate request
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: prompt is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Make request to OpenAI
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n,
        size,
        quality,
        style,
        model
      }),
    });

    // Handle error response from OpenAI
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || `HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in OpenAI image API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 