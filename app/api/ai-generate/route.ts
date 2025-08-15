import { NextResponse } from 'next/server';

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

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is not configured');
      return NextResponse.json(
        { error: { message: 'Server configuration error' } },
        { status: 500 }
      );
    }

    // Build a well-structured messages array
    const messages = [
      {
        role: 'system',
        content:
          'You are a concise, expert assistant. Follow the user’s instructions precisely, ask for missing details only when critical, cite sources when the user requests them, and respond in Markdown with short sections and bullet lists when helpful.'
      },
      // Optional: few-shot example to steer tone/format
      // {
      //   role: 'user',
      //   content: 'Summarize the key differences between SQL and NoSQL.'
      // },
      // {
      //   role: 'assistant',
      //   content: '- SQL: structured schema, ACID, joins.\n- NoSQL: flexible schema, horizontal scaling, eventual consistency.'
      // },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    // Optional: allow client to request JSON output format
    const forceJson = body?.format === 'json';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        // Optional OpenRouter headers for tracing/routing when you have them:
        // 'HTTP-Referer': 'https://your-app.example', // helps ranking and analytics
        // 'X-Title': 'Your App Name',                 // shows in OpenRouter dashboard
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages,
        temperature: typeof body?.temperature === 'number' ? body.temperature : 0.5,
        top_p: typeof body?.top_p === 'number' ? body.top_p : 0.9,
        max_tokens: typeof body?.max_tokens === 'number' ? body.max_tokens : 800,
        // If you want JSON formatted responses, some models honor response_format:
        response_format: forceJson ? { type: 'json_object' } : undefined
      })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: 'Failed to parse error response' } };
      }

      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        headers: Object.fromEntries(response.headers.entries())
      });

      return NextResponse.json(
        {
          error: {
            message: errorData.error?.message || 'Failed to generate content',
            type: errorData.error?.type,
            code: errorData.error?.code
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    let generatedText = data.choices?.[0]?.message?.content || '';
    
    // Convert markdown to clean HTML
    generatedText = generatedText
      // Convert **bold** to <strong>bold</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to <em>italic</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert lists
      .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
      // Convert numbered lists
      .replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')
      // Add line breaks for paragraphs
      .replace(/\n\s*\n/g, '</p><p>')
      // Convert remaining newlines to <br>
      .replace(/\n/g, '<br>');
    
    // Wrap in proper HTML structure
    generatedText = `<div class="ai-generated-content">${generatedText}</div>`;

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
