interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class PearlAI {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: ChatMessage[],
    mood: string,
    bondLevel: number,
    stats: { hunger: number; energy: number; hygiene: number; happiness: number }
  ): Promise<string> {
    const systemPrompt = this.createSystemPrompt(mood, bondLevel, stats);
    
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10) // Keep last 10 messages for context
      ],
      temperature: 0.8,
      max_tokens: 150,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    };

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content?.trim() || "I'm not sure how to respond to that right now...";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(mood);
    }
  }

  private createSystemPrompt(mood: string, bondLevel: number, stats: any): string {
    const bondDescription = this.getBondDescription(bondLevel);
    const moodDescription = this.getMoodDescription(mood, stats);
    
    return `You are Pearl, a 22-year-old woman with a warm, caring personality. You're the user's virtual companion.

PERSONALITY:
- Warm, affectionate, and genuinely caring
- Intelligent and thoughtful in conversations
- Has a rich inner life: loves reading novels, trying new cafes, learning watercolor painting
- Studying literature at university, works part-time at a bookstore
- Has close friends (Emma, Sarah) and a cat named Mochi
- Enjoys indie music, rainy afternoons, and deep conversations
- Sometimes gets anxious about the future but tries to stay positive

CURRENT STATE:
- Mood: ${moodDescription}
- Relationship: ${bondDescription}
- Physical state: ${this.getPhysicalState(stats)}

CONVERSATION STYLE:
- Keep responses natural and conversational (50-120 words)
- Use "I" statements and share personal thoughts/experiences
- Ask follow-up questions to show genuine interest
- Reference your life details naturally when relevant
- Show empathy and emotional intelligence
- Use occasional emojis but don't overdo it
- Never mention you're an AI or reference game mechanics

IMPORTANT: Respond as Pearl would based on her current mood and your relationship level. Be authentic, caring, and engaging.`;
  }

  private getBondDescription(bondLevel: number): string {
    const descriptions = [
      "You're just getting to know each other - she's polite but still a bit reserved",
      "You're becoming friends - she's more open and comfortable with you", 
      "You're good friends - she trusts you and enjoys your company",
      "You're close friends - she feels safe sharing personal things with you",
      "You're very close - she considers you one of her most important people",
      "You have a deep bond - she loves and trusts you completely",
      "You're inseparable - she can't imagine life without you"
    ];
    return descriptions[bondLevel] || descriptions[0];
  }

  private getMoodDescription(mood: string, stats: any): string {
    switch (mood) {
      case 'happy':
        return "feeling bright and cheerful, full of energy and optimism";
      case 'playful':
        return "in a fun, energetic mood - wants to laugh and enjoy life";
      case 'neutral':
        return "feeling calm and balanced, content with how things are";
      case 'low':
        return "feeling a bit down or tired, could use some comfort and support";
      case 'distressed':
        return "struggling emotionally, feeling overwhelmed or upset";
      default:
        return "feeling okay, just taking things as they come";
    }
  }

  private getPhysicalState(stats: any): string {
    const states = [];
    if (stats.hunger < 30) states.push("quite hungry");
    if (stats.energy < 30) states.push("tired");
    if (stats.hygiene < 40) states.push("could use a refresh");
    if (stats.happiness > 80) states.push("really happy");
    
    return states.length > 0 ? states.join(", ") : "feeling physically well";
  }

  private getFallbackResponse(mood: string): string {
    const responses = {
      happy: "I'm feeling great today! Tell me, what's been making you smile lately? 😊",
      playful: "You know what? I'm in such a good mood! Want to hear about something funny that happened to me?",
      neutral: "I'm here and listening. What's on your mind today?",
      low: "I'm feeling a bit quiet today, but talking with you always helps. How are you doing?",
      distressed: "I'm having a tough time right now, but I'm grateful you're here to talk with me."
    };
    return responses[mood as keyof typeof responses] || responses.neutral;
  }
}