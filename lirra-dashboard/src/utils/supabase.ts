import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  onAuthStateChange: (
    callback: (event: string, session: any) => void
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
export const profile = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        plans (
          name,
          features
        ),
        credential_keys (
          credential_key,
          expires_at,
          billing_cycle
        )
      `
      )
      .eq("id", userId)
      .single();

    return { data, error };
  },

  update: async (userId: string, updates: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  },
};

export const transactions = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    return { data, error };
  },

  create: async (userId: string, transaction: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert({ ...transaction, user_id: userId })
      .select()
      .single();

    return { data, error };
  },

  delete: async (transactionId: string, userId: string) => {
    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("user_id", userId)
      .select()
      .single();

    return { data, error };
  },
};

export const customCategories = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from("custom_categories")
      .select("*")
      .eq("user_id", userId)
      .single();

    return { data, error };
  },

  upsert: async (
    userId: string,
    categories: { income: string[]; expense: string[] }
  ) => {
    const { data, error } = await supabase
      .from("custom_categories")
      .upsert(
        {
          user_id: userId,
          income_categories: categories.income,
          expense_categories: categories.expense,
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    return { data, error };
  },
};
