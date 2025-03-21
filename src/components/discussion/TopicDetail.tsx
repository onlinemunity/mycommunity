import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Edit, Trash, CheckCircle, Pin, Reply } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DiscussionTopic, DiscussionComment } from '@/types/discussion';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface TopicDetailProps {
  topic: DiscussionTopic;
  onEditTopic: (topic: DiscussionTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onVoteTopic: (topicId: string, voteType: number) => void;
  onSolveToggle: (topicId: string, solved: boolean) => void;
  getComments: (topicId: string) => {
    data: DiscussionComment[] | undefined;
    isLoading: boolean;
  };
  newCommentForm: { content: string };
  setNewCommentForm: (form: { content: string }) => void;
  editingComment: DiscussionComment | null;
  setEditingComment: (comment: DiscussionComment | null) => void;
  createComment: (data: { topicId: string; content: string }) => void;
  updateComment: (data: { id: string; content: string }) => void;
  deleteComment: (data: { id: string; topicId: string }) => void;
  voteComment: (data: { commentId: string; topicId: string; voteType: number }) => void;
  markCommentSolution: (data: { commentId: string; topicId: string; isSolution: boolean }) => void;
  isCreatingComment: boolean;
  isUpdatingComment: boolean;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topic,
  onEditTopic,
  onDeleteTopic,
  onVoteTopic,
  onSolveToggle,
  getComments,
  newCommentForm,
  setNewCommentForm,
  editingComment,
  setEditingComment,
  createComment,
  updateComment,
  deleteComment,
  voteComment,
  markCommentSolution,
  isCreatingComment,
  isUpdatingComment
}) => {
  const { user } = useAuth();
  const isOwner = user && user.id === topic.user_id;
  const formattedDate = format(new Date(topic.created_at), 'PPP');
  
  const { data: comments = [], isLoading: isCommentsLoading } = getComments(topic.id);
  
  const handleCreateComment = () => {
    createComment({
      topicId: topic.id,
      content: newCommentForm.content
    });
  };
  
  const handleUpdateComment = () => {
    if (editingComment) {
      updateComment({
        id: editingComment.id,
        content: newCommentForm.content
      });
    }
  };
  
  const handleEditComment = (comment: DiscussionComment) => {
    setEditingComment(comment);
    setNewCommentForm({ content: comment.content });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{topic.title}</CardTitle>
              {topic.pinned && <Pin className="h-4 w-4 text-primary" />}
              {topic.solved && <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Solved</Badge>}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={topic.user_profile?.avatar_url || ''} alt={topic.user_profile?.username || 'User'} />
                  <AvatarFallback>{topic.user_profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <span>{topic.user_profile?.username || 'Unknown'}</span>
              </div>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center mr-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${topic.user_vote === 1 ? 'text-primary' : ''}`}
                onClick={() => onVoteTopic(topic.id, 1)}
                disabled={!user}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{topic.vote_count || 0}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${topic.user_vote === -1 ? 'text-primary' : ''}`}
                onClick={() => onVoteTopic(topic.id, -1)}
                disabled={!user}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>
            
            {isOwner && (
              <>
                <Button variant="ghost" size="icon" onClick={() => onEditTopic(topic)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteTopic(topic.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onSolveToggle(topic.id, !topic.solved)}
                  title={topic.solved ? "Mark as unsolved" : "Mark as solved"}
                >
                  <CheckCircle className={`h-4 w-4 ${topic.solved ? 'text-green-500' : ''}`} />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{topic.content}</p>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">{comments?.length || 0} Replies</h3>
        
        {user && !editingComment && (
          <CommentForm
            content={newCommentForm.content}
            onContentChange={(content) => setNewCommentForm({ content })}
            onSubmit={handleCreateComment}
            isSubmitting={isCreatingComment}
            isEditing={false}
          />
        )}
        
        {editingComment && (
          <CommentForm
            content={newCommentForm.content}
            onContentChange={(content) => setNewCommentForm({ content })}
            onSubmit={handleUpdateComment}
            onCancel={() => setEditingComment(null)}
            isSubmitting={isUpdatingComment}
            isEditing={true}
          />
        )}
        
        {isCommentsLoading ? (
          <div className="text-center py-10">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No replies yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                topicUserId={topic.user_id}
                onEdit={handleEditComment}
                onDelete={(commentId, topicId) => deleteComment({ id: commentId, topicId })}
                onVote={(commentId, topicId, voteType) => voteComment({ commentId, topicId, voteType })}
                onSolutionToggle={(commentId, topicId, isSolution) => 
                  markCommentSolution({ commentId, topicId, isSolution })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
