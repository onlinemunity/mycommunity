
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Pin, CheckCircle, ArrowUp, ArrowDown, Edit, Trash, Reply } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DiscussionTopic } from '@/types/discussion';
import { useAuth } from '@/context/AuthContext';

interface TopicItemProps {
  topic: DiscussionTopic;
  onEdit: (topic: DiscussionTopic) => void;
  onDelete: (topicId: string) => void;
  onReply: (topicId: string) => void;
  onVote: (topicId: string, voteType: number) => void;
  onSolveToggle: (topicId: string, solved: boolean) => void;
  showReplyButton?: boolean;
  showCommentCount?: boolean;
}

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  onEdit,
  onDelete,
  onReply,
  onVote,
  onSolveToggle,
  showReplyButton = true,
  showCommentCount = true
}) => {
  const { user } = useAuth();
  const isOwner = user && user.id === topic.user_id;
  const timeAgo = formatDistanceToNow(new Date(topic.created_at), { addSuffix: true });
  
  // Safely get the username and avatar from the user_profile
  const username = topic.user_profile?.username || 'Anonymous';
  const avatarUrl = topic.user_profile?.avatar_url || '';
  const userInitial = username[0]?.toUpperCase() || 'A';

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${topic.user_vote === 1 ? 'text-primary' : ''}`}
            onClick={() => onVote(topic.id, 1)}
            disabled={!user}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">{topic.vote_count || 0}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${topic.user_vote === -1 ? 'text-primary' : ''}`}
            onClick={() => onVote(topic.id, -1)}
            disabled={!user}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold line-clamp-1">{topic.title}</h3>
            {topic.pinned && <Pin className="h-4 w-4 text-primary" />}
            {topic.solved && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          
          <div className="prose prose-sm max-w-none mb-3">
            <p className="line-clamp-2">{topic.content}</p>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span>{username}</span>
            </div>
            <span>{timeAgo}</span>
            {showCommentCount && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{topic.comment_count || 0}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isOwner && (
            <>
              <Button variant="ghost" size="icon" onClick={() => onEdit(topic)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(topic.id)}>
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onSolveToggle(topic.id, !topic.solved)}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          {showReplyButton && (
            <Button variant="ghost" size="sm" onClick={() => onReply(topic.id)} disabled={!user}>
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
