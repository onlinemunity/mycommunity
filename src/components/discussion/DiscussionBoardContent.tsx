
import React from 'react';
import { TopicItem } from './TopicItem';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { DiscussionTopic } from '@/types/discussion';

interface DiscussionBoardContentProps {
  topics: DiscussionTopic[];
  isTopicsLoading: boolean;
  filter: 'all' | 'solved' | 'unsolved';
  onEditTopic: (topic: DiscussionTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onReplyTopic: (topicId: string) => void;
  onVoteTopic: (topicId: string, voteType: number) => void;
  onSolveToggle: (topicId: string, solved: boolean) => void;
  onNewTopic: () => void;
  user: any;
}

export const DiscussionBoardContent: React.FC<DiscussionBoardContentProps> = ({
  topics,
  isTopicsLoading,
  filter,
  onEditTopic,
  onDeleteTopic,
  onReplyTopic,
  onVoteTopic,
  onSolveToggle,
  onNewTopic,
  user
}) => {
  // Apply filter to topics
  const filteredTopics = topics.filter(topic => {
    if (filter === 'all') return true;
    if (filter === 'solved') return topic.solved;
    if (filter === 'unsolved') return !topic.solved;
    return true;
  });

  if (isTopicsLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-accent1 mx-auto mb-4" />
        <p>Loading topics...</p>
      </div>
    );
  }

  if (filteredTopics.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">
            {filter === 'all' ? 'No discussion topics yet.' : 
             filter === 'solved' ? 'No solved discussion topics yet.' : 
             'No unsolved discussion topics.'}
          </p>
          {user && filter === 'all' && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={onNewTopic}
            >
              Start a new discussion
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTopics.map((topic) => (
        <TopicItem
          key={topic.id}
          topic={topic}
          onEdit={onEditTopic}
          onDelete={onDeleteTopic}
          onReply={onReplyTopic}
          onVote={onVoteTopic}
          onSolveToggle={onSolveToggle}
        />
      ))}
    </div>
  );
};
