
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DiscussionComment } from '@/types/discussion';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const useDiscussionComments = (topicId: string, courseId?: string, lectureId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['discussionComments', topicId],
    queryFn: async () => {
      // Get comments with profile data
      const { data: commentsData, error } = await supabase
        .from('discussion_comments')
        .select(`
          *,
          user_profile:profiles(username, avatar_url)
        `)
        .eq('topic_id', topicId)
        .order('is_solution', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (!commentsData || commentsData.length === 0) {
        return [];
      }
      
      // Get all comment IDs
      const commentIds = commentsData.map(comment => comment.id);
      
      // Batch fetch vote counts for all comments
      const { data: votesData, error: votesError } = await supabase
        .from('discussion_votes')
        .select('comment_id, vote_type')
        .in('comment_id', commentIds);
        
      if (votesError) throw votesError;
      
      // Get user votes for all comments if user is logged in
      let userVotesData: any[] = [];
      if (user) {
        const { data: userVotes, error: userVotesError } = await supabase
          .from('discussion_votes')
          .select('comment_id, vote_type')
          .in('comment_id', commentIds)
          .eq('user_id', user.id);
            
        if (!userVotesError) {
          userVotesData = userVotes || [];
        }
      }
      
      // Calculate vote counts and add user votes
      const commentsWithMeta = commentsData.map((comment: any) => {
        // Count votes for this comment
        const commentVotes = votesData?.filter(vote => vote.comment_id === comment.id) || [];
        const voteCount = commentVotes.reduce((sum, vote) => sum + vote.vote_type, 0);
        
        // Get user vote for this comment
        const userVote = userVotesData.find(vote => vote.comment_id === comment.id);
        
        return {
          ...comment,
          vote_count: voteCount,
          user_vote: userVote ? userVote.vote_type : 0,
          // Handle nested user profile data
          user_profile: comment.user_profile && comment.user_profile.length > 0 
            ? comment.user_profile[0] 
            : { username: 'Anonymous', avatar_url: null }
        };
      });
      
      return commentsWithMeta;
    },
    enabled: !!topicId,
  });

  // Create a new comment
  const createCommentMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', topicId] });
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
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

  // Update a comment
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', topicId] });
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
    mutationFn: async (commentId: string) => {
      if (!user) throw new Error('User must be logged in');
      
      const { error } = await supabase
        .from('discussion_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { topicId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', topicId] });
      queryClient.invalidateQueries({ queryKey: ['discussionTopics', courseId, lectureId] });
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

  // Mark a comment as solution
  const markCommentSolutionMutation = useMutation({
    mutationFn: async ({ commentId, isSolution }: { commentId: string; isSolution: boolean }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('discussion_comments')
        .update({ is_solution: isSolution, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (isSolution) {
        await supabase
          .from('discussion_topics')
          .update({ solved: true, updated_at: new Date().toISOString() })
          .eq('id', topicId);
      }
      
      return { ...data, topicId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', topicId] });
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

  // Vote on a comment
  const voteCommentMutation = useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: string; voteType: number }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data: existingVote, error: checkError } = await supabase
        .from('discussion_votes')
        .select('id, vote_type')
        .eq('comment_id', commentId)
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
              comment_id: commentId,
              user_id: user.id,
              vote_type: voteType
            });
          
          if (insertError) throw insertError;
        }
      }
      
      return { commentId, topicId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussionComments', topicId] });
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
    comments,
    isCommentsLoading,
    createComment: createCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    markCommentSolution: markCommentSolutionMutation.mutate,
    voteComment: voteCommentMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
  };
};
