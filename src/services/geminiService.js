import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Conduct a single turn of the interactive interview.
 * Evaluates candidate speech + live code editor contents.
 */
export async function conductInterviewTurn({
  apiKey,
  transcript,
  candidateSpeech,
  candidateCode,
  currentQuestion,
  companyTrack,
  role
}) {
  if (!apiKey) {
    return simulateInterviewerResponse(candidateSpeech, candidateCode, currentQuestion);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are an elite, professional Technical Interviewer and Hiring Manager conducting a live campus placement interview for the role of ${role} at a company in the ${companyTrack} tier.
Your goal is to evaluate the candidate's spoken conceptual clarity, algorithmic problem-solving, and communication composure.
Guidelines:
- Keep your verbal responses concise, realistic, and conversational (2-4 sentences max), as they will be spoken aloud to the student.
- Acknowledge what the student said or wrote in their code.
- If their explanation lacks time/space complexity, challenge them on it.
- If their code has a logical bug or missing edge case (e.g. empty inputs, null pointers, negative values), gently probe them with a Socratic question.
- Do NOT give away the complete solution immediately; push them to think aloud.`
    });

    const prompt = `Current Question: ${currentQuestion.title}
Problem Description: ${currentQuestion.prompt}
Candidate's Current Code on Canvas:
\`\`\`
${candidateCode || '// No code written yet'}
\`\`\`

Recent Transcript History:
${transcript.slice(-4).map(t => `${t.sender}: ${t.text}`).join('\n')}

The candidate just verbally said:
"${candidateSpeech}"

Respond as the interviewer now in 2-4 spoken sentences:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return {
      interviewerSpeech: responseText,
      status: 'active'
    };
  } catch (error) {
    console.warn('Gemini API call failed, falling back to simulation:', error);
    return simulateInterviewerResponse(candidateSpeech, candidateCode, currentQuestion);
  }
}

/**
 * Generate comprehensive 360° diagnostic scorecard.
 */
export async function generateDiagnosticScorecard({
  apiKey,
  transcript,
  candidateCode,
  currentQuestion,
  companyTrack,
  role,
  telemetry
}) {
  if (!apiKey) {
    return simulateScorecard(candidateCode, telemetry, currentQuestion);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      },
      systemInstruction: `You are an expert Technical Recruitment Evaluator and Bar Raiser for campus placements.
Analyze the complete interview transcript, written code, and speech telemetry.
Output a strict JSON object with this exact schema:
{
  "overallScore": number (0-100),
  "hiringDecision": "Strong Hire" | "Hire" | "Leaning Hire" | "Needs More Practice",
  "breakdown": {
    "conceptualAccuracy": number (0-100),
    "codeOptimization": number (0-100),
    "communicationClarity": number (0-100),
    "stressComposure": number (0-100)
  },
  "strengths": string[],
  "criticalWeaknesses": string[],
  "fillerWordAnalysis": string,
  "sevenDayPlan": [
    { "day": number, "focus": string, "tasks": string[] }
  ]
}`
    });

    const prompt = `Evaluate this candidate interview:
Track: ${companyTrack}
Role: ${role}
Question: ${currentQuestion.title} - ${currentQuestion.prompt}
Final Submitted Code:
\`\`\`
${candidateCode}
\`\`\`
Telemetry:
- Filler Words Count: ${telemetry.fillerWords}
- Total Speaking Turns: ${telemetry.totalTurns}
- Total Duration: ${telemetry.durationSeconds} seconds
- Average Speech Pacing: ${telemetry.wpm || 135} Words Per Minute

Transcript of the Interview:
${transcript.map(t => `${t.sender}: ${t.text}`).join('\n')}

Generate the complete diagnostic evaluation JSON now:`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return parsed;
  } catch (error) {
    console.warn('Scorecard generation error, falling back to simulated scorecard:', error);
    return simulateScorecard(candidateCode, telemetry, currentQuestion);
  }
}

/**
 * Intelligent local simulation fallback for instant demo testing
 */
