// This file handles data retrieval and normalization. 
// It converts raw database rows into strongly typed objects that the rest of the app can trust.

import { supabase } from "../db/client";
import { Deal } from "../types/deal";

type SupabaseDeal = {
  price: any;
  start_date: any;
  end_date: any;
  retailer: any;
  product: any;
};

export async function selectDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("deals")
    .select(`
      price,
      start_date,
      end_date,
      retailer:retailers(name),
      product:products(name, size)
    `);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load deals");
  }

  if (!data) {
    throw new Error("No deals returned");
  }

  const rows = data as unknown as SupabaseDeal[];

  const normalized: Deal[] = [];

  for (const d of rows) {
    if (!d.retailer || !d.product) {
      continue;
    }

    normalized.push({
      price: d.price,
      start_date: d.start_date,
      end_date: d.end_date,
      retailer: {
        name: d.retailer.name,
      },
      product: {
        name: d.product.name,
        size: d.product.size,
      },
    });
  }

  return normalized;
}
