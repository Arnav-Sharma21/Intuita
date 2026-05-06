// ─── TONE MAPPING ────────────────────────────────────────────────────────────

export function toneLabel(t: number): string {
  if (t <= 15)  return 'strictly formal and corporate';
  if (t <= 35)  return 'professional and polished';
  if (t <= 55)  return 'balanced, clear and approachable';
  if (t <= 75)  return 'conversational and warm';
  return 'casual, friendly and relaxed';
}

export function toneShortLabel(t: number): string {
  if (t <= 15)  return 'Strictly Formal';
  if (t <= 35)  return 'Formal';
  if (t <= 55)  return 'Balanced';
  if (t <= 75)  return 'Casual';
  return 'Very Casual';
}

export function lengthGuide(l?: string): string {
  if (l === 'short') return 'Be concise — under 150 words total.';
  if (l === 'long')  return 'Be thorough — aim for 400+ words with clear structure.';
  return 'Aim for 200–320 words.';
}

const RULES = `
OUTPUT RULES (NEVER BREAK THESE):
- Output ONLY the final content — zero preamble, zero commentary, zero "Here is your..." prefix
- No placeholder text like [Your Name], [Company Name], [Date]
- No notes, explanations, or postscript after the content ends
- Make every word count — no filler, no repetition
- Sound like a skilled human wrote it
`.trim();

// ─── WIZARD PROMPT ────────────────────────────────────────────────────────────

export interface WizardInput {
  goalType: string;
  purpose: string;
  tone: number;
  audience?: string;
  additionalContext?: string;
  includeCTA?: boolean;
  length?: 'short' | 'medium' | 'long';
  platform?: string;
}

export function buildWizardPrompt(d: WizardInput): string {
  const tone = toneLabel(d.tone);
  const length = lengthGuide(d.length);

  const typeMap: Record<string, string> = {
    email: `Write a complete, ready-to-send email.
Format EXACTLY as:
Subject: [subject line here]

[greeting],

[body paragraphs]

[sign-off],
[Name]`,

    document: `Write a complete, well-structured professional document.
Use clear headings (##) and sections. Make it ready to use without edits.`,

    social: `Write a complete social media post for ${d.platform || 'general social media'}.
${d.platform === 'twitter'    ? 'Hard limit: 280 characters. Count carefully.' : ''}
${d.platform === 'linkedin'   ? 'Use line breaks for readability. End with 2-3 relevant hashtags.' : ''}
${d.platform === 'instagram'  ? 'Use vivid language, 3-5 relevant emoji, and 5-8 hashtags at the end.' : ''}
Output only the post text — nothing else.`,

    summary: `Write a structured summary.
Format:
**Overview:** [1-2 sentence overview]

**Key Points:**
- [point 1]
- [point 2]
- [point 3]
- [point 4]
- [point 5]

**Bottom Line:** [1 sentence takeaway]`,

    business_plan: `Write a comprehensive business plan.
Use these sections with ## headings:
Executive Summary, Problem Statement, Our Solution, Target Market,
Revenue Model, Competitive Advantage, Key Metrics & Milestones, Next Steps.
Be specific and actionable — no generic content.`,

    other: `Write the requested content completely and professionally.`,
  };

  const instruction = typeMap[d.goalType] ?? typeMap.other;

  return `You are a world-class professional writer with expertise across business communication, content strategy, and persuasion.

TASK: ${instruction}

PURPOSE: ${d.purpose}
TONE: ${tone} (tone score: ${d.tone}/100)
${d.audience         ? `TARGET AUDIENCE: ${d.audience}` : ''}
${d.additionalContext ? `SPECIFIC CONTEXT: ${d.additionalContext}` : ''}
${d.includeCTA        ? 'END WITH: A compelling, specific call-to-action (not generic).' : ''}
LENGTH: ${length}

${RULES}

Write now:`;
}

// ─── TWEAK PROMPT ─────────────────────────────────────────────────────────────

export type TweakType = 'shorter' | 'longer' | 'more_formal' | 'more_casual' | 'add_urgency' | 'simpler' | 'change_tone';

