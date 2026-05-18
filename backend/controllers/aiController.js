const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSubtasks = async (req, res) => {
  try {
    console.log('AI Generation request:', { taskTitle: req.body.taskTitle, taskDescription: req.body.taskDescription });
    console.log('User from auth middleware:', req.user);
    
    const { taskTitle, taskDescription } = req.body;

    if (!taskTitle) {
      console.log('Missing task title');
      return res.status(400).json({ message: 'Task title is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Break down the following task into smaller, actionable subtasks. 
    Task: ${taskTitle}
    ${taskDescription ? `Description: ${taskDescription}` : ''}
    
    Please provide 3-7 subtasks that are:
    - Specific and actionable
    - Ordered logically
    - Each subtask should be concise (under 50 words)
    
    You must respond ONLY with a valid JSON array of strings.
    Example: ["Research topic", "Create outline", "Write first draft", "Review and edit"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response text:', text);

    let subtasks;
    try {
      // Find JSON block in markdown
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        subtasks = JSON.parse(jsonMatch[0]);
      } else {
        subtasks = JSON.parse(text);
      }
      
      if (!Array.isArray(subtasks)) {
        subtasks = Object.values(subtasks);
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      // Fallback manual parsing if JSON still fails
      subtasks = text.replace(/```(?:json)?/g, '').split('\n')
        .map(line => line.replace(/^[[\]",\s]+/, '').replace(/[[\]",\s]+$/, '').trim())
        .filter(line => line.length > 0);
    }

    if (!subtasks || subtasks.length === 0) {
      subtasks = [
        `Analyze the requirements for: ${taskTitle}`,
        'Break down into smaller steps',
        'Execute the first step',
        'Review progress'
      ];
    }

    console.log('Generated subtasks:', subtasks);
    
    res.status(200).json({
      message: 'Subtasks generated successfully',
      subtasks
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    console.error('Error message:', error.message);
    
    const fallbackSubtasks = [
      `Failed to generate AI subtasks for: ${req.body.taskTitle}`,
      `Error details: ${error.message || 'Unknown error'}`,
      'Please check backend logs or API keys'
    ];

    console.log('Using fallback subtasks:', fallbackSubtasks);

    res.status(200).json({
      message: 'Subtasks generated with fallback method',
      subtasks: fallbackSubtasks
    });
  }
};

module.exports = {
  generateSubtasks
};
