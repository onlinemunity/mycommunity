import React, { useState, useEffect } from 'react';
import { useDiscussion } from '@/hooks/useDiscussion';
import { TopicForm } from './TopicForm';
import { TopicItem } from './TopicItem';
import { TopicDetail } from './TopicDetail';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';

interface DiscussionBoardProps {
  courseId: string;
  lectureId?: string;
  title: string;
}

export const DiscussionBoard: React.FC<DiscussionBoardProps> = ({
  courseId,
  lectureId,
  title
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const routeParams = useParams();
  const routeLectureId = routeParams.lectureId;
  
  const effectiveLectureId = lectureId || routeLectureId;
  
  useEffect(() => {
    console.log('DiscussionBoard: courseId =', courseId);
    console.log('DiscussionBoard: effectiveLectureId =', effectiveLectureId);
  }, [courseId, effectiveLectureId]);
  
  const {
    topics,
    isTopicsLoading,
    getComments,
    newTopicForm,
    setNewTopicForm,
    newCommentForm,
    setNewCommentForm,
    editingTopic,
    setEditingTopic,
    editingComment,
    setEditingComment,
    replyingToTopic,
    setReplyingToTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    createComment,
    updateComment,
    deleteComment,
    markTopicSolved,
    markCommentSolution,
    voteTopic,
    voteComment,
    isCreatingTopic,
    isUpdatingTopic,
    isCreatingComment,
    isUpdatingComment
  } = useDiscussion(courseId, effectiveLectureId);
  
  useEffect(() => {
    console.log('Topics loaded:', topics);
  }, [topics]);
  
  const selectedTopic = selectedTopicId ? topics.find(t => t.id === selectedTopicId) : null;
  
  const handleCreateTopic = () => {
    createTopic({
      title: newTopicForm.title,
      content: newTopicForm.content
    });
    setShowNewForm(false);
  };
  
  const handleUpdateTopic = () => {
    if (editingTopic) {
      updateTopic({
        id: editingTopic.id,
        title: newTopicForm.title,
        content: newTopicForm.content
      });
      setEditingTopic(null);
      if (selectedTopicId === editingTopic.id) {
        setSelectedTopicId(null);
      }
    }
  };
  
  const handleEditTopic = (topic: any) => {
    setEditingTopic(topic);
    setNewTopicForm({
      title: topic.title,
      content: topic.content
    });
    setSelectedTopicId(null);
  };
  
  const handleReply = (topicId: string) => {
    setSelectedTopicId(topicId);
    setNewCommentForm({ content: '' });
  };
  
  const handleDeleteTopic = (topicId: string) => {
    deleteTopic(topicId);
    if (selectedTopicId === topicId) {
      setSelectedTopicId(null);
    }
  };
  
  const handleLoginPrompt = () => {
    navigate('/auth', { state: { redirectTo: window.location.pathname } });
  };

  const wrapVoteTopic = (topicId: string, voteType: number) => {
    voteTopic({ topicId, voteType });
  };

  const wrapSolveToggle = (topicId: string, solved: boolean) => {
    markTopicSolved({ topicId, solved });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {user ? (
          <Button onClick={() => setShowNewForm(!showNewForm)} disabled={!!editingTopic}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Topic
          </Button>
        ) : (
          <Button onClick={handleLoginPrompt}>
            Log in to participate
          </Button>
        )}
      </div>
      
      {showNewForm && (
        <TopicForm
          title={newTopicForm.title}
          content={newTopicForm.content}
          onTitleChange={(title) => setNewTopicForm({ ...newTopicForm, title })}
          onContentChange={(content) => setNewTopicForm({ ...newTopicForm, content })}
          onSubmit={handleCreateTopic}
          onCancel={() => setShowNewForm(false)}
          isSubmitting={isCreatingTopic}
          isEditing={false}
        />
      )}
      
      {editingTopic && (
        <TopicForm
          title={newTopicForm.title}
          content={newTopicForm.content}
          onTitleChange={(title) => setNewTopicForm({ ...newTopicForm, title })}
          onContentChange={(content) => setNewTopicForm({ ...newTopicForm, content })}
          onSubmit={handleUpdateTopic}
          onCancel={() => setEditingTopic(null)}
          isSubmitting={isUpdatingTopic}
          isEditing={true}
        />
      )}
      
      {selectedTopic ? (
        <div>
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setSelectedTopicId(null)}
          >
            ← Back to all topics
          </Button>
          
          <TopicDetail
            topic={selectedTopic}
            onEditTopic={handleEditTopic}
            onDeleteTopic={handleDeleteTopic}
            onVoteTopic={wrapVoteTopic}
            onSolveToggle={wrapSolveToggle}
            getComments={getComments}
            newCommentForm={newCommentForm}
            setNewCommentForm={setNewCommentForm}
            editingComment={editingComment}
            setEditingComment={setEditingComment}
            createComment={createComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
            voteComment={voteComment}
            markCommentSolution={markCommentSolution}
            isCreatingComment={isCreatingComment}
            isUpdatingComment={isUpdatingComment}
          />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isTopicsLoading ? (
              <div className="text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-accent1 mx-auto mb-4" />
                <p>Loading topics...</p>
              </div>
            ) : topics.length === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">No discussion topics yet.</p>
                  {user && (
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => setShowNewForm(true)}
                    >
                      Start a new discussion
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    onEdit={handleEditTopic}
                    onDelete={handleDeleteTopic}
                    onReply={handleReply}
                    onVote={wrapVoteTopic}
                    onSolveToggle={wrapSolveToggle}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="solved">
            {isTopicsLoading ? (
              <div className="text-center py-10">Loading topics...</div>
            ) : topics.filter(t => t.solved).length === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">No solved discussion topics yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {topics.filter(t => t.solved).map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    onEdit={handleEditTopic}
                    onDelete={handleDeleteTopic}
                    onReply={handleReply}
                    onVote={wrapVoteTopic}
                    onSolveToggle={wrapSolveToggle}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unsolved">
            {isTopicsLoading ? (
              <div className="text-center py-10">Loading topics...</div>
            ) : topics.filter(t => !t.solved).length === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">No unsolved discussion topics.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {topics.filter(t => !t.solved).map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    onEdit={handleEditTopic}
                    onDelete={handleDeleteTopic}
                    onReply={handleReply}
                    onVote={wrapVoteTopic}
                    onSolveToggle={wrapSolveToggle}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
