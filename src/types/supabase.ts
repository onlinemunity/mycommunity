
// Custom types for Supabase data
// These types complement the auto-generated types without modifying them

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin';
  updated_at?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  students: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  category: string;
  href: string;
  video_url: string | null;
  created_at?: string;
  updated_at?: string;
  // Adding missing properties from the database schema
  details?: string | null;
  allgemein?: string | null;
  zielgruppe?: string | null;
  material?: string | null;
  inhalte?: string | null;
  kursdauer?: string | null;
  zertifikat?: string | null;
};

export type Lecture = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  full_description: string | null;
  material: string | null;
  links: string | null;
  video_url: string | null;
  content: string | null;
  duration: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  completed?: boolean; // Used when merging with lecture_progress
};

export type LectureProgress = {
  id: string;
  user_id: string;
  lecture_id: string;
  completed: boolean;
  last_watched_at: string;
  created_at?: string;
  updated_at?: string;
  lecture?: Lecture;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  course?: Course;
};
