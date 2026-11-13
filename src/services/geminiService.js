import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Dynamically generate a brand new coding question using Gemini
 */
export async function generateCustomQuestion({
  apiKey,
  topic = 'Arrays & Hashing',
  difficulty = 'Medium',
  companyTarget = 'Google / Big Tech'
}) {
  if (!apiKey) {
    return generateFallbackCustomQuestion(topic, difficulty, companyTarget);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
      systemInstruction: `You are a Principal Engineering Bar Raiser who writes authentic coding interview problems for ${companyTarget}.
Output a single strict JSON object matching this schema:
{
  "id": "gen-" + random string,
  "title": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "topic": string,
  "prompt": string (complete problem statement with constraints and examples),
  "starterCode": string (valid JavaScript function template),
  "expectedComplexity": string (e.g. "Time: O(n), Space: O(1)"),
  "testCases": [
    { "args": any[], "expected": any },
    { "args": any[], "expected": any }
  ],
  "hrFollowUp": string
}`
    });

    const prompt = `Generate a realistic campus placement coding problem:
Topic: ${topic}
Difficulty: ${difficulty}
Target Company Style: ${companyTarget}

Generate problem JSON now:`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.warn('Failed to dynamically generate question via Gemini, using fallback:', err);
    return generateFallbackCustomQuestion(topic, difficulty, companyTarget);
  }
}

/**
 * Conduct a realistic, spoken Socratic interview turn
 */
export async function conductInterviewTurn({
  apiKey,
  transcript,
  candidateSpeech,
  candidateCode,
  currentQuestion,
  companyTrack,
  role,
  interviewStage = 'Technical Implementation'
}) {
  if (!apiKey) {
    return simulateInterviewerResponse(candidateSpeech, candidateCode, currentQuestion);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are a real, professional Senior Staff Engineer conducting a live technical interview for ${role} at ${companyTrack}. Current interview stage: ${interviewStage}.
Tone: Calm, professional, rigorous, and direct (like a real Google or Amazon bar raiser).
Rules:
- Respond in 2-3 spoken sentences.
- Never be sycophantic. Don't say "Great job!" or "Wonderful answer!". Instead, objectively acknowledge the logic and probe deeper.
- Challenge edge cases, boundary conditions, or unstated time/space trade-offs.
- If code is written on the canvas, refer to specific lines or data structures.`
    });

    const prompt = `Question: ${currentQuestion.title}
Problem: ${currentQuestion.prompt}
Current Candidate Code:
\`\`\`javascript
${candidateCode || '// No code written'}
\`\`\`

Recent Transcript:
${transcript.slice(-4).map(t => `${t.sender}: ${t.text}`).join('\n')}

Candidate said:
"${candidateSpeech}"

Give your direct spoken response as the interviewer:`;

    const result = await model.generateContent(prompt);
    return {
      interviewerSpeech: result.response.text().trim(),
      status: 'active'
    };
  } catch (err) {
    console.warn('Gemini call failed, using simulation:', err);
    return simulateInterviewerResponse(candidateSpeech, candidateCode, currentQuestion);
  }
}

