Initialising login role...
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_audit: {
        Row: {
          action: string
          admin_email: string
          created_at: string
          details: Json | null
          entity: string
          entity_id: string
          id: string
        }
        Insert: {
          action: string
          admin_email: string
          created_at?: string
          details?: Json | null
          entity: string
          entity_id: string
          id?: string
        }
        Update: {
          action?: string
          admin_email?: string
          created_at?: string
          details?: Json | null
          entity?: string
          entity_id?: string
          id?: string
        }
        Relationships: []
      }
      configurations: {
        Row: {
          ar_model_key: string | null
          created_at: string
          gate_type: Database["public"]["Enums"]["gate_type"]
          id: string
          parameters: Json
          share_token: string
          updated_at: string
        }
        Insert: {
          ar_model_key?: string | null
          created_at?: string
          gate_type: Database["public"]["Enums"]["gate_type"]
          id?: string
          parameters: Json
          share_token: string
          updated_at?: string
        }
        Update: {
          ar_model_key?: string | null
          created_at?: string
          gate_type?: Database["public"]["Enums"]["gate_type"]
          id?: string
          parameters?: Json
          share_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      gates: {
        Row: {
          base_price_per_m2: number
          created_at: string
          finish_multipliers: Json
          id: string
          motor_surcharge: number | null
          style: Database["public"]["Enums"]["gate_style"]
          tube_multipliers: Json
          type: Database["public"]["Enums"]["gate_type"]
          updated_at: string
        }
        Insert: {
          base_price_per_m2: number
          created_at?: string
          finish_multipliers?: Json
          id?: string
          motor_surcharge?: number | null
          style: Database["public"]["Enums"]["gate_style"]
          tube_multipliers?: Json
          type: Database["public"]["Enums"]["gate_type"]
          updated_at?: string
        }
        Update: {
          base_price_per_m2?: number
          created_at?: string
          finish_multipliers?: Json
          id?: string
          motor_surcharge?: number | null
          style?: Database["public"]["Enums"]["gate_style"]
          tube_multipliers?: Json
          type?: Database["public"]["Enums"]["gate_type"]
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          admin_notes: string | null
          configuration_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          postcode: string
          status: Database["public"]["Enums"]["quote_status"]
          turnstile_verified: boolean
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          configuration_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          postcode: string
          status?: Database["public"]["Enums"]["quote_status"]
          turnstile_verified?: boolean
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          configuration_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          postcode?: string
          status?: Database["public"]["Enums"]["quote_status"]
          turnstile_verified?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_zones: {
        Row: {
          created_at: string
          id: string
          postcode_prefix: string
          surcharge: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          postcode_prefix: string
          surcharge?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          postcode_prefix?: string
          surcharge?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gate_style: "modern" | "classic" | "privacy"
      gate_type:
        | "double-swing"
        | "sliding"
        | "bifolding"
        | "cantilevered"
        | "sliding-radius"
        | "telescopic"
      quote_status: "new" | "contacted" | "quote_sent" | "won" | "lost"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      gate_style: ["modern", "classic", "privacy"],
      gate_type: [
        "double-swing",
        "sliding",
        "bifolding",
        "cantilevered",
        "sliding-radius",
        "telescopic",
      ],
      quote_status: ["new", "contacted", "quote_sent", "won", "lost"],
    },
  },
} as const
A new version of Supabase CLI is available: v2.90.0 (currently installed v2.75.0)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
