import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const questions = [
  // Behavioral Questions (30)
  {
    question: "Tell me about a time when you had to deal with a difficult team member. How did you handle it?",
    category: "behavioral",
    difficulty: "medium",
    sample_answer: "In my previous role, I worked with a colleague who consistently missed deadlines. I scheduled a private conversation to understand their challenges. They were overwhelmed with personal issues. We created a plan to redistribute tasks and set up check-ins. This improved their performance and our relationship.",
    tips: ["Use the STAR method", "Focus on your actions, not just the problem", "Show empathy and problem-solving skills"]
  },
  {
    question: "Describe a situation where you had to meet a tight deadline. How did you manage it?",
    category: "behavioral",
    difficulty: "easy",
    sample_answer: "During a product launch, we had only two weeks instead of four. I prioritized tasks using the MoSCoW method, delegated effectively, and increased communication frequency. We delivered on time by focusing on must-haves and deferring nice-to-haves.",
    tips: ["Explain your prioritization process", "Mention time management techniques", "Highlight successful outcome"]
  },
  {
    question: "Tell me about a time you failed. What did you learn from it?",
    category: "behavioral",
    difficulty: "hard",
    sample_answer: "I once launched a feature without proper user testing. Users found it confusing, leading to low adoption. I learned the importance of user research and now always include testing phases. This failure made me a stronger advocate for user-centered design.",
    tips: ["Choose a real failure, not a humble brag", "Focus on lessons learned", "Show growth and changed behavior"]
  },
  {
    question: "Describe a time when you had to convince someone to see things your way.",
    category: "behavioral",
    difficulty: "medium",
    sample_answer: "I proposed migrating to a new tech stack, but my manager was hesitant. I gathered data on performance improvements, cost savings, and presented a phased migration plan with minimal risk. After showing ROI calculations, they approved the initiative.",
    tips: ["Show data-driven approach", "Demonstrate empathy for their concerns", "Explain your persuasion strategy"]
  },
  {
    question: "Tell me about a time you had to work with limited resources.",
    category: "behavioral",
    difficulty: "medium",
    sample_answer: "Our team budget was cut by 30%, but we still needed to deliver. I identified open-source alternatives, automated repetitive tasks, and negotiated with vendors. We delivered the project under budget while maintaining quality.",
    tips: ["Highlight creativity and resourcefulness", "Show problem-solving skills", "Mention positive outcome"]
  },
  {
    question: "Describe a situation where you had to adapt to significant changes.",
    category: "behavioral",
    difficulty: "easy",
    sample_answer: "Our company switched to remote work overnight. I quickly set up home office infrastructure, learned new collaboration tools, and established daily standups to maintain team cohesion. Within two weeks, our productivity was back to normal.",
    tips: ["Show flexibility and learning agility", "Mention specific actions taken", "Highlight positive results"]
  },
  {
    question: "Tell me about a time you took initiative without being asked.",
    category: "behavioral",
    difficulty: "medium",
    sample_answer: "I noticed our onboarding process was inefficient. Without being asked, I created a comprehensive guide, recorded video tutorials, and built a checklist. New hires now get up to speed 40% faster.",
    tips: ["Show proactivity and ownership", "Quantify the impact if possible", "Explain your motivation"]
  },
  {
    question: "Describe a conflict you had with a coworker and how you resolved it.",
    category: "behavioral",
    difficulty: "hard",
    sample_answer: "A designer and I disagreed on implementation. I scheduled a meeting to understand their perspective, explained technical constraints, and we compromised on a solution that met both design and technical requirements.",
    tips: ["Show emotional intelligence", "Focus on resolution, not blame", "Demonstrate collaboration skills"]
  },
  {
    question: "Tell me about a time you received criticism. How did you respond?",
    category: "behavioral",
    difficulty: "medium",
    sample_answer: "My code review feedback indicated my code lacked comments. Initially defensive, I realized they were right. I started documenting thoroughly and even created a team documentation standard. This improved our code maintainability significantly.",
    tips: ["Show you can accept feedback", "Demonstrate growth mindset", "Explain positive changes made"]
  },
  {
    question: "Describe a situation where you had to learn something new quickly.",
    category: "behavioral",
    difficulty: "easy",
    sample_answer: "I was assigned to a Python project despite having no Python experience. I took an intensive online course, pair-programmed with teammates, and contributed my first feature within a week. I'm now proficient in Python.",
    tips: ["Show learning agility", "Mention resources used", "Highlight successful outcome"]
  },

  // Technical Questions (25)
  {
    question: "Explain the difference between == and === in JavaScript.",
    category: "technical",
    difficulty: "easy",
    sample_answer: "== performs type coercion before comparison, while === checks both value and type without coercion. For example, 5 == '5' is true, but 5 === '5' is false. It's generally better to use === for more predictable behavior.",
    tips: ["Give concrete examples", "Explain the implications", "Mention best practices"]
  },
  {
    question: "What is the difference between SQL and NoSQL databases?",
    category: "technical",
    difficulty: "medium",
    sample_answer: "SQL databases are relational, use structured schemas, and support ACID transactions (like PostgreSQL). NoSQL databases are non-relational, schema-flexible, and optimized for specific use cases like document storage (MongoDB) or key-value pairs (Redis).",
    tips: ["Compare key characteristics", "Give examples of each", "Mention use cases"]
  },
  {
    question: "Explain what RESTful APIs are.",
    category: "technical",
    difficulty: "easy",
    sample_answer: "REST (Representational State Transfer) is an architectural style for web services. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources identified by URLs. They're stateless and return data in formats like JSON.",
    tips: ["Mention HTTP methods", "Explain statelessness", "Give examples"]
  },
  {
    question: "What is the difference between process and thread?",
    category: "technical",
    difficulty: "medium",
    sample_answer: "A process is an independent program in execution with its own memory space. A thread is a lightweight unit within a process that shares memory. Multiple threads can run concurrently within a process, making them more efficient for parallel tasks.",
    tips: ["Explain resource usage", "Mention concurrency", "Give real-world examples"]
  },
  {
    question: "What is a closure in JavaScript?",
    category: "technical",
    difficulty: "medium",
    sample_answer: "A closure is a function that has access to variables in its outer scope, even after the outer function has returned. It's created when a nested function references variables from its parent. Closures are useful for data privacy and creating function factories.",
    tips: ["Provide a code example", "Explain practical uses", "Mention scope"]
  },
  {
    question: "Explain the concept of Big O notation.",
    category: "technical",
    difficulty: "medium",
    sample_answer: "Big O describes the upper bound of algorithm complexity as input size grows. O(1) is constant time, O(n) is linear, O(n²) is quadratic. It helps us understand performance and scalability. For example, binary search is O(log n), much better than linear search at O(n).",
    tips: ["Give examples of different complexities", "Explain practical implications", "Compare algorithms"]
  },
  {
    question: "What is the difference between synchronous and asynchronous programming?",
    category: "technical",
    difficulty: "easy",
    sample_answer: "Synchronous code executes sequentially, blocking until each operation completes. Asynchronous code allows operations to run concurrently without blocking. In JavaScript, we use callbacks, Promises, or async/await for async operations like API calls.",
    tips: ["Explain blocking vs non-blocking", "Give examples", "Mention when to use each"]
  },
  {
    question: "Explain what Docker is and why it's useful.",
    category: "technical",
    difficulty: "medium",
    sample_answer: "Docker is a containerization platform that packages applications with their dependencies into isolated containers. It ensures consistency across environments, simplifies deployment, and enables microservices architecture. Containers are lighter than VMs and start faster.",
    tips: ["Explain containers vs VMs", "Mention benefits", "Give use cases"]
  },
  {
    question: "What is version control and why is it important?",
    category: "technical",
    difficulty: "easy",
    sample_answer: "Version control systems like Git track changes to code over time. They enable collaboration, allow reverting to previous versions, and help manage different development branches. It's essential for team coordination and code history.",
    tips: ["Mention specific systems (Git)", "Explain key features", "Highlight collaboration benefits"]
  },
  {
    question: "Explain the concept of microservices architecture.",
    category: "technical",
    difficulty: "hard",
    sample_answer: "Microservices break applications into small, independent services that communicate via APIs. Each service handles a specific business capability and can be deployed independently. This enables scalability, technology diversity, and faster development, but adds complexity in orchestration.",
    tips: ["Compare to monolithic architecture", "Explain benefits and challenges", "Give examples"]
  },

  // Problem-Solving Questions (20)
  {
    question: "How would you design a URL shortener like bit.ly?",
    category: "problem_solving",
    difficulty: "hard",
    sample_answer: "I'd use a hash function or base62 encoding to generate short codes from URLs. Store mappings in a database with the short code as key. For scale, implement caching with Redis, use a load balancer, and consider distributed databases. Handle collisions with checks before insertion.",
    tips: ["Think out loud", "Consider scale and edge cases", "Mention technologies"]
  },
  {
    question: "You have a slow-loading webpage. How would you debug and optimize it?",
    category: "problem_solving",
    difficulty: "medium",
    sample_answer: "First, I'd use browser DevTools to identify bottlenecks - check Network tab for large files, Performance tab for rendering issues. Common solutions include image optimization, code splitting, lazy loading, CDN usage, and minimizing JavaScript. I'd measure improvements with Lighthouse.",
    tips: ["Show systematic approach", "Mention specific tools", "Prioritize high-impact changes"]
  },
  {
    question: "How would you detect a loop in a linked list?",
    category: "problem_solving",
    difficulty: "medium",
    sample_answer: "Use Floyd's cycle detection (tortoise and hare algorithm): maintain two pointers, one moving one step at a time, the other two steps. If there's a loop, they'll eventually meet. This is O(n) time and O(1) space. Alternative: use a HashSet to track visited nodes.",
    tips: ["Explain the algorithm clearly", "Mention time/space complexity", "Consider alternatives"]
  },
  {
    question: "Design a parking lot system.",
    category: "problem_solving",
    difficulty: "hard",
    sample_answer: "Define classes: ParkingLot, ParkingSpot (with types: compact, regular, large), Vehicle (with types matching spots). Implement methods: findSpot(), parkVehicle(), removeVehicle(). Use a priority queue for spot allocation. Track occupancy, handle payment, and support multiple floors.",
    tips: ["Think object-oriented", "Consider edge cases", "Explain data structures"]
  },
  {
    question: "You need to process 1 million records efficiently. What's your approach?",
    category: "problem_solving",
    difficulty: "hard",
    sample_answer: "Use batch processing to avoid memory issues. Implement parallel processing with worker threads or job queues. For database operations, use bulk inserts and optimize queries. Consider streaming for large file processing. Monitor performance and add error handling with retry logic.",
    tips: ["Discuss scalability", "Mention specific techniques", "Consider failure scenarios"]
  },

  // Leadership Questions (15)
  {
    question: "Tell me about a time you mentored someone.",
    category: "leadership",
    difficulty: "medium",
    sample_answer: "I mentored a junior developer struggling with React. I created a learning plan, pair-programmed weekly, and gave incremental challenges. After three months, they confidently built features independently and even taught others. Seeing their growth was incredibly rewarding.",
    tips: ["Show teaching ability", "Explain your mentoring style", "Highlight mentee's growth"]
  },
  {
    question: "Describe your leadership style.",
    category: "leadership",
    difficulty: "medium",
    sample_answer: "I lead through empowerment and collaboration. I set clear goals, provide resources, and trust my team to execute. I'm hands-on when needed but encourage autonomy. I focus on building psychological safety so team members feel comfortable taking risks and learning from mistakes.",
    tips: ["Be specific about your style", "Give examples", "Show self-awareness"]
  },
  {
    question: "How do you handle underperforming team members?",
    category: "leadership",
    difficulty: "hard",
    sample_answer: "I start with private, empathetic conversations to understand root causes. Together, we create an improvement plan with clear metrics and checkpoints. I provide necessary support and resources. If performance doesn't improve, I involve HR for formal performance management.",
    tips: ["Show empathy and fairness", "Explain your process", "Mention escalation when necessary"]
  },
  {
    question: "How do you prioritize tasks for your team?",
    category: "leadership",
    difficulty: "medium",
    sample_answer: "I use impact vs. effort matrix and align with business goals. I involve the team in prioritization to build ownership. We consider dependencies, deadlines, and technical debt. I communicate priorities clearly and revisit them regularly as circumstances change.",
    tips: ["Mention frameworks used", "Show collaborative approach", "Explain communication"]
  },
  {
    question: "Tell me about a time you had to make an unpopular decision.",
    category: "leadership",
    difficulty: "hard",
    sample_answer: "I had to sunset a popular feature due to maintenance costs exceeding value. I gathered data, explained the reasoning transparently, and listened to concerns. While not everyone agreed, they respected the data-driven approach. Usage data proved the decision was right.",
    tips: ["Show decision-making process", "Demonstrate communication skills", "Explain the outcome"]
  },

  // Culture Fit Questions (10)
  {
    question: "Why do you want to work here?",
    category: "culture",
    difficulty: "easy",
    sample_answer: "I'm impressed by your company's mission to democratize AI and your commitment to responsible development. I follow your engineering blog and admire the technical challenges you're solving. The collaborative culture and growth opportunities align perfectly with my career goals.",
    tips: ["Research the company thoroughly", "Be specific and genuine", "Connect to your goals"]
  },
  {
    question: "What's your ideal work environment?",
    category: "culture",
    difficulty: "easy",
    sample_answer: "I thrive in collaborative environments with clear communication and psychological safety. I value teams that embrace learning, have strong engineering practices, and balance autonomy with support. I appreciate flexible work arrangements and a focus on outcomes over hours.",
    tips: ["Be honest but align with company culture", "Mention specific preferences", "Show flexibility"]
  },
  {
    question: "How do you stay updated with technology trends?",
    category: "culture",
    difficulty: "easy",
    sample_answer: "I follow tech blogs, participate in developer communities, and attend conferences. I contribute to open source and build side projects to experiment with new technologies. I'm selective about what to learn deeply vs. what to just be aware of.",
    tips: ["Show continuous learning", "Give specific examples", "Demonstrate curiosity"]
  },
  {
    question: "What motivates you?",
    category: "culture",
    difficulty: "easy",
    sample_answer: "I'm motivated by solving complex problems and seeing the impact of my work on users. I love learning new technologies and working with talented teammates. Growth opportunities and autonomy are important to me. Recognition matters, but the work itself is my main driver.",
    tips: ["Be genuine", "Align with role expectations", "Show intrinsic motivation"]
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "culture",
    difficulty: "medium",
    sample_answer: "I aim to be a technical leader, either as a senior engineer or engineering manager, depending on where I can create most impact. I want to mentor others, contribute to architecture decisions, and continue growing my technical expertise. I'm excited to grow with this company.",
    tips: ["Show ambition but be realistic", "Align with company growth", "Demonstrate commitment"]
  },
];

async function seedQuestions() {
  console.log('Starting to seed interview questions...');

  const { data, error } = await supabase
    .from('interview_questions')
    .insert(questions)
    .select();

  if (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data?.length} questions!`);
  console.log('Breakdown:');
  const breakdown = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(breakdown).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}`);
  });
}

seedQuestions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
