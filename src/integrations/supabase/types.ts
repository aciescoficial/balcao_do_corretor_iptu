export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      associado_interesse: {
        Row: {
          celular: string
          cidade: string
          cpf: string
          created_at: string | null
          creci: string | null
          email: string
          estado: string
          id: string
          motivo_interesse: string | null
          nome: string
          pagamento_confirmado: boolean | null
          pagamento_data: string | null
          pagamento_url: string | null
          sobrenome: string
          status: string
          updated_at: string | null
        }
        Insert: {
          celular: string
          cidade: string
          cpf: string
          created_at?: string | null
          creci?: string | null
          email: string
          estado: string
          id?: string
          motivo_interesse?: string | null
          nome: string
          pagamento_confirmado?: boolean | null
          pagamento_data?: string | null
          pagamento_url?: string | null
          sobrenome: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          celular?: string
          cidade?: string
          cpf?: string
          created_at?: string | null
          creci?: string | null
          email?: string
          estado?: string
          id?: string
          motivo_interesse?: string | null
          nome?: string
          pagamento_confirmado?: boolean | null
          pagamento_data?: string | null
          pagamento_url?: string | null
          sobrenome?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      associados: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string
          complemento: string | null
          comprovante_url: string | null
          cpf: string
          created_at: string
          creci: string | null
          data_nascimento: string | null
          data_ultimo_pagamento: string | null
          email: string
          estado: string | null
          id: string
          nome: string
          numero: string | null
          placa_principal: string | null
          placa_secundaria: string | null
          rua: string | null
          sobrenome: string
          status: Database["public"]["Enums"]["status_type"]
          telefone: string
          tipo_associado: string | null
          tipo_pagamento: string | null
          updated_at: string
          validade: string | null
          valor_devido: string | null
          valor_pago: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade: string
          complemento?: string | null
          comprovante_url?: string | null
          cpf: string
          created_at?: string
          creci?: string | null
          data_nascimento?: string | null
          data_ultimo_pagamento?: string | null
          email: string
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          placa_principal?: string | null
          placa_secundaria?: string | null
          rua?: string | null
          sobrenome: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone: string
          tipo_associado?: string | null
          tipo_pagamento?: string | null
          updated_at?: string
          validade?: string | null
          valor_devido?: string | null
          valor_pago?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string
          complemento?: string | null
          comprovante_url?: string | null
          cpf?: string
          created_at?: string
          creci?: string | null
          data_nascimento?: string | null
          data_ultimo_pagamento?: string | null
          email?: string
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          placa_principal?: string | null
          placa_secundaria?: string | null
          rua?: string | null
          sobrenome?: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string
          tipo_associado?: string | null
          tipo_pagamento?: string | null
          updated_at?: string
          validade?: string | null
          valor_devido?: string | null
          valor_pago?: string | null
        }
        Relationships: []
      }
      association_types: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          interest_payment_by:
            | Database["public"]["Enums"]["interest_payment_by"]
            | null
          max_installments: number | null
          payment_methods: Database["public"]["Enums"]["payment_method"][]
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          interest_payment_by?:
            | Database["public"]["Enums"]["interest_payment_by"]
            | null
          max_installments?: number | null
          payment_methods: Database["public"]["Enums"]["payment_method"][]
          title: string
          updated_at?: string
          value: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          interest_payment_by?:
            | Database["public"]["Enums"]["interest_payment_by"]
            | null
          max_installments?: number | null
          payment_methods?: Database["public"]["Enums"]["payment_method"][]
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      carteirinha_solicitacoes: {
        Row: {
          associado_id: string
          codigo_rastreio: string | null
          complemento: string | null
          created_at: string
          email: string | null
          endereco_entrega: string
          id: string
          nome: string
          observacoes: string | null
          pagamento_id: string | null
          sobrenome: string
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          associado_id: string
          codigo_rastreio?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          endereco_entrega: string
          id?: string
          nome: string
          observacoes?: string | null
          pagamento_id?: string | null
          sobrenome: string
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          associado_id?: string
          codigo_rastreio?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          endereco_entrega?: string
          id?: string
          nome?: string
          observacoes?: string | null
          pagamento_id?: string | null
          sobrenome?: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "carteirinha_solicitacoes_associado_id_fkey"
            columns: ["associado_id"]
            isOneToOne: false
            referencedRelation: "associados"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          configuracoes: Json | null
          created_at: string | null
          id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          configuracoes?: Json | null
          created_at?: string | null
          id?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          configuracoes?: Json | null
          created_at?: string | null
          id?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          body: string
          created_at: string | null
          id: string
          recipient: string
          status: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          recipient: string
          status: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          recipient?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          assunto: string
          codigo: string
          corpo: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          assunto: string
          codigo: string
          corpo: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          assunto?: string
          codigo?: string
          corpo?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          capa_url: string | null
          cep: string
          cidade: string
          cnpj: string
          created_at: string
          desconto: string
          email: string
          endereco: string
          id: string
          instagram: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          nicho: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia: string
          produtos: string
          razao_social: string
          responsavel: string
          site: string | null
          status: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at: string
          video_url: string | null
          whatsapp: string | null
        }
        Insert: {
          capa_url?: string | null
          cep: string
          cidade: string
          cnpj: string
          created_at?: string
          desconto: string
          email: string
          endereco: string
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          nicho: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia: string
          produtos: string
          razao_social: string
          responsavel: string
          site?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at?: string
          video_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          capa_url?: string | null
          cep?: string
          cidade?: string
          cnpj?: string
          created_at?: string
          desconto?: string
          email?: string
          endereco?: string
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          nicho?: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia?: string
          produtos?: string
          razao_social?: string
          responsavel?: string
          site?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string
          updated_at?: string
          video_url?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      member_subscriptions: {
        Row: {
          asaas_customer_id: string | null
          asaas_subscription_id: string | null
          associado_id: string
          association_type_id: string
          created_at: string
          id: string
          installments: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: string | null
          updated_at: string
        }
        Insert: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          associado_id: string
          association_type_id: string
          created_at?: string
          id?: string
          installments?: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: string | null
          updated_at?: string
        }
        Update: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          associado_id?: string
          association_type_id?: string
          created_at?: string
          id?: string
          installments?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_subscriptions_associado_id_fkey"
            columns: ["associado_id"]
            isOneToOne: false
            referencedRelation: "associados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_subscriptions_association_type_id_fkey"
            columns: ["association_type_id"]
            isOneToOne: false
            referencedRelation: "association_types"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_logs: {
        Row: {
          created_at: string
          details: string | null
          entity_type: string
          event_type: string
          format: string | null
          id: string
          record_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          entity_type: string
          event_type: string
          format?: string | null
          id?: string
          record_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          entity_type?: string
          event_type?: string
          format?: string | null
          id?: string
          record_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      pagamentos_associado: {
        Row: {
          ano_referencia: number
          associado_id: string
          comprovante_url: string | null
          created_at: string | null
          data_pagamento: string
          descricao: string | null
          id: string
          metodo: string | null
          origem: string
          status: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          ano_referencia: number
          associado_id: string
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento: string
          descricao?: string | null
          id?: string
          metodo?: string | null
          origem?: string
          status?: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          ano_referencia?: number
          associado_id?: string
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento?: string
          descricao?: string | null
          id?: string
          metodo?: string | null
          origem?: string
          status?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_associado_associado_id_fkey"
            columns: ["associado_id"]
            isOneToOne: false
            referencedRelation: "associados"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          enabled_menus: string[]
          enabled_permissions: string[]
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled_menus?: string[]
          enabled_permissions?: string[]
          id?: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled_menus?: string[]
          enabled_permissions?: string[]
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      signup_tokens: {
        Row: {
          associado_interesse_id: string
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
        }
        Insert: {
          associado_interesse_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
        }
        Update: {
          associado_interesse_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "signup_tokens_associado_interesse_id_fkey"
            columns: ["associado_interesse_id"]
            isOneToOne: false
            referencedRelation: "associado_interesse"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          active: boolean | null
          associado_id: string | null
          avatar_url: string | null
          city: string | null
          cpf: string | null
          created_at: string
          creci: string | null
          email: string | null
          empresa_id: string | null
          first_login: boolean | null
          id: string
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          associado_id?: string | null
          avatar_url?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          creci?: string | null
          email?: string | null
          empresa_id?: string | null
          first_login?: boolean | null
          id: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          associado_id?: string | null
          avatar_url?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          creci?: string | null
          email?: string | null
          empresa_id?: string | null
          first_login?: boolean | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_associado_id_fkey"
            columns: ["associado_id"]
            isOneToOne: false
            referencedRelation: "associados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          enabled: boolean
          id: string
          secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_access_logs: {
        Row: {
          created_at: string
          event: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          user_id: string
          role_to_check: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      interest_payment_by: "associacao" | "associado"
      nicho_type:
        | "Alimentação"
        | "Saúde"
        | "Educação"
        | "Serviços"
        | "Comércio"
        | "Lazer"
        | "Tecnologia"
        | "Outro"
      payment_method: "cartao" | "pix" | "boleto"
      status_type: "ativo" | "pendente" | "inativo" | "aprovado"
      user_role:
        | "admin"
        | "user"
        | "diretoria"
        | "conveniado"
        | "associado"
        | "empresa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interest_payment_by: ["associacao", "associado"],
      nicho_type: [
        "Alimentação",
        "Saúde",
        "Educação",
        "Serviços",
        "Comércio",
        "Lazer",
        "Tecnologia",
        "Outro",
      ],
      payment_method: ["cartao", "pix", "boleto"],
      status_type: ["ativo", "pendente", "inativo", "aprovado"],
      user_role: [
        "admin",
        "user",
        "diretoria",
        "conveniado",
        "associado",
        "empresa",
      ],
    },
  },
} as const
