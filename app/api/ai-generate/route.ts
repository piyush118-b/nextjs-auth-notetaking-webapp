import { NextResponse } from 'next/server';
import { marked } from 'marked';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawPrompt: unknown = body?.prompt;
    const userPrompt = typeof rawPrompt === 'string' ? rawPrompt.trim() : '';

    if (!userPrompt) {
      return NextResponse.json(
        { error: { message: 'Prompt is required' } },
        { status: 400 }
      );
    }

    // Build a well-structured messages array
    const messages = [
      {
        role: 'system',
        content:
          'You are a concise, expert assistant. Follow the user’s instructions precisely, ask for missing details only when critical, cite sources when the user requests them, and respond in Markdown with short sections and bullet lists when helpful.'
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1:latest',
        messages,
        stream: false,
        options: {
          temperature: typeof body?.temperature === 'number' ? body.temperature : 0.5,
          top_p: typeof body?.top_p === 'number' ? body.top_p : 0.9,
        }
      })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: 'Failed to parse error response' } };
      }

      console.error('Ollama API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      return NextResponse.json(
        {
          error: {
            message: errorData.error?.message || 'Failed to generate content via Ollama. Make sure Ollama is running locally.',
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    let generatedText = data.message?.content || '';

    // Convert markdown securely to clean HTML using marked
    const htmlContent = await marked.parse(generatedText);

    // Wrap in proper HTML structure
    generatedText = `<div class="ai-generated-content">${htmlContent}</div>`;

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
