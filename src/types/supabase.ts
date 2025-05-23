
// Custom types for Supabase data
// These types complement the auto-generated types without modifying them

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin';
  updated_at?: string;
  user_type?: 'basic' | 'premium' | 'pro' | null;
  membership_expires_at?: string | null;
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
  course_type?: 'basic' | 'premium' | null;
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

export type CartItem = {
  id: string;
  type: 'premium_membership' | 'pro_membership';
  price: number;
  name: string;
  description?: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'paid' | 'completed' | 'cancelled';
  total_amount: number;
  payment_method?: string | null;
  created_at: string;
  updated_at: string;
  membership_type?: 'basic' | 'premium' | 'pro' | null;
  invoice_number?: string | null;
  billing_name?: string | null;
  billing_email?: string | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_zip?: string | null;
  billing_country?: string | null;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  item_type: 'premium_membership' | 'pro_membership';
  price: number;
  created_at: string;
};
