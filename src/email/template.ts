//generateEmail(user, groupedDeals) => { html, text }

export function generateEmail(user: any, groupedDeals: Record<string, any[]>) {
  let htmlDeals = "";
  let textDeals = "";

  for (const retailer in groupedDeals) {
    htmlDeals += `<h3>${retailer}</h3><ul>`;
    textDeals += `\n${retailer}\n`;
    
    for (const deal of groupedDeals[retailer] ?? []) {
      htmlDeals += `
        <li>
          ${deal.product.name} (${deal.product.size})<br/>
          $${deal.price} | ${deal.start_date} to ${deal.end_date}
        </li>
      `;

      textDeals += `- ${deal.product.name} (${deal.product.size}) $${deal.price}\n`;
    }

    htmlDeals += "</ul>";
  }

  const html = `
    <div style="background:#F4FBF8;padding:20px;font-family:Arial">
      <div style="background:#0FB872;color:white;padding:12px">
        <h1>Prox Weekly Deals</h1>
      </div>
      ${htmlDeals}
      <div style="background:#0A4D3C;color:white;padding:10px">
        <a href="#" style="color:white">Manage preferences</a>
      </div>
    </div>
  `;

  const text = `Prox Weekly Deals\n${textDeals}\nManage preferences`;

  return { html, text };
}
