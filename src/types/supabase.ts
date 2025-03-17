
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
  created_at?: string;
  updated_at?: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  course?: Course;
};
