//High level flow 
//1. Load deals.json
//2. For each deal:
//   a. upsert retailer by name
//   b. insert product if not exists
//   c. insert deal, ignore conflict

import fs from "fs";
import path from "path";
import { supabase } from "../db/client";

type RawDeal = {
  retailer: string;
  product: string;
  size: string;
  price: number;
  start: string;
  end: string;
  category: string;
};

export async function ingestDeals() {
  const filePath = path.join(__dirname, "../../data/deals.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const deals: RawDeal[] = JSON.parse(raw);

  for (const deal of deals) {
    // 1. Upsert retailer
    const { data: retailer } = await supabase
      .from("retailers")
      .upsert({ name: deal.retailer }, { onConflict: "name" })
      .select()
      .single();

    if (!retailer) continue;

    // 2. Insert product if missing
    const { data: product } = await supabase
      .from("products")
      .select()
      .eq("name", deal.product)
      .eq("size", deal.size)
      .maybeSingle();

    let productId = product?.id;

    if (!productId) {
      const { data: newProduct } = await supabase
        .from("products")
        .insert({
          name: deal.product,
          size: deal.size,
          category: deal.category,
        })
        .select()
        .single();

      productId = newProduct?.id;
    }

    if (!productId) continue;

    // 3. Insert deal, ignore duplicates
    await supabase.from("deals").upsert(
      {
        retailer_id: retailer.id,
        product_id: productId,
        price: deal.price,
        start_date: deal.start,
        end_date: deal.end,
      },
      { onConflict: "retailer_id,product_id,start_date" }
    );
  }

  console.log("Deal ingestion complete");
}