export function buildTweakPrompt(original: string, tweak: TweakType, newTone?: number): string {
  const instructions: Record<TweakType, string> = {
    shorter:      'Rewrite this to be 40% shorter. Keep every key point. Cut fluff, repetition, and unnecessary words.',
    longer:       'Expand this by 50%. Add specific details, supporting points, and richer examples. Keep the same structure and tone.',
    more_formal:  'Rewrite this in a strictly formal, corporate tone. Use professional vocabulary. Remove any casual language.',
    more_casual:  'Rewrite this to sound friendly, warm and conversational. Like a real human wrote it for a friend.',
    add_urgency:  'Rewrite this with urgency and momentum. Add time-sensitive language, strong verbs, and a compelling reason to act now.',
    simpler:      'Rewrite this in plain English. No jargon, no complex sentences. A 16-year-old should understand it instantly.',
    change_tone:  newTone !== undefined
      ? `Rewrite this with a ${toneLabel(newTone)} tone (score: ${newTone}/100). Adjust vocabulary, sentence structure, and warmth accordingly.`
      : 'Rewrite this with a more balanced, approachable tone.',
  };

  return `You are an expert editor. Apply this specific revision to the content below.

REVISION: ${instructions[tweak]}

ORIGINAL CONTENT:
---
${original}
---

${RULES}
Output ONLY the revised content. Begin now:`;
}

// ─── 6 TOOL PROMPTS ──────────────────────────────────────────────────────────

export interface ToolInput {
  toolId: string;
  fields: Record<string, string>;
}

export function buildToolPrompt(input: ToolInput): string {
  const { toolId, fields } = input;

  const tools: Record<string, string> = {

    email: `You are an expert career coach and professional writer.
Write a compelling, personalised cover letter for this candidate.

Job Title: ${fields.jobTitle || 'Not specified'}
Company: ${fields.company || 'Not specified'}
Key Strengths: ${fields.keyStrengths || 'Not specified'}
Additional Context: ${fields.additionalContext || 'None'}

Format:
[Today's date]

Hiring Manager,
[Company Name]

Dear Hiring Manager,

[3 strong paragraphs: 1) Opening hook + role interest, 2) Key strengths with specifics, 3) Why this company + confident close]

Sincerely,
[Candidate Name]

${RULES}
Make it specific to the company and role — not generic. Write now:`,

    summary: `You are an expert analyst and summariser.
${fields.content
  ? `Summarise the following content:\n\n"${fields.content.substring(0, 8000)}"`
  : `Summarise a ${fields.documentType || 'business'} document about: ${fields.topic || fields.subject || 'the specified topic'}`
}

Output format:
**📋 EXECUTIVE SUMMARY**
[2-3 sentence overview]

**🔑 KEY POINTS**
- [Point 1 with specific detail]
- [Point 2 with specific detail]
- [Point 3 with specific detail]
- [Point 4 with specific detail]
- [Point 5 with specific detail]

**📊 MAIN THEMES**
[2-3 overarching themes identified]

**⚡ BOTTOM LINE**
[Single most important takeaway]

${RULES}
Write now:`,

    social: `You are a world-class social media strategist.
Create a complete 7-day social media content plan.

Brand/Topic: ${fields.topic || fields.brand || 'Not specified'}
Target Audience: ${fields.audience || 'General audience'}
Platform: ${fields.platform || 'LinkedIn and Instagram'}
Goal: ${fields.goal || 'Grow audience and engagement'}
Tone: ${fields.tone || 'Professional but engaging'}

For each day, provide:
**Day [N] — [Day Name]**
📌 Theme: [content theme]
📝 Post: [complete post text ready to publish]
🏷️ Tags: [3-5 relevant hashtags]
⏰ Best time to post: [specific time]

Create all 7 days. Make each post unique, engaging, and genuinely valuable.
${RULES}
Write now:`,

    business: `You are a senior business consultant and proposal writer.
Write a comprehensive, professional client proposal.

Project Scope: ${fields.projectScope || fields.scope || 'Not specified'}
Client Name/Company: ${fields.clientName || fields.client || 'The Client'}
Pricing/Budget: ${fields.pricing || fields.budget || 'To be discussed'}
Timeline: ${fields.timeline || 'To be agreed'}
Key Deliverables: ${fields.deliverables || 'As discussed'}
Additional Context: ${fields.additionalContext || 'None'}

Sections (use ## headings):
## Executive Summary
## The Challenge We're Solving
## Our Proposed Solution
## Project Scope & Deliverables
## Timeline & Milestones
## Investment
## Why Us
## Next Steps

Make it persuasive, specific, and client-focused. No generic filler.
${RULES}
Write now:`,

    analysis: `You are a senior data analyst.
${fields.csvContent
  ? `Analyse this dataset:\n\n${fields.csvContent.substring(0, 10000)}`
  : `Provide a data analysis framework for: ${fields.dataType || fields.topic || 'business data'}`
}

Output format:
**📊 DATASET OVERVIEW**
[What this data represents, dimensions, key variables]

**📈 KEY STATISTICS**
[Most important numbers and what they mean]

**🔍 TRENDS & PATTERNS**
[Clear patterns identified with specific evidence]

**⚠️ ANOMALIES & OUTLIERS**
[Anything unusual worth investigating]

**💡 INSIGHTS**
[3-5 non-obvious insights derived from the data]

**✅ RECOMMENDATIONS**
1. [Specific, actionable recommendation with rationale]
2. [Specific, actionable recommendation with rationale]
3. [Specific, actionable recommendation with rationale]
4. [Specific, actionable recommendation with rationale]
5. [Specific, actionable recommendation with rationale]

Be specific — reference actual data values. No generic statements.
${RULES}
Write now:`,

    planning: `You are a McKinsey-level business strategist.
Create a comprehensive business plan.

Industry: ${fields.industry || 'Not specified'}
Value Proposition: ${fields.valueProposition || fields.proposition || 'Not specified'}
Target Market: ${fields.targetMarket || fields.market || 'Not specified'}
Stage: ${fields.stage || 'Early startup'}
Additional Context: ${fields.additionalContext || 'None'}

Sections (use ## headings):
## Executive Summary
## Problem Statement
## Our Solution
## Target Market & Customer Profile
## Revenue Model & Pricing Strategy
## Competitive Landscape
## Go-To-Market Strategy
## Operations Plan
## Financial Projections (Year 1-3)
## Key Risks & Mitigation
## Milestones & Next Steps

Be specific to this industry and proposition. No generic startup advice.
${RULES}
Write now:`,
  };

  const prompt = tools[toolId];
  if (!prompt) throw new Error(`Unknown tool: ${toolId}`);
  return prompt;
}

