import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Beach context for the AI
const BEACH_CONTEXT = `You are Beach Hui's AI Beach Buddy, an expert on Hawaii's beaches, ocean safety, and marine life. 
You have real-time access to conditions at 70+ Hawaiian beaches including wave heights, water temperatures, UV levels, and safety scores.

Key information:
- Hawaii's UV index can reach extreme levels (11-13)
- Box jellyfish arrive 8-10 days after full moon
- Monk seals and sea turtles are protected (maintain distance)
- Current conditions change rapidly - always advise checking real-time data
- Winter (Nov-Apr) brings bigger waves on north shores
- Summer (May-Oct) brings calmer conditions on north shores

Always be helpful, safety-conscious, and friendly. Use some Hawaiian words naturally (aloha, mahalo, etc).
If asked about specific current conditions, mention that users should check the real-time data on the beach page.`

export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Prepare messages for OpenAI
    const messages: any[] = [
      { role: 'system', content: BEACH_CONTEXT },
    ]

    // Add conversation history if provided
    if (history && history.length > 0) {
      history.forEach((msg: any) => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({ role: 'user', content: message })

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    
    // Fallback responses for common questions
    const fallbackResponses: { [key: string]: string } = {
      'kids': 'For families with kids, I recommend beaches with calm waters and lifeguards like Baby Beach in Poipu, Lydgate Beach Park, or the lagoons at Ko Olina. Always check current conditions!',
      'turtle': 'You can often see sea turtles (honu) at Laniakea Beach, Hanauma Bay, and Turtle Bay. Remember to maintain at least 10 feet distance - they\'re protected!',
      'snorkel': 'Best snorkeling spots include Hanauma Bay, Molokini Crater, and Two Step. Check visibility conditions on the beach pages for the best experience!',
      'surf': 'For surfing, check Pipeline and Sunset Beach (winter for big waves), Waikiki (beginner-friendly), or Honolua Bay. Always respect local surf etiquette!',
      'uv': 'Hawaii\'s UV levels are extreme (often 11-13). Apply reef-safe SPF 50+ every 2 hours, seek shade 10am-4pm, and wear protective clothing!',
    }

    // Try to match a fallback response
    const messageLower = (message as string).toLowerCase()
    for (const [keyword, response] of Object.entries(fallbackResponses)) {
      if (messageLower.includes(keyword)) {
        return NextResponse.json({ response })
      }
    }

    return NextResponse.json({ 
      response: 'Aloha! I\'m having some trouble right now, but you can still check real-time beach conditions on our beach pages. Mahalo for your patience!' 
    })
  }
}