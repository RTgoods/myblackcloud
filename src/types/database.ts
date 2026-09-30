export type Purchase = {
  id: string
  user_id: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  amount_paid_cents: number | null
  status: 'pending' | 'completed' | 'refunded'
  created_at: string
}

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type LevelStat = {
  totalDischarged: number
  completedAt: string
}

export type Progress = {
  user_id: string
  completed_levels: number[]
  level_stats: Record<string, LevelStat>
  reset_version: number
  updated_at: string
}

export type LeaderboardEntry = {
  id: string
  user_id: string
  display_name: string
  score: number
  level_reached: number
  created_at: string
}

// Full Supabase Database schema — must include Views/Functions/Enums/CompositeTypes
export type Database = {
  public: {
    Tables: {
      purchases: {
        Row: Purchase
        Insert: {
          id?: string
          user_id: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          amount_paid_cents?: number | null
          status?: 'pending' | 'completed' | 'refunded'
          created_at?: string
        }
        Update: {
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          amount_paid_cents?: number | null
          status?: 'pending' | 'completed' | 'refunded'
        }
        Relationships: []
      }
      profiles: {
        Row: Profile
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progress: {
        Row: Progress
        Insert: {
          user_id: string
          completed_levels?: number[]
          level_stats?: Record<string, LevelStat>
          reset_version?: number
          updated_at?: string
        }
        Update: {
          completed_levels?: number[]
          level_stats?: Record<string, LevelStat>
          reset_version?: number
          updated_at?: string
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: LeaderboardEntry
        Insert: {
          id?: string
          user_id: string
          display_name: string
          score: number
          level_reached: number
          created_at?: string
        }
        Update: {
          display_name?: string
          score?: number
          level_reached?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
