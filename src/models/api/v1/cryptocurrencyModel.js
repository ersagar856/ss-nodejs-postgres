const pool = require("../../../db/index.js");

exports.getCryptocurrencyData = async (limit, offset, categoryId) => {
  const client = await pool.connect();
  try {
    let sql = `
        SELECT 
          cryptocurrencies.name as name,
          cryptocurrencies.symbol as symbol,
          cryptocurrencies.slug as slug,
          cryptocurrencies.cmc_rank as cmcRank,
          cryptocurrencies.circulating_supply as circulatingSupply,
          cryptocurrencies.self_reported_circulating_supply as selfReportedCirculatingSupply,
          cryptocurrencies.total_supply as totalSupply,
          cryptocurrencies.max_supply as maxSupply,
          cryptocurrencies.is_active as isActive,
          cryptocurrencies.last_updated as lastUpdated,
          cryptocurrencies.date_added as dateAdded,
          cryptocurrencies.is_audited as ,
          cryptocurrencies.audit_info_list,
          COALESCE(
          CONCAT('[', STRING_AGG(
            CONCAT(
                '{"id":"', cryptocurrencies_quotes.id::text,
                '", "name":"', cryptocurrencies_quotes.name,
                '", "slug":"', cryptocurrencies_quotes.slug,
                '", "popular":', cryptocurrencies_quotes.popular::text,
                '}'
            ), ',' ORDER BY category_tags.id), ']'
        )
    ) AS tags
        FROM cryptocurrencies 
        INNER JOIN cryptocurrencies_quotes ON cryptocurrencies.id = cryptocurrencies_quotes.cryptocurrency_id
      `;

    // Check if categoryId is provided
    if (categoryId) {
        sql += ` WHERE category_tags.id = $1::int`;
    }
    sql += ` 
       GROUP BY categories.id, categories.name
        ORDER BY categories.id DESC
        OFFSET $${categoryId ? 2 : 1} LIMIT $${categoryId ? 3 : 2}
      `;

    const values = categoryId ? [categoryId, offset, limit] : [offset, limit];
    const result = await client.query(sql, values);

    if (result.rowCount > 0) {
      return result.rows;
    } else {
      return {}; // Return empty object if no rows found
    }
  } catch (error) {
    console.error("Error fetching category with tags:", error);
    throw new Error("Failed to fetch categories");
  } finally {
    client.release();
  }
};
