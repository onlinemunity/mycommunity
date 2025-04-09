
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, ArrowDown, Edit, Trash, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DiscussionComment } from '@/types/discussion';
import { useAuth } from '@/context/AuthContext';

interface CommentItemProps {
  comment: DiscussionComment;
  topicUserId: string;
  onEdit: (comment: DiscussionComment) => void;
  onDelete: (commentId: string, topicId: string) => void;
  onVote: (commentId: string, topicId: string, voteType: number) => void;
  onSolutionToggle: (commentId: string, topicId: string, isSolution: boolean) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  topicUserId,
  onEdit,
  onDelete,
  onVote,
  onSolutionToggle
}) => {
  const { user } = useAuth();
  const isOwner = user && user.id === comment.user_id;
  const isTopicOwner = user && user.id === topicUserId;
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
  
  // Safely get the username and avatar from the user_profile
  const username = comment.user_profile?.username || 'Anonymous';
  const avatarUrl = comment.user_profile?.avatar_url || '';
  const userInitial = username.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className={`border rounded-lg p-4 mb-4 ${comment.is_solution ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${comment.user_vote === 1 ? 'text-primary' : ''}`}
            onClick={() => onVote(comment.id, comment.topic_id, 1)}
            disabled={!user}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">{comment.vote_count || 0}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${comment.user_vote === -1 ? 'text-primary' : ''}`}
            onClick={() => onVote(comment.id, comment.topic_id, -1)}
            disabled={!user}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{username}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {comment.is_solution && <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Solution</Badge>}
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p>{comment.content}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isOwner && (
            <>
              <Button variant="ghost" size="icon" onClick={() => onEdit(comment)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(comment.id, comment.topic_id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
          {isTopicOwner && !comment.is_solution && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onSolutionToggle(comment.id, comment.topic_id, true)}
              title="Mark as solution"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          {isTopicOwner && comment.is_solution && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onSolutionToggle(comment.id, comment.topic_id, false)}
              title="Remove solution mark"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Create a skeleton loader for comment items
export const CommentItemSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-4 my-1" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
