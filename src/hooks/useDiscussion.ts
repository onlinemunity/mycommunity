
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DiscussionTopic, DiscussionComment } from '@/types/discussion';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const useDiscussion = (courseId?: string, lectureId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTopicForm, setNewTopicForm] = useState({ title: '', content: '' });
  const [newCommentForm, setNewCommentForm] = useState({ content: '' });
  const [editingTopic, setEditingTopic] = useState<DiscussionTopic | null>(null);
  const [editingComment, setEditingComment] = useState<DiscussionComment | null>(null);
  const [replyingToTopic, setReplyingToTopic] = useState<string | null>(null);

  useEffect(() => {
    console.log('useDiscussion hook initialized with courseId:', courseId, 'lectureId:', lectureId);
  }, [courseId, lectureId]);

  // Get topics based on course or lecture
  const { data: topics = [], isLoading: isTopicsLoading } = useQuery({
    queryKey: ['discussionTopics', courseId, lectureId],
    queryFn: async () => {
      if (!courseId) {
        console.log('No courseId provided, returning empty topics array');
        return [];
      }
      
      console.log('Fetching topics with courseId:', courseId, 'lectureId:', lectureId);
      
      let query = supabase
        .from('discussion_topics')
        .select(`
          *,
          user_profile:profiles!discussion_topics_user_id_fkey(username, avatar_url),
          vote_count:discussion_votes(vote_type)
        `)
        .eq('course_id', courseId);

      if (lectureId) {
        console.log('Adding lecture filter with lectureId:', lectureId);
        query = query.eq('lecture_id', lectureId);
      } else {
        console.log('No lectureId, fetching course-level topics only');
        query = query.is('lecture_id', null);
      }

      query = query.order('pinned', { ascending: false })
                  .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching topics:', error);
        throw error;
      }
      
      console.log('Fetched topics:', data);
      
      // Process the returned data to calculate vote counts
      return data.map((topic: any) => {
        const votes = topic.vote_count || [];
        const voteSum = votes.reduce((sum: number, vote: any) => sum + vote.vote_type, 0);
        
        // Get user's vote if they are logged in
        let userVote = 0;
        if (user) {
          const userVoteObj = votes.find((vote: any) => vote.user_id === user.id);
          userVote = userVoteObj ? userVoteObj.vote_type : 0;
        }
        
        return {
          ...topic,
          vote_count: voteSum,
          user_vote: userVote,
          user_profile: topic.user_profile[0] || { username: 'Unknown', avatar_url: null }
        };
      });
    },
    enabled: !!courseId,
  });

  // Get comments for a specific topic
  const getComments = (topicId: string) => {
    return useQuery({
      queryKey: ['discussionComments', topicId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('discussion_comments')
          .select(`
            *,
            user_profile:profiles!discussion_comments_user_id_fkey(username, avatar_url),
            vote_count:discussion_votes(vote_type)
          `)
          .eq('topic_id', topicId)
          .order('is_solution', { ascending: false })
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // Process the returned data
        return data.map((comment: any) => {
          const votes = comment.vote_count || [];
          const voteSum = votes.reduce((sum: number, vote: any) => sum + vote.vote_type, 0);
          
          // Get user's vote if they are logged in
          let userVote = 0;
          if (user) {
            const userVoteObj = votes.find((vote: any) => vote.user_id === user.id);
            userVote = userVoteObj ? userVoteObj.vote_type : 0;
          }
          
          return {
            ...comment,
            vote_count: voteSum,
            user_vote: userVote,
            user_profile: comment.user_profile[0] || { username: 'Unknown', avatar_url: null }
          };
        });
      },
      enabled: !!topicId,
    });
  };

  // Create a new topic
  const createTopicMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!user || !courseId) throw new Error('User must be logged in and course must be specified');
      
      const topicData = {
        course_id: courseId, // This should be the UUID of the course
        lecture_id: lectureId || null, // This should be the UUID of the lecture if present
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
      
      console.log('Created topic:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
      setNewTopicForm({ title: '', content: '' });
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
      setEditingTopic(null);
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

  // Create a new comment
  const createCommentMutation = useMutation({
    mutationFn: async ({ topicId, content }: { topicId: string; content: string }) => {
      if (!user) throw new Error('User must be logged in');
      
      const commentData = {
        topic_id: topicId,
        user_id: user.id,
        content,
        is_solution: false
      };
      
      const { data, error } = await supabase
        .from('discussion_comments')
        .insert(commentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', variables.topicId] });
      setNewCommentForm({ content: '' });
      setReplyingToTopic(null);
      toast({
        title: "Comment added",
        description: "Your comment has been successfully added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update an existing comment
  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('discussion_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', data.topic_id] });
      setEditingComment(null);
      toast({
        title: "Comment updated",
        description: "Your comment has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating comment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete a comment
  const deleteCommentMutation = useMutation({
    mutationFn: async ({ id, topicId }: { id: string; topicId: string }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { error } = await supabase
        .from('discussion_comments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { topicId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', data.topicId] });
      toast({
        title: "Comment deleted",
        description: "The comment has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting comment",
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

  // Mark a comment as solution
  const markCommentSolutionMutation = useMutation({
    mutationFn: async ({ commentId, topicId, isSolution }: { commentId: string; topicId: string; isSolution: boolean }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('discussion_comments')
        .update({ is_solution: isSolution, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // If marking as solution, also mark the topic as solved
      if (isSolution) {
        await supabase
          .from('discussion_topics')
          .update({ solved: true, updated_at: new Date().toISOString() })
          .eq('id', topicId);
      }
      
      return { ...data, topicId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', data.topicId] });
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
      toast({
        title: "Solution marked",
        description: "The comment has been marked as a solution.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error marking solution",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Vote on a topic
  const voteTopicMutation = useMutation({
    mutationFn: async ({ topicId, voteType }: { topicId: string; voteType: number }) => {
      if (!user) throw new Error('User must be logged in');
      
      // Check if the user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('discussion_votes')
        .select('id, vote_type')
        .eq('topic_id', topicId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If the user clicked the same vote type, remove their vote
      if (existingVote && existingVote.vote_type === voteType) {
        const { error: deleteError } = await supabase
          .from('discussion_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) throw deleteError;
      } 
      // If the user is changing their vote or voting for the first time
      else {
        if (existingVote) {
          // Update existing vote
          const { error: updateError } = await supabase
            .from('discussion_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          
          if (updateError) throw updateError;
        } else {
          // Create new vote
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

  // Vote on a comment
  const voteCommentMutation = useMutation({
    mutationFn: async ({ commentId, topicId, voteType }: { commentId: string; topicId: string; voteType: number }) => {
      if (!user) throw new Error('User must be logged in');
      
      // Check if the user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('discussion_votes')
        .select('id, vote_type')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If the user clicked the same vote type, remove their vote
      if (existingVote && existingVote.vote_type === voteType) {
        const { error: deleteError } = await supabase
          .from('discussion_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) throw deleteError;
      } 
      // If the user is changing their vote or voting for the first time
      else {
        if (existingVote) {
          // Update existing vote
          const { error: updateError } = await supabase
            .from('discussion_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          
          if (updateError) throw updateError;
        } else {
          // Create new vote
          const { error: insertError } = await supabase
            .from('discussion_votes')
            .insert({
              comment_id: commentId,
              user_id: user.id,
              vote_type: voteType
            });
          
          if (insertError) throw insertError;
        }
      }
      
      return { commentId, topicId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', data.topicId] });
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
    createTopic: createTopicMutation.mutate,
    updateTopic: updateTopicMutation.mutate,
    deleteTopic: deleteTopicMutation.mutate,
    createComment: createCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    markTopicSolved: markTopicSolvedMutation.mutate,
    markCommentSolution: markCommentSolutionMutation.mutate,
    voteTopic: voteTopicMutation.mutate,
    voteComment: voteCommentMutation.mutate,
    isCreatingTopic: createTopicMutation.isPending,
    isUpdatingTopic: updateTopicMutation.isPending,
    isDeletingTopic: deleteTopicMutation.isPending,
    isCreatingComment: createCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending
  };
};
