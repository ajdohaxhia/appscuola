import { NextResponse } from 'next/server';

// Check for required environment variable
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

// OpenAI API URL
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
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Log the request for debugging
    console.log('Making request to OpenAI API:', {
      model,
      messageCount: messages.length,
      temperature,
      max_tokens
    });

    // Make request to OpenAI
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Organization': process.env.OPENAI_ORG_ID || '',
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
      let errorMessage = `HTTP error ${response.status}`;
      let errorDetails = {};
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
        errorDetails = errorData;
        console.error('OpenAI API error:', {
          status: response.status,
          message: errorMessage,
          details: errorDetails
        });
      } catch (e) {
        console.error('Error parsing OpenAI error response:', e);
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Parse and validate successful response
    try {
      const data = await response.json();
      
      // Validate response structure
      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid OpenAI response structure:', data);
        return NextResponse.json(
          { error: 'Invalid response from OpenAI API' },
          { status: 500 }
        );
      }

      // Log successful response
      console.log('OpenAI API response received successfully');

      return NextResponse.json(data);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      return NextResponse.json(
        { error: 'Error parsing OpenAI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in OpenAI API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 