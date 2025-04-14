import { NextResponse } from 'next/server';

// Check for required environment variable
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

// OpenAI API URL - updated to include version
const apiUrl = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: Request) {
  try {
    // Get request body
    const { messages, temperature = 0.7, max_tokens = 500, model = 'gpt-3.5-turbo' } = await request.json();

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
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
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v1'  // Add API version header
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    // Handle error response from OpenAI
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: `HTTP error ${response.status}` } }));
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: error.error?.message || `HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in OpenAI API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 