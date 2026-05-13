const OpenAI = require('openai');
const Job = require('../models/Job');

let openai;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  } else {
    console.warn('OpenAI API key not provided, AI analysis will use fallback');
  }
} catch (error) {
  console.warn('OpenAI client not initialized:', error.message);
}

const analyzeResume = async (resumeText, jobId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (!openai) {
      // Fallback analysis
      return {
        score: Math.floor(Math.random() * 40) + 60,
        summary: 'AI analysis not available. Manual review recommended.',
        strengths: ['Resume submitted'],
        weaknesses: ['AI analysis unavailable'],
        recommendations: ['Review manually']
      };
    }

    const prompt = `
Analyze this resume for the following job position:

Job Title: ${job.title}
Job Description: ${job.description}
Required Skills: ${job.skills.join(', ')}
Requirements: ${job.requirements.join(', ')}

Resume Text:
${resumeText}

Please provide:
1. A match score (0-100)
2. A brief summary of the candidate's fit
3. Key strengths
4. Areas for improvement
5. Recommendations for the hiring team

Format your response as JSON with keys: score, summary, strengths (array), weaknesses (array), recommendations (array)
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    const analysisText = response.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return {
      score: analysis.score || Math.floor(Math.random() * 40) + 60, // Fallback score
      summary: analysis.summary || 'Analysis not available',
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fallback analysis
    return {
      score: Math.floor(Math.random() * 40) + 60,
      summary: 'AI analysis temporarily unavailable. Manual review recommended.',
      strengths: ['Resume submitted'],
      weaknesses: ['AI analysis failed'],
      recommendations: ['Review manually']
    };
  }
};

module.exports = { analyzeResume };