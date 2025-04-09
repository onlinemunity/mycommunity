
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DiscussionTopic } from '@/types/discussion';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const useDiscussionTopics = (courseId?: string, lectureId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get topics based on course or lecture
  const { data: topics = [], isLoading: isTopicsLoading } = useQuery({
    queryKey: ['discussionTopics', courseId, lectureId],
    queryFn: async () => {
      if (!courseId) {
        console.log('No courseId provided to useDiscussionTopics');
        return [];
      }
      
      console.log('Fetching topics with courseId:', courseId, 'lectureId:', lectureId);
      
      // Build the query
      let query = supabase
        .from('discussion_topics')
        .select(`
          *,
          user_profile:profiles(username, avatar_url)
        `)
        .eq('course_id', courseId);

      // If lectureId is provided, filter by lecture_id
      if (lectureId) {
        console.log('Filtering by lectureId:', lectureId);
        query = query.eq('lecture_id', lectureId);
      } else {
        console.log('No lectureId provided, fetching course-level topics only');
        query = query.is('lecture_id', null);
      }

      query = query
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      const { data: topicsData, error } = await query;
      
      if (error) {
        console.error('Error fetching topics:', error);
        throw error;
      }
      
      console.log('Topics data received:', topicsData?.length || 0, 'topics');
      
      if (!topicsData || topicsData.length === 0) {
        return [];
      }
      
      // Log the raw data for debugging
      console.log('Raw topics data:', JSON.stringify(topicsData));
      
      // Get all topic IDs
      const topicIds = topicsData.map(topic => topic.id);
      
      // Batch fetch vote counts
      const { data: votesData, error: votesError } = await supabase
        .from('discussion_votes')
        .select('topic_id, vote_type')
        .in('topic_id', topicIds);
        
      if (votesError) throw votesError;
      
      // Batch fetch comment counts
      const { data: commentCountsData, error: commentCountsError } = await supabase
        .from('discussion_comments')
        .select('topic_id, id')
        .in('topic_id', topicIds);
        
      if (commentCountsError) throw commentCountsError;
      
      // Get user votes if user is logged in
      let userVotesData: any[] = [];
      if (user) {
        const { data: userVotes, error: userVotesError } = await supabase
          .from('discussion_votes')
          .select('topic_id, vote_type')
          .in('topic_id', topicIds)
          .eq('user_id', user.id);
          
        if (!userVotesError) {
          userVotesData = userVotes || [];
        }
      }
      
      // Process the data to calculate counts and add user votes
      const topicsWithMeta = topicsData.map((topic: any) => {
        // Count votes for this topic
        const topicVotes = votesData?.filter(vote => vote.topic_id === topic.id) || [];
        const voteCount = topicVotes.reduce((sum, vote) => sum + vote.vote_type, 0);
        
        // Count comments
        const commentCount = commentCountsData?.filter(comment => comment.topic_id === topic.id).length || 0;
        
        // Get user vote
        const userVote = userVotesData.find(vote => vote.topic_id === topic.id);
        
        return {
          ...topic,
          vote_count: voteCount,
          user_vote: userVote ? userVote.vote_type : 0,
          comment_count: commentCount,
          // Handle nested user profile data
          user_profile: topic.user_profile && topic.user_profile.length > 0 
            ? topic.user_profile[0] 
            : { username: 'Anonymous', avatar_url: null }
        };
      });
      
      console.log('Processed topics with meta:', topicsWithMeta.length);
      return topicsWithMeta;
    },
    enabled: !!courseId,
  });

  // Create a new topic
  const createTopicMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!user || !courseId) throw new Error('User must be logged in and course must be specified');
      
      const topicData = {
        course_id: courseId,
        lecture_id: lectureId || null,
        user_id: user.id,
        title,
        content,
        pinned: false,
        solved: false
      };
      
      console.log('Creating topic with data:', topicData);
      
      const { data, error } = await supabase
        .from('discussion_topics')
        .insert(topicData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating topic:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
      toast({
        title: "Topic created",
        description: "Your discussion topic has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating topic",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update an existing topic
  const updateTopicMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('discussion_topics')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
      toast({
        title: "Topic updated",
        description: "Your discussion topic has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating topic",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete a topic
  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      if (!user) throw new Error('User must be logged in');
      
      const { error } = await supabase
        .from('discussion_topics')
        .delete()
        .eq('id', topicId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
      toast({
        title: "Topic deleted",
        description: "The discussion topic has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting topic",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mark a topic as solved
  const markTopicSolvedMutation = useMutation({
    mutationFn: async ({ topicId, solved }: { topicId: string; solved: boolean }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('discussion_topics')
        .update({ solved, updated_at: new Date().toISOString() })
        .eq('id', topicId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
      toast({
        title: "Topic updated",
        description: "The topic status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating topic",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Vote on a topic
  const voteTopicMutation = useMutation({
    mutationFn: async ({ topicId, voteType }: { topicId: string; voteType: number }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data: existingVote, error: checkError } = await supabase
        .from('discussion_votes')
        .select('id, vote_type')
        .eq('topic_id', topicId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingVote && existingVote.vote_type === voteType) {
        const { error: deleteError } = await supabase
          .from('discussion_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) throw deleteError;
      } else {
        if (existingVote) {
          const { error: updateError } = await supabase
            .from('discussion_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('discussion_votes')
            .insert({
              topic_id: topicId,
              user_id: user.id,
              vote_type: voteType
            });
          
          if (insertError) throw insertError;
        }
      }
      
      return { topicId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error voting",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    topics,
    isTopicsLoading,
    createTopic: createTopicMutation.mutate,
    updateTopic: updateTopicMutation.mutate,
    deleteTopic: deleteTopicMutation.mutate,
    markTopicSolved: markTopicSolvedMutation.mutate,
    voteTopic: voteTopicMutation.mutate,
    isCreatingTopic: createTopicMutation.isPending,
    isUpdatingTopic: updateTopicMutation.isPending,
    isDeletingTopic: deleteTopicMutation.isPending,
  };
};