function simulateInterviewerResponse(candidateSpeech, candidateCode, currentQuestion) {
  const speechLower = (candidateSpeech || '').toLowerCase();
  
  if (speechLower.includes('brute') || speechLower.includes('o(n^2)') || speechLower.includes('nested')) {
    return {
      interviewerSpeech: "That's a valid brute-force intuition to start with. However, with an array of 100,000 elements, quadratic time will time out. How can you leverage a hash map or pointers to bring this down to linear time?",
      status: 'active'
    };
  }

  if (speechLower.includes('hash') || speechLower.includes('map') || speechLower.includes('o(n)')) {
    return {
      interviewerSpeech: "Good optimization. Now look at line 6 of your code—what happens if the target complement is identical to the current number itself, or if duplicate elements appear? Walk me through how you prevent reusing the same index.",
      status: 'active'
    };
  }

  if (speechLower.includes('done') || speechLower.includes('finish') || speechLower.includes('completed')) {
    return {
      interviewerSpeech: "Excellent job walking through that logic. Your algorithmic trade-offs are sound. Before we conclude, tell me: what is the worst-case space complexity of your auxiliary data structure?",
      status: 'active'
    };
  }

  return {
    interviewerSpeech: `I see where you're heading with that thought. Can you explain your reasoning out loud as you update the code on canvas? Specifically, how are you handling the base edge cases?`,
    status: 'active'
  };
}

function simulateScorecard(candidateCode, telemetry, currentQuestion) {
  const codeLines = (candidateCode || '').split('\n').filter(l => l.trim().length > 0).length;
  const baseScore = Math.min(88, Math.max(68, 70 + codeLines * 1.5 - telemetry.fillerWords * 2));

  return {
    overallScore: Math.round(baseScore),
    hiringDecision: baseScore >= 80 ? "Hire" : "Leaning Hire",
    breakdown: {
      conceptualAccuracy: Math.min(95, Math.round(baseScore + 4)),
      codeOptimization: Math.min(90, Math.round(baseScore - 2)),
      communicationClarity: Math.max(60, Math.round(85 - telemetry.fillerWords * 3)),
      stressComposure: Math.round(baseScore + 1)
    },
    strengths: [
      "Demonstrated good intuition for moving from brute-force to linear time lookup.",
      "Clear articulation of data structure selection (Hash Map / Set).",
      "Maintained professional composure and steady speaking cadence."
    ],
    criticalWeaknesses: [
      `Detected ${telemetry.fillerWords} verbal filler words ("um", "like", "basically") when navigating edge-case questions.`,
      "Could have explicitly stated time and space complexity upfront before typing code.",
      "Needs more practice on verbalizing pointer/iterator safety in high-stress interview rounds."
    ],
    fillerWordAnalysis: `You used approximately ${telemetry.fillerWords} filler words during the session. Replacing filler pauses with silent 2-second thinking breaks will immediately elevate your perceived executive presence by 30%.`,
    sevenDayPlan: [
      { day: 1, focus: "Verbal Complexity Analysis", tasks: ["Practice orally stating Big-O notation for 5 LeetCode problems without typing code."] },
      { day: 2, focus: "Edge Case Articulation", tasks: ["Record a 2-minute video explaining empty array and negative number boundary conditions."] },
      { day: 3, focus: "Pacing & Filler Elimination", tasks: ["Do a mock session replacing 'um' with a 1.5-second silent breath."] },
      { day: 4, focus: "Two-Pointer Mastery", tasks: ["Code and orally defend 3 sliding window questions in under 15 minutes each."] },
      { day: 5, focus: "System Design & Whiteboarding", tasks: ["Sketch a URL shortener or rate limiter on a blank canvas while speaking continuously."] },
      { day: 6, focus: "STAR Behavioral Preparation", tasks: ["Draft 3 stories answering 'Tell me about a technical disagreement' using the Situation-Task-Action-Result format."] },
      { day: 7, focus: "Full Placement Simulation", tasks: ["Complete a timed 30-minute mock interview on PlacementPilot AI under mass recruiter mode."] }
    ]
  };
}
