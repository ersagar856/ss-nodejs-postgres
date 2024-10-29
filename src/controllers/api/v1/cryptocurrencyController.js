const pool = require("../../../db/index.js");

exports.addCryptocurrency = async (req, res) => {
  // console.log("Request body:", req.body);
  const cryptocurrency = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    for (const cryptocurrencyData of cryptocurrency) {
      const {
        id,
        name,
        symbol,
        slug,
        cmcRank,
        circulatingSupply,
        selfReportedCirculatingSupply,
        totalSupply,
        maxSupply,
        isActive,
        lastUpdated,
        dateAdded,
        quotes,
        isAudited,
        auditInfoList,
        badges
      } = cryptocurrencyData;

      const cryptoResult = await client.query(
        `INSERT INTO cryptocurrencies 
        (name, symbol, slug, cmc_rank, circulating_supply, self_reported_circulating_supply, total_supply, max_supply, is_active, last_updated, date_added, is_audited, audit_info_list,badges) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14) 
        RETURNING id`,
        [
          name,
          symbol,
          slug,
          cmcRank,
          circulatingSupply,
          selfReportedCirculatingSupply,
          totalSupply,
          maxSupply,
          isActive,
          lastUpdated,
          dateAdded,
          isAudited,
          JSON.stringify(auditInfoList),
          badges 
        ]
      );
      const cryptocurrencyId = cryptoResult.rows[0].id;
      if (Array.isArray(quotes)) {
        for (const quote of quotes) {
          const {
            name,
            price,
            volume24h,
            marketCap,
            selfReportedMarketCap,
            percentChange1h,
            percentChange24h,
            percentChange7d,
            lastUpdated,
            percentChange30d,
            percentChange60d,
            percentChange90d,
            fullyDilutedMarketCap,
            marketCapByTotalSupply,
            dominance,
            turnover,
            ytdPriceChangePercentage,
            percentChange1y,
          } = quote;
          await client.query(
            `INSERT INTO cryptocurrencies_quotes 
            (cryptocurrency_id, name, price, volume_24h, market_cap, self_reported_market_cap, percent_change_1h, percent_change_24h, percent_change_7d, last_updated, percent_change_30d, percent_change_60d, percent_change_90d, fully_diluted_market_cap, market_cap_by_total_supply, dominance, turnover, ytd_price_change_percentage, percent_change_1y) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
            [
                cryptocurrencyId,
                name,
                price,
                volume24h,
                marketCap,
                selfReportedMarketCap,
                percentChange1h,
                percentChange24h,
                percentChange7d,
                lastUpdated,
                percentChange30d,
                percentChange60d,
                percentChange90d,
                fullyDilutedMarketCap,
                marketCapByTotalSupply,
                dominance,
                turnover,
                ytdPriceChangePercentage,
                percentChange1y
            ]
        );
        }
      }
      await client.query("COMMIT");
      console.log("Data inserted successfully");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error during transaction", error.stack);

  } finally {
    client.release();
  }
};

exports.getCryptocurrencyList = async(req,res)=>{
   
}
