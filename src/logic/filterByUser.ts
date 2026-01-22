// This is the personalization layer. 
// Each user only sees deals from retailers they care about.

//Logic:
//Accept all deals and a user.
//Filter deals where retailer name is in user.preferred_retailers.
//Group by retailer name.

import { Deal } from "../types/deal";
import { User } from "../types/user";

export function filterByUser(deals: Deal[], user: User) {
  const grouped: Record<string, Deal[]> = {};

  const filtered = deals
    .filter(d => user.preferred_retailers.includes(d.retailer.name))
    .sort((a, b) => a.price - b.price)
    .slice(0, 6);

  for (const deal of filtered) {
    if (!user.preferred_retailers.includes(deal.retailer.name)) {
      continue;
    }

    const retailer = deal.retailer.name;

    if (!grouped[retailer]) {
      grouped[retailer] = [];
    }

    grouped[retailer].push(deal);
  }

  return grouped;
}

