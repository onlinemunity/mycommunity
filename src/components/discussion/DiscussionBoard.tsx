
import React, { useState, useEffect } from 'react';
import { useDiscussionTopics } from '@/hooks/discussion/useDiscussionTopics';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { DiscussionBoardContent } from './DiscussionBoardContent';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TopicForm } from './TopicForm';
import { TopicDetail } from './TopicDetail';
import { useDiscussionComments } from '@/hooks/discussion/useDiscussionComments';

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
  const [newTopicForm, setNewTopicForm] = useState({ title: '', content: '' });
  const [newCommentForm, setNewCommentForm] = useState({ content: '' });
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [editingComment, setEditingComment] = useState<any>(null);
  
  useEffect(() => {
    console.log('DiscussionBoard: courseId =', courseId);
    console.log('DiscussionBoard: lectureId =', lectureId);
  }, [courseId, lectureId]);
  
  const {
    topics,
    isTopicsLoading,
    createTopic,
    updateTopic,
    deleteTopic,
    markTopicSolved,
    voteTopic,
    isCreatingTopic,
    isUpdatingTopic
  } = useDiscussionTopics(courseId, lectureId);
  
  useEffect(() => {
    console.log('Topics loaded:', topics?.length || 0);
    if (topics?.length > 0) {
      console.log('First topic:', topics[0]);
    }
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
  
  // Fix the getComments function to correctly access and return comment data
  const getComments = (topicId: string) => {
    const commentsResult = useDiscussionComments(topicId, courseId, lectureId);
    
    return { 
      data: commentsResult.comments, 
      isLoading: commentsResult.isCommentsLoading,
      createComment: commentsResult.createComment,
      updateComment: commentsResult.updateComment,
      deleteComment: commentsResult.deleteComment,
      voteComment: commentsResult.voteComment,
      markCommentSolution: commentsResult.markCommentSolution,
      isCreatingComment: commentsResult.isCreatingComment,
      isUpdatingComment: commentsResult.isUpdatingComment,
    };
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
            createComment={({ topicId, content }) => {
              const commentsData = getComments(topicId);
              commentsData.createComment({ content });
            }}
            updateComment={({ id, content }) => {
              if (editingComment) {
                const commentsData = getComments(editingComment.topic_id);
                commentsData.updateComment({ id, content });
              }
            }}
            deleteComment={({ id, topicId }) => {
              const commentsData = getComments(topicId);
              commentsData.deleteComment(id);
            }}
            voteComment={({ commentId, topicId, voteType }) => {
              const commentsData = getComments(topicId);
              commentsData.voteComment({ commentId, voteType });
            }}
            markCommentSolution={({ commentId, topicId, isSolution }) => {
              const commentsData = getComments(topicId);
              commentsData.markCommentSolution({ commentId, isSolution });
            }}
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
