
import React, { useState, useEffect } from 'react';
import { useDiscussion } from '@/hooks/useDiscussion';
import { TopicForm } from './TopicForm';
import { TopicDetail } from './TopicDetail';
import { DiscussionBoardContent } from './DiscussionBoardContent';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  const [filterTab, setFilterTab] = useState<'all' | 'solved' | 'unsolved'>('all');
  
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
    createTopic,
    updateTopic,
    deleteTopic,
    markTopicSolved,
    voteTopic,
    isCreatingTopic,
    isUpdatingTopic
  } = useDiscussion(courseId, effectiveLectureId);
  
  useEffect(() => {
    console.log('Topics loaded:', topics?.length || 0);
  }, [topics]);
  
  const selectedTopic = selectedTopicId ? topics.find(t => t.id === selectedTopicId) : null;
  
  const handleCreateTopic = () => {
    createTopic({
      title: newTopicForm.title,
      content: newTopicForm.content
    });
    setShowNewForm(false);
    setNewTopicForm({ title: '', content: '' });
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
            onVoteTopic={(topicId, voteType) => voteTopic({ topicId, voteType })}
            onSolveToggle={(topicId, solved) => markTopicSolved({ topicId, solved })}
            getComments={getComments}
            newCommentForm={newCommentForm}
            setNewCommentForm={setNewCommentForm}
            editingComment={editingComment}
            setEditingComment={setEditingComment}
            createComment={({ topicId, content }) => getComments(topicId).createComment({ content })}
            updateComment={({ id, content }) => {
              if (editingComment) {
                getComments(editingComment.topic_id).updateComment({ id, content });
              }
            }}
            deleteComment={({ id, topicId }) => getComments(topicId).deleteComment(id)}
            voteComment={({ commentId, topicId, voteType }) => 
              getComments(topicId).voteComment({ commentId, voteType })}
            markCommentSolution={({ commentId, topicId, isSolution }) => 
              getComments(topicId).markCommentSolution({ commentId, isSolution })}
            isCreatingComment={false}
            isUpdatingComment={false}
          />
        </div>
      ) : (
        <Tabs defaultValue="all" onValueChange={(value) => setFilterTab(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <DiscussionBoardContent
              topics={topics}
              isTopicsLoading={isTopicsLoading}
              filter="all"
              onEditTopic={handleEditTopic}
              onDeleteTopic={handleDeleteTopic}
              onReplyTopic={handleReply}
              onVoteTopic={(topicId, voteType) => voteTopic({ topicId, voteType })}
              onSolveToggle={(topicId, solved) => markTopicSolved({ topicId, solved })}
              onNewTopic={() => setShowNewForm(true)}
              user={user}
            />
          </TabsContent>
          
          <TabsContent value="solved">
            <DiscussionBoardContent
              topics={topics}
              isTopicsLoading={isTopicsLoading}
              filter="solved"
              onEditTopic={handleEditTopic}
              onDeleteTopic={handleDeleteTopic}
              onReplyTopic={handleReply}
              onVoteTopic={(topicId, voteType) => voteTopic({ topicId, voteType })}
              onSolveToggle={(topicId, solved) => markTopicSolved({ topicId, solved })}
              onNewTopic={() => setShowNewForm(true)}
              user={user}
            />
          </TabsContent>
          
          <TabsContent value="unsolved">
            <DiscussionBoardContent
              topics={topics}
              isTopicsLoading={isTopicsLoading}
              filter="unsolved"
              onEditTopic={handleEditTopic}
              onDeleteTopic={handleDeleteTopic}
              onReplyTopic={handleReply}
              onVoteTopic={(topicId, voteType) => voteTopic({ topicId, voteType })}
              onSolveToggle={(topicId, solved) => markTopicSolved({ topicId, solved })}
              onNewTopic={() => setShowNewForm(true)}
              user={user}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
