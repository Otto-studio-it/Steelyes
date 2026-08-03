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
      fencing_panels: {
        Row: {
          base_price_gbp: number
          created_at: string
          finish: string
          id: string
          notes: string | null
          price_per_m2_gbp: number
          style: Database["public"]["Enums"]["gate_style"]
          updated_at: string
        }
        Insert: {
          base_price_gbp?: number
          created_at?: string
          finish?: string
          id?: string
          notes?: string | null
          price_per_m2_gbp?: number
          style: Database["public"]["Enums"]["gate_style"]
          updated_at?: string
        }
        Update: {
          base_price_gbp?: number
          created_at?: string
          finish?: string
          id?: string
          notes?: string | null
          price_per_m2_gbp?: number
          style?: Database["public"]["Enums"]["gate_style"]
          updated_at?: string
        }
        Relationships: []
      }
      gate_options: {
        Row: {
          created_at: string
          flat_price_gbp: number
          id: string
          name: string
          notes: string | null
          per_unit_price_gbp: number | null
          slug: string
          unit_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          flat_price_gbp?: number
          id?: string
          name: string
          notes?: string | null
          per_unit_price_gbp?: number | null
          slug: string
          unit_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          flat_price_gbp?: number
          id?: string
          name?: string
          notes?: string | null
          per_unit_price_gbp?: number | null
          slug?: string
          unit_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gates: {
        Row: {
          base_price_auto_gbp: number | null
          base_price_manual_gbp: number
          created_at: string
          finish: string
          id: string
          min_height_mm: number
          min_width_mm: number
          name: string
          style: Database["public"]["Enums"]["gate_style"]
          type: Database["public"]["Enums"]["gate_type"]
          updated_at: string
        }
        Insert: {
          base_price_auto_gbp?: number | null
          base_price_manual_gbp?: number
          created_at?: string
          finish?: string
          id?: string
          min_height_mm?: number
          min_width_mm?: number
          name?: string
          style: Database["public"]["Enums"]["gate_style"]
          type: Database["public"]["Enums"]["gate_type"]
          updated_at?: string
        }
        Update: {
          base_price_auto_gbp?: number | null
          base_price_manual_gbp?: number
          created_at?: string
          finish?: string
          id?: string
          min_height_mm?: number
          min_width_mm?: number
          name?: string
          style?: Database["public"]["Enums"]["gate_style"]
          type?: Database["public"]["Enums"]["gate_type"]
          updated_at?: string
        }
        Relationships: []
      }
      client_intake_answers: {
        Row: {
          id: string
          session_id: string
          question_id: string
          section: string
          value_json: Json | null
          status: string
          source: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          section: string
          value_json?: Json | null
          status?: string
          source?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          section?: string
          value_json?: Json | null
          status?: string
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_intake_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "client_intake_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_intake_answer_history: {
        Row: {
          id: string
          answer_id: string
          session_id: string
          question_id: string
          section: string
          value_json: Json | null
          status: string
          source: string
          change_kind: string
          changed_at: string
        }
        Insert: {
          id?: string
          answer_id: string
          session_id: string
          question_id: string
          section: string
          value_json?: Json | null
          status: string
          source: string
          change_kind: string
          changed_at?: string
        }
        Update: {
          id?: string
          answer_id?: string
          session_id?: string
          question_id?: string
          section?: string
          value_json?: Json | null
          status?: string
          source?: string
          change_kind?: string
          changed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_intake_answer_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "client_intake_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_intake_events: {
        Row: {
          id: string
          session_id: string
          event_type: string
          actor: string
          question_id: string | null
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          event_type: string
          actor: string
          question_id?: string | null
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          event_type?: string
          actor?: string
          question_id?: string | null
          meta?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_intake_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "client_intake_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_intake_sessions: {
        Row: {
          id: string
          access_token: string
          client_name: string
          status: string
          created_at: string
          updated_at: string
          last_client_activity_at: string | null
          last_notified_at: string | null
        }
        Insert: {
          id?: string
          access_token: string
          client_name?: string
          status?: string
          created_at?: string
          updated_at?: string
          last_client_activity_at?: string | null
          last_notified_at?: string | null
        }
        Update: {
          id?: string
          access_token?: string
          client_name?: string
          status?: string
          created_at?: string
          updated_at?: string
          last_client_activity_at?: string | null
          last_notified_at?: string | null
        }
        Relationships: []
      }
      design_captures: {
        Row: {
          configuration_id: string | null
          created_at: string
          email: string
          id: string
          reminder_sent_at: string | null
          share_token: string
        }
        Insert: {
          configuration_id?: string | null
          created_at?: string
          email: string
          id?: string
          reminder_sent_at?: string | null
          share_token: string
        }
        Update: {
          configuration_id?: string | null
          created_at?: string
          email?: string
          id?: string
          reminder_sent_at?: string | null
          share_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_captures_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          postcode: string | null
          project_type: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          postcode?: string | null
          project_type?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          postcode?: string | null
          project_type?: string | null
          status?: string
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
          phone: string | null
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
          phone?: string | null
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
          phone?: string | null
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
      gate_style: "modern" | "classic" | "privacy" | "victorian"
      gate_type:
        | "double-swing"
        | "sliding"
        | "bifolding"
        | "cantilevered"
        | "sliding-radius"
        | "telescopic"
        | "single-swing"
        | "bifolding-single"
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
      gate_style: ["modern", "classic", "privacy", "victorian"],
      gate_type: [
        "double-swing",
        "sliding",
        "bifolding",
        "cantilevered",
        "sliding-radius",
        "telescopic",
        "single-swing",
        "bifolding-single",
      ],
      quote_status: ["new", "contacted", "quote_sent", "won", "lost"],
    },
  },
} as const
