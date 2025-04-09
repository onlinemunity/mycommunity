
import { useState } from 'react';
import { useDiscussionTopics } from './discussion/useDiscussionTopics';
import { useDiscussionComments } from './discussion/useDiscussionComments';
import { DiscussionTopic, DiscussionComment } from '@/types/discussion';

export const useDiscussion = (courseId?: string, lectureId?: string) => {
  const [newTopicForm, setNewTopicForm] = useState({ title: '', content: '' });
  const [newCommentForm, setNewCommentForm] = useState({ content: '' });
  const [editingTopic, setEditingTopic] = useState<DiscussionTopic | null>(null);
  const [editingComment, setEditingComment] = useState<DiscussionComment | null>(null);
  const [replyingToTopic, setReplyingToTopic] = useState<string | null>(null);

  // Get topics from the useDiscussionTopics hook
  const {
    topics,
    isTopicsLoading,
    createTopic,
    updateTopic,
    deleteTopic,
    markTopicSolved,
    voteTopic,
    isCreatingTopic,
    isUpdatingTopic,
    isDeletingTopic,
  } = useDiscussionTopics(courseId, lectureId);

  // Function to get comments for a specific topic
  const getComments = (topicId: string) => {
    const {
      comments,
      isCommentsLoading,
      createComment,
      updateComment,
      deleteComment,
      markCommentSolution,
      voteComment,
      isCreatingComment,
      isUpdatingComment,
      isDeletingComment,
    } = useDiscussionComments(topicId, courseId, lectureId);

    return {
      data: comments,
      isLoading: isCommentsLoading,
      createComment,
      updateComment,
      deleteComment,
      markCommentSolution,
      voteComment,
      isCreatingComment,
      isUpdatingComment,
      isDeletingComment,
    };
  };

  // Return everything needed for the discussion UI
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
    createTopic,
    updateTopic,
    deleteTopic,
    createComment: (data: { topicId: string; content: string }) => {
      const { comments, createComment } = useDiscussionComments(data.topicId, courseId, lectureId);
      createComment({ content: data.content });
    },
    updateComment: (data: { id: string; content: string }) => {
      if (editingComment) {
        const { updateComment } = useDiscussionComments(editingComment.topic_id, courseId, lectureId);
        updateComment({ id: data.id, content: data.content });
      }
    },
    deleteComment: (data: { id: string; topicId: string }) => {
      const { deleteComment } = useDiscussionComments(data.topicId, courseId, lectureId);
      deleteComment(data.id);
    },
    markTopicSolved,
    markCommentSolution: (data: { commentId: string; topicId: string; isSolution: boolean }) => {
      const { markCommentSolution } = useDiscussionComments(data.topicId, courseId, lectureId);
      markCommentSolution({ commentId: data.commentId, isSolution: data.isSolution });
    },
    voteTopic,
    voteComment: (data: { commentId: string; topicId: string; voteType: number }) => {
      const { voteComment } = useDiscussionComments(data.topicId, courseId, lectureId);
      voteComment({ commentId: data.commentId, voteType: data.voteType });
    },
    isCreatingTopic,
    isUpdatingTopic,
    isDeletingTopic,
    isCreatingComment: false,
    isUpdatingComment: false,
    isDeletingComment: false,
  };
};
