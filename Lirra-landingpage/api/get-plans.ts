import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnon = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnon);

export const getPlans = async () => {
  try {
    const { data: plans, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true });

    if (error) throw error;

    return plans;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};