/**
 * 360° Diagnostic Scorecard
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
      generationConfig: { responseMimeType: 'application/json' },
      systemInstruction: `You are an executive Bar Raiser evaluating a candidate for ${role} at ${companyTrack}.
Output a strict JSON report:
{
  "overallScore": number (0-100),
  "hiringDecision": "Strong Hire" | "Hire" | "Leaning Hire" | "Needs More Practice",
  "breakdown": {
    "conceptualAccuracy": number,
    "codeOptimization": number,
    "communicationClarity": number,
    "stressComposure": number
  },
  "strengths": string[],
  "criticalWeaknesses": string[],
  "fillerWordAnalysis": string,
  "sevenDayPlan": [
    { "day": number, "focus": string, "tasks": string[] }
  ]
}`
    });

    const prompt = `Evaluate interview:
Track: ${companyTrack}
Role: ${role}
Question: ${currentQuestion.title}
Code:
\`\`\`javascript
${candidateCode}
\`\`\`
Telemetry: Fillers: ${telemetry.fillerWords}, WPM: ${telemetry.wpm || 130}, Duration: ${telemetry.durationSeconds}s
Transcript:
${transcript.map(t => `${t.sender}: ${t.text}`).join('\n')}`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    return simulateScorecard(candidateCode, telemetry, currentQuestion);
  }
}

// Fallback Generators
function generateFallbackCustomQuestion(topic, difficulty, companyTarget) {
  return {
    id: 'gen-' + Date.now(),
    title: 'Validate Binary Search Tree Logic',
    difficulty: difficulty || 'Medium',
    topic: topic || 'Trees & Recursion',
    prompt: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined such that the left subtree contains only nodes with keys strictly less than the node key, and the right subtree contains only keys strictly greater. Explain how you enforce range boundaries (min/max) recursively.',
    starterCode: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
      return false;
    }
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
    expectedComplexity: 'Time: O(N), Space: O(H) where H is tree height',
    testCases: [
      { args: [[2,1,3]], expected: true },
      { args: [[5,1,4,null,null,3,6]], expected: false }
    ],
    hrFollowUp: 'Tell me about a time you optimized a slow database query or backend algorithm in a past project.'
  };
}

function simulateInterviewerResponse(candidateSpeech, candidateCode, currentQuestion) {
  const speechLower = (candidateSpeech || '').toLowerCase();
  
  if (speechLower.includes('brute') || speechLower.includes('o(n^2)') || speechLower.includes('nested')) {
    return {
      interviewerSpeech: "Starting with brute force is fine for a baseline, but quadratic time won't scale. What auxiliary data structure can give you constant-time lookups to bring this to O(N)?",
      status: 'active'
    };
  }

  if (speechLower.includes('hash') || speechLower.includes('map') || speechLower.includes('o(n)')) {
    return {
      interviewerSpeech: "A hash map is the right direction. How are you handling edge cases where duplicate values exist in the input or when the array has fewer than two elements?",
      status: 'active'
    };
  }

  if (speechLower.includes('done') || speechLower.includes('finish') || speechLower.includes('submitted')) {
    return {
      interviewerSpeech: "Your implementation looks solid. Walk me through the exact space complexity of your auxiliary map, and explain how garbage collection handles this in production.",
      status: 'active'
    };
  }

  return {
    interviewerSpeech: `Understood. Walk me through your pointer movement step-by-step as you update the code on canvas. What is your base terminating condition?`,
    status: 'active'
  };
}

function simulateScorecard(candidateCode, telemetry, currentQuestion) {
  const codeLines = (candidateCode || '').split('\n').filter(l => l.trim().length > 0).length;
  const baseScore = Math.min(90, Math.max(68, 72 + codeLines * 1.4 - telemetry.fillerWords * 1.5));

  return {
    overallScore: Math.round(baseScore),
    hiringDecision: baseScore >= 82 ? "Hire" : "Leaning Hire",
    breakdown: {
      conceptualAccuracy: Math.min(96, Math.round(baseScore + 4)),
      codeOptimization: Math.min(92, Math.round(baseScore - 2)),
      communicationClarity: Math.max(65, Math.round(86 - telemetry.fillerWords * 2.5)),
      stressComposure: Math.round(baseScore + 2)
    },
    strengths: [
      "Demonstrated sound intuition identifying the O(N) hash-based lookup pattern.",
      "Clear articulation of variable names and boundary logic.",
      "Maintained professional composure and steady cadence."
    ],
    criticalWeaknesses: [
      `Recorded ${telemetry.fillerWords} verbal hesitation fillers ("um", "like", "basically").`,
      "Could have stated the space-time trade-off earlier before jumping into code implementation.",
      "Needs more practice verbalizing memory deallocation trade-offs."
    ],
    fillerWordAnalysis: `Detected ${telemetry.fillerWords} filler words. Pausing silently for 1–2 seconds instead of vocalizing fillers significantly strengthens executive technical presence.`,
    sevenDayPlan: [
      { day: 1, focus: "Oral Big-O Articulation", tasks: ["Verbally explain worst-case time/space complexity for 5 array problems without writing code."] },
      { day: 2, focus: "Boundary & Null Checks", tasks: ["Practice orally stating boundary edge cases (empty array, null, single element) before writing code."] },
      { day: 3, focus: "Filler Reduction Drills", tasks: ["Record a 3-minute explanation replacing filler words with deliberate silent breaths."] },
      { day: 4, focus: "Two-Pointer & Sliding Window", tasks: ["Implement and verbally defend 3 sliding window questions in under 15 minutes each."] },
      { day: 5, focus: "Data Structure Trade-Offs", tasks: ["Practice comparing Map vs Array vs Set lookups under stress."] },
      { day: 6, focus: "STAR Behavioral Structure", tasks: ["Structure 3 technical project stories using Situation-Task-Action-Result format."] },
      { day: 7, focus: "Full 30-Minute Mock Drive", tasks: ["Complete a timed end-to-end mock interview on PlacementPilot AI."] }
    ]
  };
}
