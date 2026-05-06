export async function generateWithIntuita(
  goalType: string,
  purpose: string,
  tone: number,
  additionalContext: string,
  includeCTA: boolean
): Promise<string> {
  const systemPrompt = buildSystemPrompt(goalType, purpose, tone, additionalContext, includeCTA);

  // Check for API key
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    // Return mock data for demo purposes
    return getMockResponse(goalType, purpose, tone, includeCTA);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: systemPrompt }],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('API Error:', error);
    return getMockResponse(goalType, purpose, tone, includeCTA);
  }
}

function buildSystemPrompt(
  goalType: string,
  purpose: string,
  tone: number,
  context: string,
  includeCTA: boolean
): string {
  const toneLabel =
    tone < 30
      ? 'formal and professional'
      : tone > 70
        ? 'casual and friendly'
        : 'balanced and approachable';

  return `Generate a high-quality ${goalType} for the purpose of: ${purpose}.

Tone: ${toneLabel} (${tone}/100 on the formal-to-casual scale).
${context ? `Additional context: ${context}` : ''}
${includeCTA ? 'Include a clear call-to-action at the end.' : 'Do not add a call-to-action.'}

Write the full output only. No preamble, no meta-commentary, no "Here is your email:" prefix. Just the content itself.`;
}

function getMockResponse(
  goalType: string,
  _purpose: string,
  tone: number,
  includeCTA: boolean
): string {
  const toneWord = tone < 30 ? 'formally' : tone > 70 ? 'casually' : 'professionally';

  const responses: Record<string, string> = {
    email: `Dear Team,

I hope this message finds you well. I wanted to reach out regarding our upcoming project milestone and share some exciting updates.

After careful analysis of our Q3 performance metrics, I'm pleased to report that we've exceeded our targets by 23%. This achievement reflects the dedication and collaborative spirit of every team member.

Key highlights include:
• Revenue growth of 23% quarter-over-quarter
• Customer satisfaction scores reaching an all-time high of 4.8/5
• Successful launch of three new product features
• Team expansion with five exceptional new hires

Looking ahead, I'd like to propose a brief alignment meeting this Thursday to discuss our Q4 strategy and ensure we maintain this positive momentum.

${includeCTA ? '\nPlease reply to this email by Wednesday EOD to confirm your availability for the Thursday meeting. I look forward to hearing from you.\n' : ''}Best regards,
Your Name`,

    document: `# Project Overview & Strategic Analysis

## Executive Summary

This document outlines our comprehensive approach to the upcoming initiative, written ${toneWord} for maximum clarity and impact. Our analysis reveals significant opportunities for growth and optimization across all key business verticals.

## Current State Assessment

Our organization has demonstrated remarkable resilience and adaptability in the face of evolving market conditions. The data indicates a clear upward trajectory in both user engagement and revenue generation.

### Key Metrics
- **User Growth**: 156% year-over-year increase
- **Retention Rate**: 89% (industry average: 67%)
- **NPS Score**: 72 (excellent)
- **Time to Value**: Reduced by 40%

## Strategic Recommendations

1. **Expand Market Reach**: Target adjacent market segments with tailored messaging
2. **Enhance Product Experience**: Invest in UX research and iterative design improvements  
3. **Build Strategic Partnerships**: Identify and cultivate relationships with complementary platforms
4. **Scale Operations**: Implement automation for repetitive processes

## Next Steps

The proposed timeline spans 90 days, with bi-weekly check-ins to ensure alignment and address any emerging challenges.

${includeCTA ? '\n**Action Required**: Please review this document and submit your feedback via the shared workspace by Friday, March 15th.\n' : ''}`,

    'social post': `✨ Big news dropping today.

We've been quietly building something that changes how you work with AI — and it's finally here.

No more staring at blank prompt boxes. No more "prompt engineering." No more guessing what to type.

Just tell our AI what you need → it handles the rest.

🚀 3 seconds. That's all it takes.

The future of AI isn't about writing better prompts.
It's about not writing them at all.

${includeCTA ? '\n🔗 Try it free → intuita.ai (link in bio)\n' : ''}#AI #ProductLaunch #NoCode #Innovation #FutureOfWork`,

    summary: `## Executive Summary

This comprehensive analysis synthesizes the key findings from the provided materials, distilling complex information into actionable insights.

### Core Findings

**1. Market Opportunity**
The addressable market has expanded by 340% over the past 18 months, driven primarily by the democratization of AI tools and growing demand for no-code solutions. Early movers in the zero-prompt space are capturing disproportionate market share.

**2. Competitive Landscape**
While several competitors offer simplified AI interfaces, none have fully eliminated the prompt barrier. This represents a significant differentiator and first-mover advantage for platforms adopting a truly zero-prompt approach.

**3. User Behavior Insights**
Research indicates that 73% of potential AI users abandon tools within the first session due to "prompt anxiety" — the uncertainty of not knowing what to type. Removing this friction point could unlock a massive underserved market segment.

### Recommendations
- Prioritize the zero-prompt UX as the primary value proposition
- Invest in guided wizard experiences that feel intuitive to non-technical users
- Build trust through transparency — show users *how* the AI interpreted their selections

${includeCTA ? '\n**Next Step**: Schedule a deep-dive session with the strategy team to align on implementation priorities.\n' : ''}`,
  };

  return responses[goalType.toLowerCase()] || responses.email;
}
