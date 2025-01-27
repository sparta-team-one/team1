import { Store } from "@/types/map";
import { createClient } from "@/utlis/supabase/client";

const supabase = createClient();

export async function getStoreList(): Promise<Store[]> {
  const { data, error } = await supabase.from("eco_stores").select("*");

  if (error) console.error(error);

  if (!data) return [];

  return data;
}
