export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string | null;
          email: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          email: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          email?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string | null;
          user_id?: string;
        };
      };
      options: {
        Row: {
          id: string;
          created_at: string;
          poll_id: string;
          text: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          poll_id: string;
          text: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          poll_id?: string;
          text?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          poll_id: string;
          option_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          poll_id: string;
          option_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          poll_id?: string;
          option_id?: string;
        };
      };
    };
  };
}