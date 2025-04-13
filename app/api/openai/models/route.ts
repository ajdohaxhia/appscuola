import { NextResponse } from 'next/server';

// OpenAI API URL for listing models
const modelsApiUrl = 'https://api.openai.com/v1/models';

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return NextResponse.json(
        { error: 'OpenAI API key not configured on the server.' },
        { status: 500 }
      );
    }

    const response = await fetch(modelsApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API Error fetching models:', errorData);
      const errorMessage = errorData?.error?.message || `HTTP error ${response.status}`;
      return NextResponse.json(
        { error: `Failed to fetch models from OpenAI: ${errorMessage}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter for chat models (typically start with 'gpt-' or include 'instruct') and return only their IDs
    // You might want to refine this filter based on the specific models you want to offer.
    const chatModels = data.data
      ?.filter((model: any) => 
        model.id.startsWith('gpt-') || 
        (model.id.includes('instruct') && !model.id.includes('embed')) // Basic filter, adjust as needed
      )
      .map((model: any) => model.id)
      .sort(); // Sort alphabetically

    return NextResponse.json({ models: chatModels || [] });

  } catch (error) {
    console.error('Error in OpenAI models API route:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching models.' },
      { status: 500 }
    );
  }
} 