// ─── FILE ANALYSIS PROMPT ─────────────────────────────────────────────────────

export interface FileAnalysisInput {
  filename: string;
  fileType: string;
  content: string;
  analysisType: string;
}

export function buildFilePrompt(input: FileAnalysisInput): string {
  const { filename, fileType, content, analysisType } = input;

  const analyses: Record<string, string> = {
    summarize: `Provide a comprehensive summary of this ${fileType} document.
Format with ## headings: Overview, Key Points (bullets), Main Themes, Bottom Line.`,

    extract_actions: `Extract every action item, task, and next step from this document.
Format as numbered list. Include: action, owner (if mentioned), deadline (if mentioned).
Group by: Immediate Actions, Short-term (1-4 weeks), Long-term (1+ month).`,

    rewrite: `Rewrite this document to be significantly clearer, more concise, and more professional.
Keep all key information. Improve structure, eliminate jargon, strengthen language.
Maintain same format and section order.`,

    questions: `Generate 10 sharp, insightful questions about this document.
Mix of: clarifying questions, strategic questions, challenge questions, and action questions.
Number each. Make them specific to the actual content — not generic.`,

    data_insights: `Analyse this data comprehensively.
Sections: Overview, Key Statistics, Trends, Anomalies, Insights, Recommendations (5 specific).
Reference actual numbers from the data. No generic statements.`,
  };

  const instruction = analyses[analysisType] || analyses.summarize;

  return `You are an expert document analyst.

FILE: ${filename} (${fileType})
TASK: ${instruction}

DOCUMENT CONTENT:
---
${content.substring(0, 14000)}
${content.length > 14000 ? '\n[Content trimmed to 14,000 characters]' : ''}
---

${RULES}
Reference specific content from the document. Begin analysis now:`;
}
