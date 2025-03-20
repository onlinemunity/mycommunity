
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Video, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lecture } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

// Simple quiz questions structure for quiz lectures
interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

// Sample quiz questions generator
const generateQuizQuestions = (lectureTitle: string): QuizQuestion[] => {
  const baseTitle = lectureTitle.replace('Quiz: ', '');
  
  return [
    {
      id: '1',
      question: `What is the main focus of "${baseTitle}"?`,
      options: [
        { id: 'a', text: 'Understanding core principles' },
        { id: 'b', text: 'Learning practical applications' },
        { id: 'c', text: 'Memorizing definitions' },
        { id: 'd', text: 'All of the above' }
      ],
      correctOptionId: 'd'
    },
    {
      id: '2',
      question: 'Which of the following best describes the learning approach in this lecture?',
      options: [
        { id: 'a', text: 'Theoretical only' },
        { id: 'b', text: 'Practical examples with theory' },
        { id: 'c', text: 'Self-guided research' },
        { id: 'd', text: 'None of the above' }
      ],
      correctOptionId: 'b'
    },
    {
      id: '3',
      question: 'What should you do after completing this lecture?',
      options: [
        { id: 'a', text: 'Take a break' },
        { id: 'b', text: 'Review the material' },
        { id: 'c', text: 'Move to the next lecture' },
        { id: 'd', text: 'Practice the concepts learned' }
      ],
      correctOptionId: 'd'
    }
  ];
};

interface LectureProps {
  lecture: Lecture & {
    courseId: string;
  };
  onComplete: (lectureId: string) => void;
}

export const LectureDetail: React.FC<LectureProps> = ({ lecture, onComplete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('video');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(lecture.completed || false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  
  // Check if lecture is a quiz based on title
  const isQuiz = lecture.title.startsWith('Quiz:');
  
  useEffect(() => {
    console.log('Lecture details:', lecture);
    
    // Set active tab based on lecture type
    if (isQuiz) {
      setActiveTab('quiz');
    } else if (lecture.video_url) {
      setActiveTab('video');
    } else if (lecture.full_description) {
      setActiveTab('description');  
    } else if (lecture.material) {
      setActiveTab('material');  
    } else if (lecture.links) {
      setActiveTab('links');    
    } else if (lecture.content) {
      setActiveTab('content');
    }
    
    // Generate quiz questions for quiz lectures
    if (isQuiz) {
      setQuizQuestions(generateQuizQuestions(lecture.title));
    }
    
    // Reset component state when lecture changes
    setTaskCompleted(lecture.completed || false);
    setQuizSubmitted(false);
    setQuizPassed(false);
    setSelectedAnswers({});
  }, [lecture, isQuiz]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = quizQuestions.filter(
      q => selectedAnswers[q.id] === q.correctOptionId
    ).length;
    
    const passScore = Math.ceil(quizQuestions.length * 0.7); // 70% to pass
    const passed = correctAnswers >= passScore;
    
    setQuizPassed(passed);
    setQuizSubmitted(true);
    
    if (passed) {
      setTaskCompleted(true);
      onComplete(lecture.id);
      
      toast({
        title: t('dashboard.courses.quizPassed'),
        description: t('dashboard.courses.progressUpdated'),
      });
    } else {
      toast({
        title: t('dashboard.courses.quizFailed'),
        description: t('dashboard.courses.tryAgain'),
        variant: "destructive"
      });
    }
  };

  const handleMarkAsComplete = () => {
    setTaskCompleted(true);
    onComplete(lecture.id);
    
    toast({
      title: t('dashboard.courses.lectureCompleted'),
      description: t('dashboard.courses.progressUpdated'),
    });
  };


  
  function Linkify({ text }) {
  // Regulärer Ausdruck zum Finden von URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Text ersetzen und URLs durch <a> Tags umwandeln
  const linkedText = text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  return <div dangerouslySetInnerHTML={{ __html: linkedText }} />;
}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/dashboard/courses/${lecture.courseId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('dashboard.courses.backToCourse')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{lecture.title}</CardTitle>
          <CardDescription>{lecture.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {lecture.video_url && (
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  {t('dashboard.courses.video')}
                </TabsTrigger>
              )}
              {lecture.description && (
                <TabsTrigger value="description">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('dashboard.courses.full_description')}
                </TabsTrigger>
              )}
              {lecture.content && (
                <TabsTrigger value="content">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('dashboard.courses.notes')}
                </TabsTrigger>
              )}

              {lecture.material && (
                <TabsTrigger value="material">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('dashboard.courses.material')}
                </TabsTrigger>
              )}

              {lecture.links && (
                <TabsTrigger value="links">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('dashboard.courses.links')}
                </TabsTrigger>
              )}
              
              {isQuiz && (
                <TabsTrigger value="quiz">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('dashboard.courses.quiz')}
                </TabsTrigger>
              )}
            </TabsList>
            
            {lecture.video_url && (
              <TabsContent value="video" className="space-y-4">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <iframe 
                    src={lecture.video_url} 
                    className="absolute inset-0 w-full h-full"
                    title={lecture.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </TabsContent>
            )}

            {lecture.description && (
              <TabsContent value="description" className="space-y-4">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lecture.full_description }} />
                </div>
              </TabsContent>
            )}
            
            {lecture.content && (
              <TabsContent value="content" className="space-y-4">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lecture.content }} />
                </div>
              </TabsContent>
            )}

            {lecture.material && (
              <TabsContent value="material" className="space-y-4">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lecture.material }} />
                </div>
              </TabsContent>
            )}

            {lecture.links && (
              <TabsContent value="links" className="space-y-4">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lecture.links }} />
                </div>
              </TabsContent>
            )}
            
            {isQuiz && (
              <TabsContent value="quiz" className="space-y-6">
                {quizSubmitted && (
                  <div className={`p-4 mb-4 rounded-md ${quizPassed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {quizPassed ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>{t('dashboard.courses.quizPassed')}</span>
                      </div>
                    ) : (
                      <div>{t('dashboard.courses.quizFailed')}</div>
                    )}
                  </div>
                )}
                
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <h3 className="font-medium">
                      {index + 1}. {question.question}
                    </h3>
                    <RadioGroup 
                      value={selectedAnswers[question.id]} 
                      onValueChange={(value) => handleAnswerSelect(question.id, value)}
                      disabled={quizSubmitted}
                    >
                      {question.options.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                          <label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                            {option.text}
                          </label>
                          {quizSubmitted && option.id === question.correctOptionId && (
                            <span className="text-green-600 text-xs ml-2">
                              ({t('dashboard.courses.correctAnswer')})
                            </span>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                
                {!quizSubmitted && (
                  <Button onClick={handleSubmitQuiz}>
                    {t('dashboard.courses.submitQuiz')}
                  </Button>
                )}
                
                {quizSubmitted && !quizPassed && (
                  <Button onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                  }}>
                    {t('dashboard.courses.tryAgain')}
                  </Button>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="mark-complete" 
              checked={taskCompleted}
              onCheckedChange={() => taskCompleted ? null : handleMarkAsComplete()}
            />
            <label
              htmlFor="mark-complete"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('dashboard.courses.markComplete')}
            </label>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/dashboard/courses/${lecture.courseId}`)}>
              {t('dashboard.courses.backToCourse')}
            </Button>
            {!lecture.completed && (
              <Button onClick={handleMarkAsComplete} disabled={taskCompleted}>
                {t('dashboard.courses.completeAndContinue')}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
