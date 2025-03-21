
export type DiscussionTopic = {
  id: string;
  course_id: string;
  lecture_id?: string | null;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  solved: boolean;
  // Computed fields
  user_profile?: {
    username: string;
    avatar_url: string | null;
  };
  vote_count?: number;
  comment_count?: number;
  user_vote?: number;
};

export type DiscussionComment = {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_solution: boolean;
  // Computed fields
  user_profile?: {
    username: string;
    avatar_url: string | null;
  };
  vote_count?: number;
  user_vote?: number;
};

export type DiscussionVote = {
  id: string;
  user_id: string;
  topic_id?: string | null;
  comment_id?: string | null;
  vote_type: number;
  created_at: string;
};
