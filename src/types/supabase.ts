
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
