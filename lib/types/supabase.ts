export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          record_id: string | null
          resource_id: string | null
          resource_type: string
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          record_id?: string | null
          resource_id?: string | null
          resource_type: string
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          record_id?: string | null
          resource_id?: string | null
          resource_type?: string
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      catalogue_items: {
        Row: {
          created_at: string
          fk_jurisdiction: string
          fk_sales_group: string
          id: string
          index: number
          pk_catalogue_sku: string
          sales_item_main_type_id: string | null
          sales_item_main_type_name: string
          sales_item_sub_type_id: string | null
          sales_item_sub_type_name: string
          sales_item_variant_name: string | null
          service_type_code: string
          sku_id: string
          status: string
          task_name: string | null
          updated_at: string
          zone_code: string
        }
        Insert: {
          created_at?: string
          fk_jurisdiction: string
          fk_sales_group: string
          id?: string
          index: number
          pk_catalogue_sku: string
          sales_item_main_type_id?: string | null
          sales_item_main_type_name: string
          sales_item_sub_type_id?: string | null
          sales_item_sub_type_name: string
          sales_item_variant_name?: string | null
          service_type_code: string
          sku_id: string
          status?: string
          task_name?: string | null
          updated_at?: string
          zone_code?: string
        }
        Update: {
          created_at?: string
          fk_jurisdiction?: string
          fk_sales_group?: string
          id?: string
          index?: number
          pk_catalogue_sku?: string
          sales_item_main_type_id?: string | null
          sales_item_main_type_name?: string
          sales_item_sub_type_id?: string | null
          sales_item_sub_type_name?: string
          sales_item_variant_name?: string | null
          service_type_code?: string
          sku_id?: string
          status?: string
          task_name?: string | null
          updated_at?: string
          zone_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_items_fk_jurisdiction_fkey"
            columns: ["fk_jurisdiction"]
            isOneToOne: false
            referencedRelation: "jurisdictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalogue_items_fk_sales_group_fkey"
            columns: ["fk_sales_group"]
            isOneToOne: false
            referencedRelation: "sales_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      core_file_link_contacts: {
        Row: {
          contact_id: string | null
          file_id: string | null
          id: string
          linked_at: string | null
          linked_by: string | null
        }
        Insert: {
          contact_id?: string | null
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
        }
        Update: {
          contact_id?: string | null
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_file_link_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "core_objects_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_contacts_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "core_file_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_contacts_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_file_link_desk_tickets: {
        Row: {
          file_id: string | null
          id: string
          linked_at: string | null
          linked_by: string | null
          ticket_id: string | null
        }
        Insert: {
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          ticket_id?: string | null
        }
        Update: {
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_file_link_desk_tickets_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "core_file_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_desk_tickets_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "core_file_link_desk_tickets_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "source_desk_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      core_file_link_entities: {
        Row: {
          entity_id: string | null
          file_id: string | null
          id: string
          linked_at: string | null
          linked_by: string | null
        }
        Insert: {
          entity_id?: string | null
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
        }
        Update: {
          entity_id?: string | null
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_file_link_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "core_objects_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_entities_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "core_file_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_entities_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_file_link_individuals: {
        Row: {
          file_id: string | null
          id: string
          individual_id: string | null
          linked_at: string | null
          linked_by: string | null
        }
        Insert: {
          file_id?: string | null
          id?: string
          individual_id?: string | null
          linked_at?: string | null
          linked_by?: string | null
        }
        Update: {
          file_id?: string | null
          id?: string
          individual_id?: string | null
          linked_at?: string | null
          linked_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_file_link_individuals_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "core_file_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_individuals_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "core_objects_individuals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_individuals_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_file_link_project_tasks: {
        Row: {
          file_id: string | null
          id: string
          linked_at: string | null
          linked_by: string | null
          task_id: string | null
        }
        Insert: {
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          task_id?: string | null
        }
        Update: {
          file_id?: string | null
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_file_link_project_tasks_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "core_file_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_file_link_project_tasks_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "core_file_link_project_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "source_projects_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      core_file_register: {
        Row: {
          comment: string | null
          document_type: string | null
          due_date: string | null
          expiry_date: string | null
          file_name: string
          file_url: string
          id: string
          instruction: string | null
          issue_date: string | null
          registration_date: string | null
          renamed_date: string | null
          upload_date: string
          uploaded_by: string | null
        }
        Insert: {
          comment?: string | null
          document_type?: string | null
          due_date?: string | null
          expiry_date?: string | null
          file_name: string
          file_url: string
          id?: string
          instruction?: string | null
          issue_date?: string | null
          registration_date?: string | null
          renamed_date?: string | null
          upload_date?: string
          uploaded_by?: string | null
        }
        Update: {
          comment?: string | null
          document_type?: string | null
          due_date?: string | null
          expiry_date?: string | null
          file_name?: string
          file_url?: string
          id?: string
          instruction?: string | null
          issue_date?: string | null
          registration_date?: string | null
          renamed_date?: string | null
          upload_date?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_file_register_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_object_contact_access_grants: {
        Row: {
          access_level: string
          created_at: string | null
          granted_by: string | null
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          granted_by?: string | null
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          granted_by?: string | null
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_object_contact_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "core_object_contact_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "core_objects_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_object_contact_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_contacts: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          created_by_user_id: string | null
          email: string
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          email: string
          first_name: string
          id?: string
          job_title?: string | null
          last_name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          email?: string
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_object_contacts_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_contacts_access_grants: {
        Row: {
          access_level: string
          created_at: string
          granted_by: string
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          granted_by: string
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          granted_by?: string
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_object_contacts_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "core_object_contacts_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "core_objects_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_object_contacts_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_documents: {
        Row: {
          created_at: string
          description: string | null
          entity_id: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          individual_id: string | null
          name: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          individual_id?: string | null
          name: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          individual_id?: string | null
          name?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_objects_documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "core_objects_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_objects_documents_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "core_objects_individuals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_objects_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_entities: {
        Row: {
          account_name: string | null
          calcflag_address_missing: boolean | null
          calcflag_license_missing: boolean | null
          calcflag_tax_cert_missing: boolean | null
          calcvalue_remaining_days_branch: number | null
          calcvalue_remaining_days_establishment: number | null
          calcvalue_remaining_days_license: number | null
          calcvalue_remaining_days_office_lease: number | null
          created_at: string | null
          created_by_user_id: string | null
          data_bucket_drive: string | null
          date_branch_license_registration: string | null
          date_cit_registration: string | null
          date_deregistration: string | null
          date_incorporation: string | null
          date_initial_client_onboarding: string | null
          date_initial_kyc_screen: string | null
          date_main_license_registration: string | null
          date_vat_registration: string | null
          description: string | null
          due_filing_annual_accounts_adgm: string | null
          due_filing_confirmation_statement: string | null
          due_filing_corporate_tax: string | null
          due_filing_esr_notification: string | null
          due_filing_esr_reporting: string | null
          due_filing_fatca_crs: string | null
          due_filing_vat_q1: string | null
          due_filing_vat_q2: string | null
          due_filing_vat_q3: string | null
          due_filing_vat_q4: string | null
          expiry_annual_data_protection: string | null
          expiry_branch_license: string | null
          expiry_chamber_of_commerce: string | null
          expiry_civil_defense_certificate: string | null
          expiry_echannel: string | null
          expiry_establishment_card: string | null
          expiry_kyc_screening_a: string | null
          expiry_kyc_screening_b: string | null
          expiry_main_license: string | null
          expiry_ministry_of_economy: string | null
          expiry_mohre_update: string | null
          expiry_office_lease: string | null
          id: string
          location_from_jurisdiction: string | null
          lookup_country_name: string | null
          lookup_emirate_name: string | null
          lookup_flag: string | null
          lookup_jurisdiction_abbr: string | null
          lookup_jurisdiction_name: string | null
          lookup_main_contact_name: string | null
          name: string
          onedrive_folder_url: string | null
          prefix: string | null
          profile_cit_trn: string | null
          profile_code: string | null
          profile_license_type: string | null
          profile_main_license_number: string | null
          profile_number_of_employees: number | null
          profile_short_name: string | null
          profile_tag_affiliate_partnership: string | null
          profile_tag_business_partner: string | null
          profile_tag_group_structure: string | null
          profile_tag_industry: string | null
          profile_tag_legal_structure: string | null
          profile_tag_x_factor: string | null
          profile_trade_license_name: string | null
          profile_vat_trn: string | null
          status: string
          status_active_retainer: boolean | null
          status_cit_tax: boolean | null
          status_gcc_nationals: boolean | null
          status_operating_status: string | null
          status_relationship: string | null
          status_wps_registration: boolean | null
          system_stamp_last_modified: string | null
          total_combined_revenue_2024: number | null
          total_revenue_210_2024: number | null
          total_revenue_215_2024: number | null
          updated_at: string | null
        }
        Insert: {
          account_name?: string | null
          calcflag_address_missing?: boolean | null
          calcflag_license_missing?: boolean | null
          calcflag_tax_cert_missing?: boolean | null
          calcvalue_remaining_days_branch?: number | null
          calcvalue_remaining_days_establishment?: number | null
          calcvalue_remaining_days_license?: number | null
          calcvalue_remaining_days_office_lease?: number | null
          created_at?: string | null
          created_by_user_id?: string | null
          data_bucket_drive?: string | null
          date_branch_license_registration?: string | null
          date_cit_registration?: string | null
          date_deregistration?: string | null
          date_incorporation?: string | null
          date_initial_client_onboarding?: string | null
          date_initial_kyc_screen?: string | null
          date_main_license_registration?: string | null
          date_vat_registration?: string | null
          description?: string | null
          due_filing_annual_accounts_adgm?: string | null
          due_filing_confirmation_statement?: string | null
          due_filing_corporate_tax?: string | null
          due_filing_esr_notification?: string | null
          due_filing_esr_reporting?: string | null
          due_filing_fatca_crs?: string | null
          due_filing_vat_q1?: string | null
          due_filing_vat_q2?: string | null
          due_filing_vat_q3?: string | null
          due_filing_vat_q4?: string | null
          expiry_annual_data_protection?: string | null
          expiry_branch_license?: string | null
          expiry_chamber_of_commerce?: string | null
          expiry_civil_defense_certificate?: string | null
          expiry_echannel?: string | null
          expiry_establishment_card?: string | null
          expiry_kyc_screening_a?: string | null
          expiry_kyc_screening_b?: string | null
          expiry_main_license?: string | null
          expiry_ministry_of_economy?: string | null
          expiry_mohre_update?: string | null
          expiry_office_lease?: string | null
          id?: string
          location_from_jurisdiction?: string | null
          lookup_country_name?: string | null
          lookup_emirate_name?: string | null
          lookup_flag?: string | null
          lookup_jurisdiction_abbr?: string | null
          lookup_jurisdiction_name?: string | null
          lookup_main_contact_name?: string | null
          name: string
          onedrive_folder_url?: string | null
          prefix?: string | null
          profile_cit_trn?: string | null
          profile_code?: string | null
          profile_license_type?: string | null
          profile_main_license_number?: string | null
          profile_number_of_employees?: number | null
          profile_short_name?: string | null
          profile_tag_affiliate_partnership?: string | null
          profile_tag_business_partner?: string | null
          profile_tag_group_structure?: string | null
          profile_tag_industry?: string | null
          profile_tag_legal_structure?: string | null
          profile_tag_x_factor?: string | null
          profile_trade_license_name?: string | null
          profile_vat_trn?: string | null
          status?: string
          status_active_retainer?: boolean | null
          status_cit_tax?: boolean | null
          status_gcc_nationals?: boolean | null
          status_operating_status?: string | null
          status_relationship?: string | null
          status_wps_registration?: boolean | null
          system_stamp_last_modified?: string | null
          total_combined_revenue_2024?: number | null
          total_revenue_210_2024?: number | null
          total_revenue_215_2024?: number | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string | null
          calcflag_address_missing?: boolean | null
          calcflag_license_missing?: boolean | null
          calcflag_tax_cert_missing?: boolean | null
          calcvalue_remaining_days_branch?: number | null
          calcvalue_remaining_days_establishment?: number | null
          calcvalue_remaining_days_license?: number | null
          calcvalue_remaining_days_office_lease?: number | null
          created_at?: string | null
          created_by_user_id?: string | null
          data_bucket_drive?: string | null
          date_branch_license_registration?: string | null
          date_cit_registration?: string | null
          date_deregistration?: string | null
          date_incorporation?: string | null
          date_initial_client_onboarding?: string | null
          date_initial_kyc_screen?: string | null
          date_main_license_registration?: string | null
          date_vat_registration?: string | null
          description?: string | null
          due_filing_annual_accounts_adgm?: string | null
          due_filing_confirmation_statement?: string | null
          due_filing_corporate_tax?: string | null
          due_filing_esr_notification?: string | null
          due_filing_esr_reporting?: string | null
          due_filing_fatca_crs?: string | null
          due_filing_vat_q1?: string | null
          due_filing_vat_q2?: string | null
          due_filing_vat_q3?: string | null
          due_filing_vat_q4?: string | null
          expiry_annual_data_protection?: string | null
          expiry_branch_license?: string | null
          expiry_chamber_of_commerce?: string | null
          expiry_civil_defense_certificate?: string | null
          expiry_echannel?: string | null
          expiry_establishment_card?: string | null
          expiry_kyc_screening_a?: string | null
          expiry_kyc_screening_b?: string | null
          expiry_main_license?: string | null
          expiry_ministry_of_economy?: string | null
          expiry_mohre_update?: string | null
          expiry_office_lease?: string | null
          id?: string
          location_from_jurisdiction?: string | null
          lookup_country_name?: string | null
          lookup_emirate_name?: string | null
          lookup_flag?: string | null
          lookup_jurisdiction_abbr?: string | null
          lookup_jurisdiction_name?: string | null
          lookup_main_contact_name?: string | null
          name?: string
          onedrive_folder_url?: string | null
          prefix?: string | null
          profile_cit_trn?: string | null
          profile_code?: string | null
          profile_license_type?: string | null
          profile_main_license_number?: string | null
          profile_number_of_employees?: number | null
          profile_short_name?: string | null
          profile_tag_affiliate_partnership?: string | null
          profile_tag_business_partner?: string | null
          profile_tag_group_structure?: string | null
          profile_tag_industry?: string | null
          profile_tag_legal_structure?: string | null
          profile_tag_x_factor?: string | null
          profile_trade_license_name?: string | null
          profile_vat_trn?: string | null
          status?: string
          status_active_retainer?: boolean | null
          status_cit_tax?: boolean | null
          status_gcc_nationals?: boolean | null
          status_operating_status?: string | null
          status_relationship?: string | null
          status_wps_registration?: boolean | null
          system_stamp_last_modified?: string | null
          total_combined_revenue_2024?: number | null
          total_revenue_210_2024?: number | null
          total_revenue_215_2024?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_objects_entities_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_entities_access_grants: {
        Row: {
          access_level: string
          created_at: string | null
          granted_by: string | null
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          granted_by?: string | null
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          granted_by?: string | null
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_objects_entities_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "core_objects_entities_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "core_objects_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_objects_entities_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_individuals: {
        Row: {
          contact_email: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_objects_individuals_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_individuals_access_grants: {
        Row: {
          access_level: string
          created_at: string | null
          granted_by: string | null
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          granted_by?: string | null
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          granted_by?: string | null
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_objects_individuals_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "core_objects_individuals_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "core_objects_individuals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_objects_individuals_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      core_objects_quotes: {
        Row: {
          approval_notes: string | null
          approval_status: string
          approver_id: string | null
          assigned_to: string | null
          client_id: string | null
          client_name: string
          client_terms: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          expiry_date: string
          id: string
          internal_notes: string | null
          is_latest_version: boolean
          monthly_value: number
          parent_quote_id: string | null
          quote_data: Json
          quote_ref: string | null
          sent_date: string | null
          setup_fee: number
          signed_date: string | null
          status: string
          template_id: string | null
          ticket_id: string | null
          total_value: number
          updated_at: string | null
          version: number
        }
        Insert: {
          approval_notes?: string | null
          approval_status?: string
          approver_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          client_name: string
          client_terms?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expiry_date: string
          id: string
          internal_notes?: string | null
          is_latest_version?: boolean
          monthly_value?: number
          parent_quote_id?: string | null
          quote_data?: Json
          quote_ref?: string | null
          sent_date?: string | null
          setup_fee?: number
          signed_date?: string | null
          status?: string
          template_id?: string | null
          ticket_id?: string | null
          total_value?: number
          updated_at?: string | null
          version?: number
        }
        Update: {
          approval_notes?: string | null
          approval_status?: string
          approver_id?: string | null
          assigned_to?: string | null
          client_id?: string | null
          client_name?: string
          client_terms?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expiry_date?: string
          id?: string
          internal_notes?: string | null
          is_latest_version?: boolean
          monthly_value?: number
          parent_quote_id?: string | null
          quote_data?: Json
          quote_ref?: string | null
          sent_date?: string | null
          setup_fee?: number
          signed_date?: string | null
          status?: string
          template_id?: string | null
          ticket_id?: string | null
          total_value?: number
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "quotes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "core_objects_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "quotes_parent_quote_id_fkey"
            columns: ["parent_quote_id"]
            isOneToOne: false
            referencedRelation: "core_objects_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "quote_template_library"
            referencedColumns: ["id"]
          },
        ]
      }
      crawl_sessions: {
        Row: {
          base_url: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          pages_crawled: number | null
          pages_found: number | null
          settings: Json | null
          status: string
          user_id: string
        }
        Insert: {
          base_url: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          pages_crawled?: number | null
          pages_found?: number | null
          settings?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          base_url?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          pages_crawled?: number | null
          pages_found?: number | null
          settings?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      docs_articles: {
        Row: {
          category: string | null
          collection: string | null
          content: string | null
          created_at: string | null
          created_by_user_id: string | null
          id: string
          pdf_url: string | null
          slug: string
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          category?: string | null
          collection?: string | null
          content?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          pdf_url?: string | null
          slug: string
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          category?: string | null
          collection?: string | null
          content?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          pdf_url?: string | null
          slug?: string
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "docs_articles_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      employees: {
        Row: {
          bank_name: string | null
          contract_type: string | null
          created_at: string | null
          date_of_birth: string | null
          emirates_id: string | null
          employer_id: string | null
          full_name: string
          iban: string | null
          id: string
          individual_id: string | null
          job_title: string | null
          nationality: string | null
          passport_number: string | null
          start_date: string
          status: string | null
          termination_date: string | null
          updated_at: string | null
          visa_info: Json | null
          wps_compliance_flag: boolean | null
        }
        Insert: {
          bank_name?: string | null
          contract_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emirates_id?: string | null
          employer_id?: string | null
          full_name: string
          iban?: string | null
          id?: string
          individual_id?: string | null
          job_title?: string | null
          nationality?: string | null
          passport_number?: string | null
          start_date: string
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
          visa_info?: Json | null
          wps_compliance_flag?: boolean | null
        }
        Update: {
          bank_name?: string | null
          contract_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emirates_id?: string | null
          employer_id?: string | null
          full_name?: string
          iban?: string | null
          id?: string
          individual_id?: string | null
          job_title?: string | null
          nationality?: string | null
          passport_number?: string | null
          start_date?: string
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
          visa_info?: Json | null
          wps_compliance_flag?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "core_objects_individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      employers: {
        Row: {
          address: string | null
          contact_info: Json | null
          created_at: string | null
          entity_id: string | null
          id: string
          legal_name: string
          trade_license: string
          updated_at: string
          wps_details: Json | null
        }
        Insert: {
          address?: string | null
          contact_info?: Json | null
          created_at?: string | null
          entity_id?: string | null
          id?: string
          legal_name: string
          trade_license: string
          updated_at?: string
          wps_details?: Json | null
        }
        Update: {
          address?: string | null
          contact_info?: Json | null
          created_at?: string | null
          entity_id?: string | null
          id?: string
          legal_name?: string
          trade_license?: string
          updated_at?: string
          wps_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "employers_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "core_objects_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employers_entity_id"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "core_objects_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_claims: {
        Row: {
          amount: number
          approved_at: string | null
          approver_id: string | null
          category: string | null
          claim_date: string
          created_at: string | null
          description: string | null
          employee_id: string | null
          id: string
          payrun_id: string | null
          receipt_url: string | null
          status: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approver_id?: string | null
          category?: string | null
          claim_date: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          payrun_id?: string | null
          receipt_url?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approver_id?: string | null
          category?: string | null
          claim_date?: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          payrun_id?: string | null
          receipt_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_claims_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_claims_payrun_id_fkey"
            columns: ["payrun_id"]
            isOneToOne: false
            referencedRelation: "payrun_batch_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_claims_payrun_id_fkey"
            columns: ["payrun_id"]
            isOneToOne: false
            referencedRelation: "payruns"
            referencedColumns: ["id"]
          },
        ]
      }
      jurisdictions: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      kyc_agent_actions: {
        Row: {
          action_details: Json
          action_type: string
          case_id: string | null
          created_at: string | null
          id: string
          user_email: string | null
        }
        Insert: {
          action_details: Json
          action_type: string
          case_id?: string | null
          created_at?: string | null
          id?: string
          user_email?: string | null
        }
        Update: {
          action_details?: Json
          action_type?: string
          case_id?: string | null
          created_at?: string | null
          id?: string
          user_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kevin_agent_actions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "kyc_compliance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_case_access_grants: {
        Row: {
          access_level: string | null
          case_id: string
          granted_at: string | null
          granted_by: string | null
          granted_to: string | null
          id: string
        }
        Insert: {
          access_level?: string | null
          case_id: string
          granted_at?: string | null
          granted_by?: string | null
          granted_to?: string | null
          id?: string
        }
        Update: {
          access_level?: string | null
          case_id?: string
          granted_at?: string | null
          granted_by?: string | null
          granted_to?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kevin_case_access_grants_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "kyc_compliance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kevin_case_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "kevin_case_access_grants_granted_to_fkey"
            columns: ["granted_to"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      kyc_case_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          case_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          case_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          case_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_assignments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "kyc_compliance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_case_messages: {
        Row: {
          case_id: string | null
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          case_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          case_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "kevin_case_messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "kyc_compliance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_compliance_cases: {
        Row: {
          archived_at: string | null
          case_status: string | null
          client_email: string
          client_name: string | null
          company_name: string | null
          created_at: string | null
          created_by_profile_id: string | null
          created_by_user_id: string | null
          deadline: string | null
          id: string
          metadata: Json | null
          risk_score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          case_status?: string | null
          client_email: string
          client_name?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by_profile_id?: string | null
          created_by_user_id?: string | null
          deadline?: string | null
          id?: string
          metadata?: Json | null
          risk_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          case_status?: string | null
          client_email?: string
          client_name?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by_profile_id?: string | null
          created_by_user_id?: string | null
          deadline?: string | null
          id?: string
          metadata?: Json | null
          risk_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kevin_compliance_cases_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kevin_compliance_cases_created_by_profile_id_fkey"
            columns: ["created_by_profile_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "kevin_compliance_cases_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      kyc_compliance_documents: {
        Row: {
          case_id: string | null
          document_type: string
          file_name: string
          file_path: string
          id: string
          metadata: Json | null
          upload_status: string | null
          uploaded_at: string | null
          verified_at: string | null
        }
        Insert: {
          case_id?: string | null
          document_type: string
          file_name: string
          file_path: string
          id?: string
          metadata?: Json | null
          upload_status?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
        }
        Update: {
          case_id?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          metadata?: Json | null
          upload_status?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kevin_compliance_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "kyc_compliance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_document_uploads: {
        Row: {
          analysis_result: Json | null
          content_preview: string | null
          created_at: string | null
          file_id: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          status: string | null
          updated_at: string | null
          upload_timestamp: string | null
        }
        Insert: {
          analysis_result?: Json | null
          content_preview?: string | null
          created_at?: string | null
          file_id: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          status?: string | null
          updated_at?: string | null
          upload_timestamp?: string | null
        }
        Update: {
          analysis_result?: Json | null
          content_preview?: string | null
          created_at?: string | null
          file_id?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          upload_timestamp?: string | null
        }
        Relationships: []
      }
      kyc_email_templates: {
        Row: {
          body_template: string
          category: string
          created_at: string | null
          created_by_user_id: string | null
          id: string
          is_active: boolean | null
          name: string
          subject_template: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_template: string
          category: string
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject_template: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_template?: string
          category?: string
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject_template?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "kevin_email_templates_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kevin_email_templates_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      kyc_email_templates_access_grants: {
        Row: {
          access_level: string
          created_at: string
          granted_by: string
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          granted_by: string
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          granted_by?: string
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kevin_email_templates_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "kevin_email_templates_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "kyc_email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kevin_email_templates_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      kyc_escalation_rules: {
        Row: {
          created_at: string | null
          description: string | null
          escalate_to: string | null
          escalation_type: string
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          trigger_conditions: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          escalate_to?: string | null
          escalation_type: string
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          trigger_conditions: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          escalate_to?: string | null
          escalation_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          trigger_conditions?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      kyc_follow_ups: {
        Row: {
          compliance_case_id: string | null
          conversation_id: string | null
          created_at: string | null
          created_by_user_id: string | null
          executed_at: string | null
          follow_up_type: string
          id: string
          message: string
          scheduled_date: string
          status: string | null
        }
        Insert: {
          compliance_case_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          executed_at?: string | null
          follow_up_type: string
          id?: string
          message: string
          scheduled_date: string
          status?: string | null
        }
        Update: {
          compliance_case_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          executed_at?: string | null
          follow_up_type?: string
          id?: string
          message?: string
          scheduled_date?: string
          status?: string | null
        }
        Relationships: []
      }
      kyc_follow_ups_access_grants: {
        Row: {
          access_level: string
          created_at: string
          granted_by: string
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          granted_by: string
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          granted_by?: string
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kevin_follow_ups_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "kevin_follow_ups_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "kyc_follow_ups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kevin_follow_ups_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      kyc_knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by_user_id: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      kyc_knowledge_base_access_grants: {
        Row: {
          access_level: string
          created_at: string
          granted_by: string
          id: string
          object_id: string
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string
          granted_by: string
          id?: string
          object_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string
          granted_by?: string
          id?: string
          object_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kevin_knowledge_base_access_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "kevin_knowledge_base_access_grants_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "kyc_knowledge_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kevin_knowledge_base_access_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          expires_at: string
          id: string
          identifier: string
          type: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          identifier: string
          type: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          identifier?: string
          type?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      otp_rate_limits: {
        Row: {
          id: string
          identifier: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      payrun_items: {
        Row: {
          base_salary: number | null
          created_at: string | null
          deductions: Json | null
          employee_id: string | null
          eosb_accrual: number | null
          expense_reimbursements: number | null
          fixed_allowances: Json | null
          gross_pay: number | null
          id: string
          manual_adjustments: Json | null
          net_pay: number | null
          payrun_id: string | null
          variable_allowances: Json | null
        }
        Insert: {
          base_salary?: number | null
          created_at?: string | null
          deductions?: Json | null
          employee_id?: string | null
          eosb_accrual?: number | null
          expense_reimbursements?: number | null
          fixed_allowances?: Json | null
          gross_pay?: number | null
          id?: string
          manual_adjustments?: Json | null
          net_pay?: number | null
          payrun_id?: string | null
          variable_allowances?: Json | null
        }
        Update: {
          base_salary?: number | null
          created_at?: string | null
          deductions?: Json | null
          employee_id?: string | null
          eosb_accrual?: number | null
          expense_reimbursements?: number | null
          fixed_allowances?: Json | null
          gross_pay?: number | null
          id?: string
          manual_adjustments?: Json | null
          net_pay?: number | null
          payrun_id?: string | null
          variable_allowances?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "payrun_items_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrun_items_payrun_id_fkey"
            columns: ["payrun_id"]
            isOneToOne: false
            referencedRelation: "payrun_batch_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrun_items_payrun_id_fkey"
            columns: ["payrun_id"]
            isOneToOne: false
            referencedRelation: "payruns"
            referencedColumns: ["id"]
          },
        ]
      }
      payruns: {
        Row: {
          created_at: string | null
          created_by: string | null
          employer_id: string | null
          id: string
          pay_period_end: string
          pay_period_start: string
          payment_date: string | null
          payrun_name: string
          processed_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          employer_id?: string | null
          id?: string
          pay_period_end: string
          pay_period_start: string
          payment_date?: string | null
          payrun_name: string
          processed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          employer_id?: string | null
          id?: string
          pay_period_end?: string
          pay_period_start?: string
          payment_date?: string | null
          payrun_name?: string
          processed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payruns_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          employee_id: string | null
          id: string
          payrun_item_id: string | null
          pdf_url: string | null
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          employee_id?: string | null
          id?: string
          payrun_item_id?: string | null
          pdf_url?: string | null
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          employee_id?: string | null
          id?: string
          payrun_item_id?: string | null
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_payrun_item_id_fkey"
            columns: ["payrun_item_id"]
            isOneToOne: false
            referencedRelation: "payrun_items"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          client_type: string | null
          created_at: string | null
          currency: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_retainer_only: boolean | null
          jurisdiction: string | null
          price: number
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_type?: string | null
          created_at?: string | null
          currency?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_retainer_only?: boolean | null
          jurisdiction?: string | null
          price: number
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_type?: string | null
          created_at?: string | null
          currency?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_retainer_only?: boolean | null
          jurisdiction?: string | null
          price?: number
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_lists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          sku: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sku: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sku?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      public_access_grant_logs: {
        Row: {
          access_level: string
          action: string
          created_at: string
          granted_by: string
          id: string
          object_id: string
          object_type: string
          user_id: string
        }
        Insert: {
          access_level: string
          action: string
          created_at?: string
          granted_by: string
          id?: string
          object_id: string
          object_type: string
          user_id: string
        }
        Update: {
          access_level?: string
          action?: string
          created_at?: string
          granted_by?: string
          id?: string
          object_id?: string
          object_type?: string
          user_id?: string
        }
        Relationships: []
      }
      public_user_profiles: {
        Row: {
          cpq_role: string | null
          created_at: string | null
          department: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          specialization: string | null
          updated_at: string | null
          user_role_slug: string | null
        }
        Insert: {
          cpq_role?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_role_slug?: string | null
        }
        Update: {
          cpq_role?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_role_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "public_user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "public_user_profiles_user_role_slug_fkey"
            columns: ["user_role_slug"]
            isOneToOne: false
            referencedRelation: "public_user_roles"
            referencedColumns: ["role_slug"]
          },
          {
            foreignKeyName: "public_user_profiles_user_role_slug_fkey"
            columns: ["user_role_slug"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["role_slug"]
          },
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      public_user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          role_slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          role_slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          role_slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_actions_library: {
        Row: {
          created_at: string | null
          description: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          type?: string
        }
        Relationships: []
      }
      quote_activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          quote_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          quote_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          quote_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_activity_log_action_type_fkey"
            columns: ["action_type"]
            isOneToOne: false
            referencedRelation: "quote_actions_library"
            referencedColumns: ["type"]
          },
          {
            foreignKeyName: "quote_activity_log_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "core_objects_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      quote_line_entries: {
        Row: {
          catalogue_item_id: string
          created_at: string
          discount_percentage: number | null
          group_slug: string | null
          id: string
          jurisdiction_code: string | null
          position: number
          quantity: number
          quote_id: string
          service_name: string
          total_price: number
          type_code: string | null
          unit_price: number
          updated_at: string
          variant: string | null
        }
        Insert: {
          catalogue_item_id: string
          created_at?: string
          discount_percentage?: number | null
          group_slug?: string | null
          id?: string
          jurisdiction_code?: string | null
          position?: number
          quantity?: number
          quote_id: string
          service_name: string
          total_price: number
          type_code?: string | null
          unit_price: number
          updated_at?: string
          variant?: string | null
        }
        Update: {
          catalogue_item_id?: string
          created_at?: string
          discount_percentage?: number | null
          group_slug?: string | null
          id?: string
          jurisdiction_code?: string | null
          position?: number
          quantity?: number
          quote_id?: string
          service_name?: string
          total_price?: number
          type_code?: string | null
          unit_price?: number
          updated_at?: string
          variant?: string | null
        }
        Relationships: []
      }
      quote_template_library: {
        Row: {
          bundle: string
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_value: number
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          jurisdiction: string
          name: string
          parent_template_id: string | null
          tags: string[] | null
          template_data: Json
          template_ref: string | null
          updated_at: string | null
          usage_count: number | null
          version: number | null
        }
        Insert: {
          bundle: string
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_value?: number
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          jurisdiction: string
          name: string
          parent_template_id?: string | null
          tags?: string[] | null
          template_data?: Json
          template_ref?: string | null
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          bundle?: string
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_value?: number
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          jurisdiction?: string
          name?: string
          parent_template_id?: string | null
          tags?: string[] | null
          template_data?: Json
          template_ref?: string | null
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "quote_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "quote_template_library"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_structures: {
        Row: {
          base_salary: number
          created_at: string | null
          deductions: Json | null
          effective_from: string
          effective_to: string | null
          employee_id: string | null
          eosb_accrual_method: string | null
          fixed_allowances: Json | null
          id: string
          variable_allowances: Json | null
        }
        Insert: {
          base_salary: number
          created_at?: string | null
          deductions?: Json | null
          effective_from: string
          effective_to?: string | null
          employee_id?: string | null
          eosb_accrual_method?: string | null
          fixed_allowances?: Json | null
          id?: string
          variable_allowances?: Json | null
        }
        Update: {
          base_salary?: number
          created_at?: string | null
          deductions?: Json | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string | null
          eosb_accrual_method?: string | null
          fixed_allowances?: Json | null
          id?: string
          variable_allowances?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_structures_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_groups: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      source_desk_agents: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_articles: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_categories: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_custom_fields: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_customers: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_inboxes: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_sites: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_sla_policies: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_teams: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_ticket_notes: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_ticket_tags: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_ticket_threads: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_desk_tickets: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_calendar_events: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_comments: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_companies: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_dashboards: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_expenses: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_file_categories: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_files: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_holidays: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_links: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_messages: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_milestones: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_notebooks: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_people: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_projects: {
        Row: {
          category_id: number | null
          company_id: number | null
          custom_fields: Json | null
          date_created: string | null
          default_privacy: string | null
          harvest_timers_enabled: boolean | null
          id: string
          is_archived: boolean | null
          last_changed_on: string | null
          logo_url: string | null
          project_owner_id: number | null
          project_url: string | null
          source_data: Json
          starred: boolean | null
          status_color: string | null
          synced_at: string | null
          tags: Json | null
        }
        Insert: {
          category_id?: number | null
          company_id?: number | null
          custom_fields?: Json | null
          date_created?: string | null
          default_privacy?: string | null
          harvest_timers_enabled?: boolean | null
          id?: string
          is_archived?: boolean | null
          last_changed_on?: string | null
          logo_url?: string | null
          project_owner_id?: number | null
          project_url?: string | null
          source_data: Json
          starred?: boolean | null
          status_color?: string | null
          synced_at?: string | null
          tags?: Json | null
        }
        Update: {
          category_id?: number | null
          company_id?: number | null
          custom_fields?: Json | null
          date_created?: string | null
          default_privacy?: string | null
          harvest_timers_enabled?: boolean | null
          id?: string
          is_archived?: boolean | null
          last_changed_on?: string | null
          logo_url?: string | null
          project_owner_id?: number | null
          project_url?: string | null
          source_data?: Json
          starred?: boolean | null
          status_color?: string | null
          synced_at?: string | null
          tags?: Json | null
        }
        Relationships: []
      }
      source_projects_reports: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_subtasks: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_task_lists: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_tasks: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_teams: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_projects_time_entries: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_accounts: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_attachments: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_bank_transactions: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_bank_transfers: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_batch_payments: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_branding_themes: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_contact_groups: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_contacts: {
        Row: {
          AccountNumber: string | null
          AccountsPayableTaxCodeName: string | null
          AccountsReceivableTaxCodeName: string | null
          BankAccountName: string | null
          BankAccountNumber: string | null
          BankAccountParticulars: string | null
          BrandingTheme: string | null
          CompanyNumber: string | null
          ContactName: string | null
          DDINumber: string | null
          DefaultTaxBills: string | null
          DefaultTaxSales: string | null
          Discount: string | null
          DueDateBillDay: string | null
          DueDateBillTerm: string | null
          DueDateSalesDay: string | null
          DueDateSalesTerm: string | null
          EmailAddress: string | null
          FaxNumber: string | null
          FirstName: string | null
          id: string
          LastName: string | null
          LegalName: string | null
          MobileNumber: string | null
          Person1Email: string | null
          Person1FirstName: string | null
          Person1IncludeInEmail: string | null
          Person1LastName: string | null
          Person2Email: string | null
          Person2FirstName: string | null
          Person2IncludeInEmail: string | null
          Person2LastName: string | null
          Person3Email: string | null
          Person3FirstName: string | null
          Person3IncludeInEmail: string | null
          Person3LastName: string | null
          Person4Email: string | null
          Person4FirstName: string | null
          Person4IncludeInEmail: string | null
          Person4LastName: string | null
          Person5Email: string | null
          Person5FirstName: string | null
          Person5IncludeInEmail: string | null
          Person5LastName: string | null
          PhoneNumber: string | null
          POAddressLine1: string | null
          POAddressLine2: string | null
          POAddressLine3: string | null
          POAddressLine4: string | null
          POAttentionTo: string | null
          POCity: string | null
          POCountry: string | null
          POPostalCode: string | null
          PORegion: string | null
          PurchasesAccount: string | null
          PurchasesTrackingOption1: string | null
          PurchasesTrackingOption2: string | null
          SAAddressLine1: string | null
          SAAddressLine2: string | null
          SAAddressLine3: string | null
          SAAddressLine4: string | null
          SAAttentionTo: string | null
          SACity: string | null
          SACountry: string | null
          SalesAccount: string | null
          SalesTrackingOption1: string | null
          SalesTrackingOption2: string | null
          SAPostalCode: string | null
          SARegion: string | null
          SkypeName: string | null
          source_data: Json
          synced_at: string | null
          TaxNumber: string | null
          TrackingName1: string | null
          TrackingName2: string | null
          Website: string | null
        }
        Insert: {
          AccountNumber?: string | null
          AccountsPayableTaxCodeName?: string | null
          AccountsReceivableTaxCodeName?: string | null
          BankAccountName?: string | null
          BankAccountNumber?: string | null
          BankAccountParticulars?: string | null
          BrandingTheme?: string | null
          CompanyNumber?: string | null
          ContactName?: string | null
          DDINumber?: string | null
          DefaultTaxBills?: string | null
          DefaultTaxSales?: string | null
          Discount?: string | null
          DueDateBillDay?: string | null
          DueDateBillTerm?: string | null
          DueDateSalesDay?: string | null
          DueDateSalesTerm?: string | null
          EmailAddress?: string | null
          FaxNumber?: string | null
          FirstName?: string | null
          id?: string
          LastName?: string | null
          LegalName?: string | null
          MobileNumber?: string | null
          Person1Email?: string | null
          Person1FirstName?: string | null
          Person1IncludeInEmail?: string | null
          Person1LastName?: string | null
          Person2Email?: string | null
          Person2FirstName?: string | null
          Person2IncludeInEmail?: string | null
          Person2LastName?: string | null
          Person3Email?: string | null
          Person3FirstName?: string | null
          Person3IncludeInEmail?: string | null
          Person3LastName?: string | null
          Person4Email?: string | null
          Person4FirstName?: string | null
          Person4IncludeInEmail?: string | null
          Person4LastName?: string | null
          Person5Email?: string | null
          Person5FirstName?: string | null
          Person5IncludeInEmail?: string | null
          Person5LastName?: string | null
          PhoneNumber?: string | null
          POAddressLine1?: string | null
          POAddressLine2?: string | null
          POAddressLine3?: string | null
          POAddressLine4?: string | null
          POAttentionTo?: string | null
          POCity?: string | null
          POCountry?: string | null
          POPostalCode?: string | null
          PORegion?: string | null
          PurchasesAccount?: string | null
          PurchasesTrackingOption1?: string | null
          PurchasesTrackingOption2?: string | null
          SAAddressLine1?: string | null
          SAAddressLine2?: string | null
          SAAddressLine3?: string | null
          SAAddressLine4?: string | null
          SAAttentionTo?: string | null
          SACity?: string | null
          SACountry?: string | null
          SalesAccount?: string | null
          SalesTrackingOption1?: string | null
          SalesTrackingOption2?: string | null
          SAPostalCode?: string | null
          SARegion?: string | null
          SkypeName?: string | null
          source_data: Json
          synced_at?: string | null
          TaxNumber?: string | null
          TrackingName1?: string | null
          TrackingName2?: string | null
          Website?: string | null
        }
        Update: {
          AccountNumber?: string | null
          AccountsPayableTaxCodeName?: string | null
          AccountsReceivableTaxCodeName?: string | null
          BankAccountName?: string | null
          BankAccountNumber?: string | null
          BankAccountParticulars?: string | null
          BrandingTheme?: string | null
          CompanyNumber?: string | null
          ContactName?: string | null
          DDINumber?: string | null
          DefaultTaxBills?: string | null
          DefaultTaxSales?: string | null
          Discount?: string | null
          DueDateBillDay?: string | null
          DueDateBillTerm?: string | null
          DueDateSalesDay?: string | null
          DueDateSalesTerm?: string | null
          EmailAddress?: string | null
          FaxNumber?: string | null
          FirstName?: string | null
          id?: string
          LastName?: string | null
          LegalName?: string | null
          MobileNumber?: string | null
          Person1Email?: string | null
          Person1FirstName?: string | null
          Person1IncludeInEmail?: string | null
          Person1LastName?: string | null
          Person2Email?: string | null
          Person2FirstName?: string | null
          Person2IncludeInEmail?: string | null
          Person2LastName?: string | null
          Person3Email?: string | null
          Person3FirstName?: string | null
          Person3IncludeInEmail?: string | null
          Person3LastName?: string | null
          Person4Email?: string | null
          Person4FirstName?: string | null
          Person4IncludeInEmail?: string | null
          Person4LastName?: string | null
          Person5Email?: string | null
          Person5FirstName?: string | null
          Person5IncludeInEmail?: string | null
          Person5LastName?: string | null
          PhoneNumber?: string | null
          POAddressLine1?: string | null
          POAddressLine2?: string | null
          POAddressLine3?: string | null
          POAddressLine4?: string | null
          POAttentionTo?: string | null
          POCity?: string | null
          POCountry?: string | null
          POPostalCode?: string | null
          PORegion?: string | null
          PurchasesAccount?: string | null
          PurchasesTrackingOption1?: string | null
          PurchasesTrackingOption2?: string | null
          SAAddressLine1?: string | null
          SAAddressLine2?: string | null
          SAAddressLine3?: string | null
          SAAddressLine4?: string | null
          SAAttentionTo?: string | null
          SACity?: string | null
          SACountry?: string | null
          SalesAccount?: string | null
          SalesTrackingOption1?: string | null
          SalesTrackingOption2?: string | null
          SAPostalCode?: string | null
          SARegion?: string | null
          SkypeName?: string | null
          source_data?: Json
          synced_at?: string | null
          TaxNumber?: string | null
          TrackingName1?: string | null
          TrackingName2?: string | null
          Website?: string | null
        }
        Relationships: []
      }
      source_xero_credit_notes: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_currencies: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_employees: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_expense_claims: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_files: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_invoices: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_items: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_journals: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_linked_transactions: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_manual_journals: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_overpayments: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_payments: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_prepayments: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_purchase_orders: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_receipts: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_repeating_invoices: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_reports: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_tax_rates: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_tracking_categories: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      source_xero_users: {
        Row: {
          id: string
          source_data: Json
          synced_at: string | null
        }
        Insert: {
          id?: string
          source_data: Json
          synced_at?: string | null
        }
        Update: {
          id?: string
          source_data?: Json
          synced_at?: string | null
        }
        Relationships: []
      }
      teamwork_connections: {
        Row: {
          access_token: string
          created_at: string
          email: string
          id: string
          name: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          email: string
          id?: string
          name: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teamwork_sync_logs: {
        Row: {
          completed_at: string | null
          connection_id: string | null
          created_at: string
          entity_type: string
          id: string
          message: string | null
          records_processed: number | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string
          entity_type: string
          id?: string
          message?: string | null
          records_processed?: number | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string
          entity_type?: string
          id?: string
          message?: string | null
          records_processed?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "teamwork_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "teamwork_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      teamwork_tokens: {
        Row: {
          access_token: string | null
          email: string | null
          expires_at: string | null
          name: string | null
          refresh_token: string | null
          teamwork_id: string
        }
        Insert: {
          access_token?: string | null
          email?: string | null
          expires_at?: string | null
          name?: string | null
          refresh_token?: string | null
          teamwork_id: string
        }
        Update: {
          access_token?: string | null
          email?: string | null
          expires_at?: string | null
          name?: string | null
          refresh_token?: string | null
          teamwork_id?: string
        }
        Relationships: []
      }
      xero_auth_tokens: {
        Row: {
          access_token: string | null
          created_at: string | null
          created_date_utc: string | null
          expires_at: string | null
          expires_in_seconds: number | null
          id: string
          refresh_token: string | null
          tenant_id: string | null
          tenant_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          created_date_utc?: string | null
          expires_at?: string | null
          expires_in_seconds?: number | null
          id?: string
          refresh_token?: string | null
          tenant_id?: string | null
          tenant_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          created_date_utc?: string | null
          expires_at?: string | null
          expires_in_seconds?: number | null
          id?: string
          refresh_token?: string | null
          tenant_id?: string | null
          tenant_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xero_auth_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
      xero_sync_logs: {
        Row: {
          created_at: string | null
          entity_type: string
          error_details: Json | null
          errors_count: number | null
          id: string
          records_synced: number | null
          sync_completed_at: string | null
          sync_started_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_type: string
          error_details?: Json | null
          errors_count?: number | null
          id?: string
          records_synced?: number | null
          sync_completed_at?: string | null
          sync_started_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          error_details?: Json | null
          errors_count?: number | null
          id?: string
          records_synced?: number | null
          sync_completed_at?: string | null
          sync_started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      payrun_batch_status: {
        Row: {
          created_at: string | null
          id: string | null
          pay_period_end: string | null
          pay_period_start: string | null
          payrun_name: string | null
          processed_payslips: number | null
          status: string | null
          total_employees: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          pay_period_end?: string | null
          pay_period_start?: string | null
          payrun_name?: string | null
          processed_payslips?: never
          status?: string | null
          total_employees?: never
        }
        Update: {
          created_at?: string | null
          id?: string | null
          pay_period_end?: string | null
          pay_period_start?: string | null
          payrun_name?: string | null
          processed_payslips?: never
          status?: string | null
          total_employees?: never
        }
        Relationships: []
      }
      v_authenticated_profiles: {
        Row: {
          auth_user_id: string | null
          cpq_role: string | null
          department: string | null
          email: string | null
          first_name: string | null
          is_active: boolean | null
          last_name: string | null
          profile_id: string | null
          role_description: string | null
          role_id: string | null
          role_slug: string | null
          specialization: string | null
          user_role_slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "public_user_profiles_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "public_user_profiles_user_role_slug_fkey"
            columns: ["user_role_slug"]
            isOneToOne: false
            referencedRelation: "public_user_roles"
            referencedColumns: ["role_slug"]
          },
          {
            foreignKeyName: "public_user_profiles_user_role_slug_fkey"
            columns: ["user_role_slug"]
            isOneToOne: false
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["role_slug"]
          },
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_authenticated_profiles"
            referencedColumns: ["auth_user_id"]
          },
        ]
      }
    }
    Functions: {
      archive_old_template_versions: {
        Args: { template_id: string; keep_versions?: number }
        Returns: number
      }
      assign_role_to_user: {
        Args: { user_id: string; role_name: string }
        Returns: undefined
      }
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_template_version: {
        Args: {
          original_template_id: string
          new_name: string
          new_description?: string
          new_template_data?: Json
        }
        Returns: string
      }
      generate_quote_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_mirrored_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          external_table_id: string
          supabase_table_name: string
          schema_definition: Json
          record_count: number
          last_synced: string
          created_at: string
          updated_at: string
          is_active: boolean
        }[]
      }
      get_template_history: {
        Args: { template_id: string }
        Returns: {
          id: string
          name: string
          version: number
          created_at: string
          created_by_name: string
        }[]
      }
      increment_template_usage: {
        Args: { template_id: string }
        Returns: undefined
      }
      reset_daily_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_monthly_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      safe_log_audit_trail: {
        Args: {
          p_action: string
          p_table_name: string
          p_record_id: string
          p_user_id: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: undefined
      }
      user_has_role: {
        Args: { role_name: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "employee"
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
  public: {
    Enums: {
      user_role: ["admin", "manager", "employee"],
    },
  },
} as const
