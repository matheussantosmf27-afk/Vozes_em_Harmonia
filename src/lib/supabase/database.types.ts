// GERADO por scripts/generate-db-types.sh a partir das migrations — não edite à mão.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          slug: string;
          title: string;
          description: string;
          icon: string;
          points: number;
          sort: number;
        };
        Insert: {
          slug: string;
          title: string;
          description: string;
          icon?: string;
          points?: number;
          sort?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string;
          icon?: string;
          points?: number;
          sort?: number;
        };
        Relationships: [
        ];
      };
      arrangement_assignments: {
        Row: {
          id: string;
          vocal_part_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["assignment_status"];
          assigned_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vocal_part_id: string;
          user_id: string;
          status?: Database["public"]["Enums"]["assignment_status"];
          assigned_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vocal_part_id?: string;
          user_id?: string;
          status?: Database["public"]["Enums"]["assignment_status"];
          assigned_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "arrangement_assignments_vocal_part_id_fkey"; columns: ["vocal_part_id"]; isOneToOne: false; referencedRelation: "vocal_parts"; referencedColumns: ["id"] },
          { foreignKeyName: "arrangement_assignments_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "arrangement_assignments_assigned_by_fkey"; columns: ["assigned_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      arrangements: {
        Row: {
          id: string;
          repertoire_id: string;
          slug: string | null;
          title: string;
          formation: string;
          key_name: string | null;
          tempo_bpm: number;
          beats_per_measure: number;
          harmony_level: number | null;
          description: string;
          study_tips: string;
          source: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          repertoire_id: string;
          slug?: string | null;
          title: string;
          formation?: string;
          key_name?: string | null;
          tempo_bpm?: number;
          beats_per_measure?: number;
          harmony_level?: number | null;
          description?: string;
          study_tips?: string;
          source?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          repertoire_id?: string;
          slug?: string | null;
          title?: string;
          formation?: string;
          key_name?: string | null;
          tempo_bpm?: number;
          beats_per_measure?: number;
          harmony_level?: number | null;
          description?: string;
          study_tips?: string;
          source?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "arrangements_repertoire_id_fkey"; columns: ["repertoire_id"]; isOneToOne: false; referencedRelation: "repertoire"; referencedColumns: ["id"] },
          { foreignKeyName: "arrangements_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      exercise_attempts: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          score: number;
          correct_count: number;
          total_count: number;
          difficulty_level: number | null;
          duration_ms: number | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          score: number;
          correct_count?: number;
          total_count?: number;
          difficulty_level?: number | null;
          duration_ms?: number | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          score?: number;
          correct_count?: number;
          total_count?: number;
          difficulty_level?: number | null;
          duration_ms?: number | null;
          details?: Json;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "exercise_attempts_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "exercise_attempts_exercise_id_fkey"; columns: ["exercise_id"]; isOneToOne: false; referencedRelation: "exercises"; referencedColumns: ["id"] },
        ];
      };
      exercises: {
        Row: {
          id: string;
          slug: string;
          lesson_id: string | null;
          title: string;
          instructions: string;
          type: string;
          config: Json;
          skill_slug: string;
          purpose: string;
          difficulty: number;
          sort: number;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          lesson_id?: string | null;
          title: string;
          instructions?: string;
          type: string;
          config?: Json;
          skill_slug: string;
          purpose?: string;
          difficulty?: number;
          sort?: number;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          lesson_id?: string | null;
          title?: string;
          instructions?: string;
          type?: string;
          config?: Json;
          skill_slug?: string;
          purpose?: string;
          difficulty?: number;
          sort?: number;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "exercises_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
          { foreignKeyName: "exercises_skill_slug_fkey"; columns: ["skill_slug"]; isOneToOne: false; referencedRelation: "skills"; referencedColumns: ["slug"] },
          { foreignKeyName: "exercises_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      group_members: {
        Row: {
          group_id: string;
          user_id: string;
          part_label: string | null;
          created_at: string;
        };
        Insert: {
          group_id: string;
          user_id: string;
          part_label?: string | null;
          created_at?: string;
        };
        Update: {
          group_id?: string;
          user_id?: string;
          part_label?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "group_members_group_id_fkey"; columns: ["group_id"]; isOneToOne: false; referencedRelation: "vocal_groups"; referencedColumns: ["id"] },
          { foreignKeyName: "group_members_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      learning_paths: {
        Row: {
          id: string;
          slug: string;
          code: string;
          title: string;
          subtitle: string;
          description: string;
          icon: string;
          sort: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          code: string;
          title: string;
          subtitle?: string;
          description?: string;
          icon?: string;
          sort?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          code?: string;
          title?: string;
          subtitle?: string;
          description?: string;
          icon?: string;
          sort?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      lesson_skills: {
        Row: {
          lesson_id: string;
          skill_slug: string;
        };
        Insert: {
          lesson_id: string;
          skill_slug: string;
        };
        Update: {
          lesson_id?: string;
          skill_slug?: string;
        };
        Relationships: [
          { foreignKeyName: "lesson_skills_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
          { foreignKeyName: "lesson_skills_skill_slug_fkey"; columns: ["skill_slug"]; isOneToOne: false; referencedRelation: "skills"; referencedColumns: ["slug"] },
        ];
      };
      lessons: {
        Row: {
          id: string;
          path_id: string;
          slug: string;
          title: string;
          summary: string;
          sort: number;
          level: number;
          estimated_minutes: number;
          content: Json;
          pass_threshold: number;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          path_id: string;
          slug: string;
          title: string;
          summary?: string;
          sort?: number;
          level?: number;
          estimated_minutes?: number;
          content: Json;
          pass_threshold?: number;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          path_id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          sort?: number;
          level?: number;
          estimated_minutes?: number;
          content?: Json;
          pass_threshold?: number;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "lessons_path_id_fkey"; columns: ["path_id"]; isOneToOne: false; referencedRelation: "learning_paths"; referencedColumns: ["id"] },
          { foreignKeyName: "lessons_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      media_assets: {
        Row: {
          id: string;
          owner_id: string | null;
          bucket: string;
          path: string;
          kind: Database["public"]["Enums"]["media_kind"];
          title: string;
          mime_type: string | null;
          size_bytes: number | null;
          repertoire_id: string | null;
          arrangement_id: string | null;
          vocal_part_id: string | null;
          rehearsal_id: string | null;
          license_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          bucket: string;
          path: string;
          kind: Database["public"]["Enums"]["media_kind"];
          title: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          repertoire_id?: string | null;
          arrangement_id?: string | null;
          vocal_part_id?: string | null;
          rehearsal_id?: string | null;
          license_note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          bucket?: string;
          path?: string;
          kind?: Database["public"]["Enums"]["media_kind"];
          title?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          repertoire_id?: string | null;
          arrangement_id?: string | null;
          vocal_part_id?: string | null;
          rehearsal_id?: string | null;
          license_note?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "media_assets_arrangement_id_fkey"; columns: ["arrangement_id"]; isOneToOne: false; referencedRelation: "arrangements"; referencedColumns: ["id"] },
          { foreignKeyName: "media_assets_vocal_part_id_fkey"; columns: ["vocal_part_id"]; isOneToOne: false; referencedRelation: "vocal_parts"; referencedColumns: ["id"] },
          { foreignKeyName: "media_assets_rehearsal_id_fkey"; columns: ["rehearsal_id"]; isOneToOne: false; referencedRelation: "rehearsal_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "media_assets_owner_id_fkey"; columns: ["owner_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "media_assets_repertoire_id_fkey"; columns: ["repertoire_id"]; isOneToOne: false; referencedRelation: "repertoire"; referencedColumns: ["id"] },
        ];
      };
      practice_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          arrangement_id: string;
          start_measure: number;
          end_measure: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          arrangement_id: string;
          start_measure: number;
          end_measure: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          arrangement_id?: string;
          start_measure?: number;
          end_measure?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "practice_bookmarks_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "practice_bookmarks_arrangement_id_fkey"; columns: ["arrangement_id"]; isOneToOne: false; referencedRelation: "arrangements"; referencedColumns: ["id"] },
        ];
      };
      practice_goals: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          title: string;
          description: string;
          horizon_weeks: number;
          skill_slug: string | null;
          target_level: number | null;
          due_on: string | null;
          status: Database["public"]["Enums"]["goal_status"];
          progress_note: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          title: string;
          description?: string;
          horizon_weeks: number;
          skill_slug?: string | null;
          target_level?: number | null;
          due_on?: string | null;
          status?: Database["public"]["Enums"]["goal_status"];
          progress_note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          title?: string;
          description?: string;
          horizon_weeks?: number;
          skill_slug?: string | null;
          target_level?: number | null;
          due_on?: string | null;
          status?: Database["public"]["Enums"]["goal_status"];
          progress_note?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "practice_goals_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "practice_goals_plan_id_fkey"; columns: ["plan_id"]; isOneToOne: false; referencedRelation: "study_plans"; referencedColumns: ["id"] },
          { foreignKeyName: "practice_goals_skill_slug_fkey"; columns: ["skill_slug"]; isOneToOne: false; referencedRelation: "skills"; referencedColumns: ["slug"] },
          { foreignKeyName: "practice_goals_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      practice_logs: {
        Row: {
          id: string;
          user_id: string;
          practiced_on: string;
          minutes: number;
          activity: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          practiced_on?: string;
          minutes: number;
          activity: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          practiced_on?: string;
          minutes?: number;
          activity?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "practice_logs_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          display_name: string | null;
          is_active: boolean;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          display_name?: string | null;
          is_active?: boolean;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          display_name?: string | null;
          is_active?: boolean;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
      rehearsal_attendance: {
        Row: {
          rehearsal_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["attendance_status"];
          note: string | null;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: {
          rehearsal_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["attendance_status"];
          note?: string | null;
          recorded_by?: string | null;
          created_at?: string;
        };
        Update: {
          rehearsal_id?: string;
          user_id?: string;
          status?: Database["public"]["Enums"]["attendance_status"];
          note?: string | null;
          recorded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "rehearsal_attendance_rehearsal_id_fkey"; columns: ["rehearsal_id"]; isOneToOne: false; referencedRelation: "rehearsal_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_attendance_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_attendance_recorded_by_fkey"; columns: ["recorded_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      rehearsal_notes: {
        Row: {
          id: string;
          rehearsal_id: string;
          author_id: string | null;
          kind: string;
          content: string;
          visible_to_members: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          rehearsal_id: string;
          author_id?: string | null;
          kind?: string;
          content: string;
          visible_to_members?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          rehearsal_id?: string;
          author_id?: string | null;
          kind?: string;
          content?: string;
          visible_to_members?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "rehearsal_notes_rehearsal_id_fkey"; columns: ["rehearsal_id"]; isOneToOne: false; referencedRelation: "rehearsal_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_notes_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      rehearsal_repertoire: {
        Row: {
          rehearsal_id: string;
          repertoire_id: string;
          sort: number;
          focus: string | null;
        };
        Insert: {
          rehearsal_id: string;
          repertoire_id: string;
          sort?: number;
          focus?: string | null;
        };
        Update: {
          rehearsal_id?: string;
          repertoire_id?: string;
          sort?: number;
          focus?: string | null;
        };
        Relationships: [
          { foreignKeyName: "rehearsal_repertoire_rehearsal_id_fkey"; columns: ["rehearsal_id"]; isOneToOne: false; referencedRelation: "rehearsal_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_repertoire_repertoire_id_fkey"; columns: ["repertoire_id"]; isOneToOne: false; referencedRelation: "repertoire"; referencedColumns: ["id"] },
        ];
      };
      rehearsal_sessions: {
        Row: {
          id: string;
          title: string;
          starts_at: string;
          duration_minutes: number;
          location: string | null;
          group_id: string | null;
          objectives: string;
          agenda: Json;
          status: Database["public"]["Enums"]["rehearsal_status"];
          summary_learned: string | null;
          summary_revisit: string | null;
          summary_next: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          starts_at: string;
          duration_minutes?: number;
          location?: string | null;
          group_id?: string | null;
          objectives?: string;
          agenda?: Json;
          status?: Database["public"]["Enums"]["rehearsal_status"];
          summary_learned?: string | null;
          summary_revisit?: string | null;
          summary_next?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          starts_at?: string;
          duration_minutes?: number;
          location?: string | null;
          group_id?: string | null;
          objectives?: string;
          agenda?: Json;
          status?: Database["public"]["Enums"]["rehearsal_status"];
          summary_learned?: string | null;
          summary_revisit?: string | null;
          summary_next?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "rehearsal_sessions_group_id_fkey"; columns: ["group_id"]; isOneToOne: false; referencedRelation: "vocal_groups"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_sessions_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      rehearsal_tasks: {
        Row: {
          id: string;
          rehearsal_id: string | null;
          assignee_id: string | null;
          title: string;
          description: string;
          due_on: string | null;
          done_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rehearsal_id?: string | null;
          assignee_id?: string | null;
          title: string;
          description?: string;
          due_on?: string | null;
          done_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          rehearsal_id?: string | null;
          assignee_id?: string | null;
          title?: string;
          description?: string;
          due_on?: string | null;
          done_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "rehearsal_tasks_rehearsal_id_fkey"; columns: ["rehearsal_id"]; isOneToOne: false; referencedRelation: "rehearsal_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_tasks_assignee_id_fkey"; columns: ["assignee_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "rehearsal_tasks_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      repertoire: {
        Row: {
          id: string;
          title: string;
          composer: string | null;
          lyricist: string | null;
          source: string | null;
          copyright_info: string;
          license_status: Database["public"]["Enums"]["license_status"];
          original_key: string | null;
          group_key: string | null;
          tempo_bpm: number | null;
          time_signature: string | null;
          lyrics: string | null;
          chords: string | null;
          difficulty: number;
          categories: string[];
          formation: string;
          voices_required: number;
          director_notes: string | null;
          status: Database["public"]["Enums"]["repertoire_status"];
          is_demo: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          composer?: string | null;
          lyricist?: string | null;
          source?: string | null;
          copyright_info?: string;
          license_status?: Database["public"]["Enums"]["license_status"];
          original_key?: string | null;
          group_key?: string | null;
          tempo_bpm?: number | null;
          time_signature?: string | null;
          lyrics?: string | null;
          chords?: string | null;
          difficulty?: number;
          categories?: string[];
          formation?: string;
          voices_required?: number;
          director_notes?: string | null;
          status?: Database["public"]["Enums"]["repertoire_status"];
          is_demo?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          composer?: string | null;
          lyricist?: string | null;
          source?: string | null;
          copyright_info?: string;
          license_status?: Database["public"]["Enums"]["license_status"];
          original_key?: string | null;
          group_key?: string | null;
          tempo_bpm?: number | null;
          time_signature?: string | null;
          lyrics?: string | null;
          chords?: string | null;
          difficulty?: number;
          categories?: string[];
          formation?: string;
          voices_required?: number;
          director_notes?: string | null;
          status?: Database["public"]["Enums"]["repertoire_status"];
          is_demo?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "repertoire_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      skill_mastery: {
        Row: {
          user_id: string;
          skill_slug: string;
          auto_level: number;
          teacher_level: number | null;
          level: number | null;
          evidence: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          skill_slug: string;
          auto_level?: number;
          teacher_level?: number | null;
          level?: never;
          evidence?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          skill_slug?: string;
          auto_level?: number;
          teacher_level?: number | null;
          level?: never;
          evidence?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "skill_mastery_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "skill_mastery_skill_slug_fkey"; columns: ["skill_slug"]; isOneToOne: false; referencedRelation: "skills"; referencedColumns: ["slug"] },
          { foreignKeyName: "skill_mastery_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      skills: {
        Row: {
          slug: string;
          name: string;
          category: string;
          description: string;
          criteria: Json;
          auto_max_level: number;
          sort: number;
        };
        Insert: {
          slug: string;
          name: string;
          category: string;
          description: string;
          criteria?: Json;
          auto_max_level?: number;
          sort?: number;
        };
        Update: {
          slug?: string;
          name?: string;
          category?: string;
          description?: string;
          criteria?: Json;
          auto_max_level?: number;
          sort?: number;
        };
        Relationships: [
        ];
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string | null;
          objective: string;
          priority_skills: string[];
          recommended_lessons: string[];
          daily_exercises: Json;
          weekly_frequency: number;
          minutes_per_session: number;
          review_every_weeks: number;
          completion_criteria: string;
          next_level: string;
          rationale: Json;
          is_current: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id?: string | null;
          objective: string;
          priority_skills?: string[];
          recommended_lessons?: string[];
          daily_exercises?: Json;
          weekly_frequency?: number;
          minutes_per_session?: number;
          review_every_weeks?: number;
          completion_criteria?: string;
          next_level?: string;
          rationale?: Json;
          is_current?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_id?: string | null;
          objective?: string;
          priority_skills?: string[];
          recommended_lessons?: string[];
          daily_exercises?: Json;
          weekly_frequency?: number;
          minutes_per_session?: number;
          review_every_weeks?: number;
          completion_criteria?: string;
          next_level?: string;
          rationale?: Json;
          is_current?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "study_plans_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "study_plans_assessment_id_fkey"; columns: ["assessment_id"]; isOneToOne: false; referencedRelation: "vocal_assessments"; referencedColumns: ["id"] },
          { foreignKeyName: "study_plans_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      teacher_observations: {
        Row: {
          id: string;
          user_id: string;
          author_id: string | null;
          category: string;
          content: string;
          visible_to_member: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author_id?: string | null;
          category?: string;
          content: string;
          visible_to_member?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          author_id?: string | null;
          category?: string;
          content?: string;
          visible_to_member?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "teacher_observations_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "teacher_observations_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      user_achievements: {
        Row: {
          user_id: string;
          achievement_slug: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          achievement_slug: string;
          earned_at?: string;
        };
        Update: {
          user_id?: string;
          achievement_slug?: string;
          earned_at?: string;
        };
        Relationships: [
          { foreignKeyName: "user_achievements_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "user_achievements_achievement_slug_fkey"; columns: ["achievement_slug"]; isOneToOne: false; referencedRelation: "achievements"; referencedColumns: ["slug"] },
        ];
      };
      user_progress: {
        Row: {
          user_id: string;
          lesson_id: string;
          status: Database["public"]["Enums"]["lesson_status"];
          best_score: number | null;
          started_at: string;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          status?: Database["public"]["Enums"]["lesson_status"];
          best_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          lesson_id?: string;
          status?: Database["public"]["Enums"]["lesson_status"];
          best_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "user_progress_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "user_progress_lesson_id_fkey"; columns: ["lesson_id"]; isOneToOne: false; referencedRelation: "lessons"; referencedColumns: ["id"] },
        ];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          granted_by: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          granted_by?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          granted_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "user_roles_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "user_roles_granted_by_fkey"; columns: ["granted_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      vocal_assessments: {
        Row: {
          id: string;
          user_id: string;
          kind: Database["public"]["Enums"]["assessment_kind"];
          assessed_by: string | null;
          questionnaire: Json;
          test_results: Json;
          range_low_midi: number | null;
          range_high_midi: number | null;
          comfortable_low_midi: number | null;
          comfortable_high_midi: number | null;
          range_confidence: string | null;
          suggested_classification: Database["public"]["Enums"]["voice_classification"] | null;
          report: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind?: Database["public"]["Enums"]["assessment_kind"];
          assessed_by?: string | null;
          questionnaire?: Json;
          test_results?: Json;
          range_low_midi?: number | null;
          range_high_midi?: number | null;
          comfortable_low_midi?: number | null;
          comfortable_high_midi?: number | null;
          range_confidence?: string | null;
          suggested_classification?: Database["public"]["Enums"]["voice_classification"] | null;
          report?: Json;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kind?: Database["public"]["Enums"]["assessment_kind"];
          assessed_by?: string | null;
          questionnaire?: Json;
          test_results?: Json;
          range_low_midi?: number | null;
          range_high_midi?: number | null;
          comfortable_low_midi?: number | null;
          comfortable_high_midi?: number | null;
          range_confidence?: string | null;
          suggested_classification?: Database["public"]["Enums"]["voice_classification"] | null;
          report?: Json;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "vocal_assessments_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "vocal_assessments_assessed_by_fkey"; columns: ["assessed_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      vocal_classifications: {
        Row: {
          id: string;
          user_id: string;
          classification: Database["public"]["Enums"]["voice_classification"];
          status: Database["public"]["Enums"]["classification_status"];
          comfortable_low_midi: number | null;
          comfortable_high_midi: number | null;
          range_low_midi: number | null;
          range_high_midi: number | null;
          tessitura_low_midi: number | null;
          tessitura_high_midi: number | null;
          passaggio: string | null;
          notes: string | null;
          assessment_id: string | null;
          classified_by: string | null;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          classification?: Database["public"]["Enums"]["voice_classification"];
          status?: Database["public"]["Enums"]["classification_status"];
          comfortable_low_midi?: number | null;
          comfortable_high_midi?: number | null;
          range_low_midi?: number | null;
          range_high_midi?: number | null;
          tessitura_low_midi?: number | null;
          tessitura_high_midi?: number | null;
          passaggio?: string | null;
          notes?: string | null;
          assessment_id?: string | null;
          classified_by?: string | null;
          is_current?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          classification?: Database["public"]["Enums"]["voice_classification"];
          status?: Database["public"]["Enums"]["classification_status"];
          comfortable_low_midi?: number | null;
          comfortable_high_midi?: number | null;
          range_low_midi?: number | null;
          range_high_midi?: number | null;
          tessitura_low_midi?: number | null;
          tessitura_high_midi?: number | null;
          passaggio?: string | null;
          notes?: string | null;
          assessment_id?: string | null;
          classified_by?: string | null;
          is_current?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "vocal_classifications_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "vocal_classifications_assessment_id_fkey"; columns: ["assessment_id"]; isOneToOne: false; referencedRelation: "vocal_assessments"; referencedColumns: ["id"] },
          { foreignKeyName: "vocal_classifications_classified_by_fkey"; columns: ["classified_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      vocal_groups: {
        Row: {
          id: string;
          name: string;
          kind: Database["public"]["Enums"]["group_kind"];
          description: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          kind: Database["public"]["Enums"]["group_kind"];
          description?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          kind?: Database["public"]["Enums"]["group_kind"];
          description?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "vocal_groups_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      vocal_parts: {
        Row: {
          id: string;
          arrangement_id: string;
          name: string;
          short_name: string;
          sort: number;
          range_low_midi: number | null;
          range_high_midi: number | null;
          notes: Json;
          suggested_voices: Database["public"]["Enums"]["voice_classification"][];
          created_at: string;
        };
        Insert: {
          id?: string;
          arrangement_id: string;
          name: string;
          short_name?: string;
          sort?: number;
          range_low_midi?: number | null;
          range_high_midi?: number | null;
          notes?: Json;
          suggested_voices?: Database["public"]["Enums"]["voice_classification"][];
          created_at?: string;
        };
        Update: {
          id?: string;
          arrangement_id?: string;
          name?: string;
          short_name?: string;
          sort?: number;
          range_low_midi?: number | null;
          range_high_midi?: number | null;
          notes?: Json;
          suggested_voices?: Database["public"]["Enums"]["voice_classification"][];
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "vocal_parts_arrangement_id_fkey"; columns: ["arrangement_id"]; isOneToOne: false; referencedRelation: "arrangements"; referencedColumns: ["id"] },
        ];
      };
      vocal_ranges: {
        Row: {
          id: string;
          user_id: string;
          low_midi: number;
          high_midi: number;
          comfortable_low_midi: number | null;
          comfortable_high_midi: number | null;
          source: string;
          confidence: string;
          measured_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          low_midi: number;
          high_midi: number;
          comfortable_low_midi?: number | null;
          comfortable_high_midi?: number | null;
          source: string;
          confidence?: string;
          measured_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          low_midi?: number;
          high_midi?: number;
          comfortable_low_midi?: number | null;
          comfortable_high_midi?: number | null;
          source?: string;
          confidence?: string;
          measured_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "vocal_ranges_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "vocal_ranges_measured_by_fkey"; columns: ["measured_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      activity_dates: { Args: { p_user: string }; Returns: { d: string }[] };
      award_achievements: { Args: { p_user: string }; Returns: undefined };
      collective_challenge: { Args: Record<PropertyKey, never>; Returns: { week_start: string; active_member_days: number; target: number; participants: number; active_members: number }[] };
      compute_auto_level: { Args: { p_user: string; p_skill: string }; Returns: number };
      current_streak: { Args: { p_user: string }; Returns: number };
      delete_my_account: { Args: Record<PropertyKey, never>; Returns: undefined };
      has_role: { Args: { r: Database["public"]["Enums"]["app_role"] }; Returns: boolean };
      has_teacher_classification: { Args: { p_user: string }; Returns: boolean };
      is_active_member: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_director: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_staff: { Args: Record<PropertyKey, never>; Returns: boolean };
      local_date: { Args: { ts: string }; Returns: string };
      member_stats: { Args: { p_user: string }; Returns: { points: number; streak_days: number; active_days_7: number; attempts_total: number; lessons_completed: number; achievements_count: number; practice_minutes_7: number }[] };
      refresh_lesson_progress: { Args: { p_user: string; p_lesson: string }; Returns: undefined };
      refresh_skill_mastery: { Args: { p_user: string; p_skill: string }; Returns: undefined };
    };
    Enums: {
      app_role: "integrante" | "professor" | "diretor";
      assessment_kind: "inicial" | "periodica" | "professor";
      assignment_status: "designado" | "estudando" | "pronto";
      attendance_status: "presente" | "ausente" | "justificado";
      classification_status: "provisoria" | "em_desenvolvimento" | "confirmada";
      goal_status: "ativa" | "concluida" | "pausada" | "cancelada";
      group_kind: "coral" | "quarteto" | "pequeno_grupo" | "equipe_louvor" | "turma";
      lesson_status: "em_andamento" | "concluida";
      license_status: "dominio_publico" | "composicao_propria" | "licenciado" | "material_original_plataforma" | "autorizacao_pendente";
      media_kind: "audio" | "midi" | "musicxml" | "pdf" | "imagem" | "outro";
      rehearsal_status: "planejado" | "realizado" | "cancelado";
      repertoire_status: "planejada" | "em_estudo" | "em_ensaio" | "pronta" | "arquivada";
      voice_classification: "soprano" | "mezzo_soprano" | "contralto" | "tenor" | "baritono" | "baixo" | "nao_classificada";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
