
// Mock lecture data for development purposes
// This would come from the backend in a real application

export type Lecture = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  content: string;
  description: string;
  quiz: Quiz[];
};

export type Quiz = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type QuizOption = {
  id: string;
  text: string;
};

const mockLectures: Record<string, Lecture[]> = {
  'react-fundamentals': [
    {
      id: 'lecture-1',
      title: 'Introduction to React',
      duration: '15 min',
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>React is a JavaScript library for building user interfaces.</p><p>It was developed by Facebook and is widely used in modern web development.</p>',
      description: 'Learn the basics of React and its core concepts',
      quiz: [
        {
          id: 'quiz-1-1',
          question: 'Who developed React?',
          options: [
            { id: 'opt-1', text: 'Google' },
            { id: 'opt-2', text: 'Facebook' },
            { id: 'opt-3', text: 'Microsoft' },
            { id: 'opt-4', text: 'Amazon' }
          ],
          correctOptionId: 'opt-2'
        },
        {
          id: 'quiz-1-2',
          question: 'React is a _____?',
          options: [
            { id: 'opt-1', text: 'Programming language' },
            { id: 'opt-2', text: 'Framework' },
            { id: 'opt-3', text: 'Library' },
            { id: 'opt-4', text: 'Database' }
          ],
          correctOptionId: 'opt-3'
        }
      ]
    },
    {
      id: 'lecture-2',
      title: 'Components and Props',
      duration: '25 min',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>Components are the building blocks of React applications.</p><p>Props are how we pass data between components.</p>',
      description: 'Understanding React components and how to use props',
      quiz: [
        {
          id: 'quiz-2-1',
          question: 'What are the building blocks of React applications?',
          options: [
            { id: 'opt-1', text: 'Functions' },
            { id: 'opt-2', text: 'Components' },
            { id: 'opt-3', text: 'Classes' },
            { id: 'opt-4', text: 'Objects' }
          ],
          correctOptionId: 'opt-2'
        }
      ]
    },
    {
      id: 'lecture-3',
      title: 'State and Lifecycle',
      duration: '30 min',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>State is a way to store and manage component-specific data.</p><p>React components have lifecycle methods that let you run code at specific times.</p>',
      description: 'Learn about React state and component lifecycle',
      quiz: [
        {
          id: 'quiz-3-1',
          question: 'What hook is used to add state to a functional component?',
          options: [
            { id: 'opt-1', text: 'useEffect' },
            { id: 'opt-2', text: 'useState' },
            { id: 'opt-3', text: 'useContext' },
            { id: 'opt-4', text: 'useReducer' }
          ],
          correctOptionId: 'opt-2'
        }
      ]
    }
  ],
  'advanced-css': [
    {
      id: 'lecture-1',
      title: 'Flexbox Layout',
      duration: '20 min',
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>Flexbox is a one-dimensional layout method for arranging items in rows or columns.</p>',
      description: 'Learn how to use Flexbox for modern layouts',
      quiz: [
        {
          id: 'quiz-1-1',
          question: 'Flexbox is a _____-dimensional layout method',
          options: [
            { id: 'opt-1', text: 'One' },
            { id: 'opt-2', text: 'Two' },
            { id: 'opt-3', text: 'Three' },
            { id: 'opt-4', text: 'Multi' }
          ],
          correctOptionId: 'opt-1'
        }
      ]
    },
    {
      id: 'lecture-2',
      title: 'CSS Grid',
      duration: '25 min',
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>CSS Grid is a two-dimensional layout system designed for complex layouts.</p>',
      description: 'Master CSS Grid for complex layouts',
      quiz: [
        {
          id: 'quiz-2-1',
          question: 'CSS Grid is a _____-dimensional layout method',
          options: [
            { id: 'opt-1', text: 'One' },
            { id: 'opt-2', text: 'Two' },
            { id: 'opt-3', text: 'Three' },
            { id: 'opt-4', text: 'Multi' }
          ],
          correctOptionId: 'opt-2'
        }
      ]
    }
  ]
};

export default mockLectures;
