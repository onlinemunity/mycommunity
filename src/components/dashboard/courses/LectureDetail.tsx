
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Video, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

interface LectureProps {
  lecture: {
    id: string;
    courseId: string;
    title: string;
    description: string;
    videoUrl: string;
    content: string;
    completed: boolean;
    quiz: QuizQuestion[];
  };
  onComplete: (lectureId: string) => void;
}

export const LectureDetail: React.FC<LectureProps> = ({ lecture, onComplete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('video');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(lecture.completed);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = lecture.quiz.filter(
      q => selectedAnswers[q.id] === q.correctOptionId
    ).length;
    
    const passScore = Math.ceil(lecture.quiz.length * 0.7); // 70% to pass
    const passed = correctAnswers >= passScore;
    
    setQuizPassed(passed);
    setQuizSubmitted(true);
    
    if (passed) {
      setTaskCompleted(true);
    }
  };

  const handleMarkAsComplete = () => {
    setTaskCompleted(true);
    onComplete(lecture.id);
  };

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
              <TabsTrigger value="video">
                <Video className="h-4 w-4 mr-2" />
                {t('dashboard.courses.video')}
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                {t('dashboard.courses.notes')}
              </TabsTrigger>
              <TabsTrigger value="quiz">
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('dashboard.courses.quiz')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="video" className="space-y-4">
              <div className="aspect-video relative rounded-md overflow-hidden">
                <iframe 
                  src={lecture.videoUrl} 
                  className="absolute inset-0 w-full h-full"
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lecture.content }} />
              </div>
            </TabsContent>
            
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
              
              {lecture.quiz.map((question, index) => (
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
                        <RadioGroupItem value={option.id} id={option.id} />
                        <label htmlFor={option.id} className="text-sm">
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
