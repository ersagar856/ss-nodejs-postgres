const pool = require("../../../db/index.js");

exports.getCategoryWithTags = async (limit, offset, categoryId) => {
  const client = await pool.connect();
  try {
    let sql = `
        SELECT 
          categories.name,
          COALESCE(
          CONCAT('[', STRING_AGG(
            CONCAT(
                '{"id":"', category_tags.id::text,
                '", "name":"', category_tags.name,
                '", "slug":"', category_tags.slug,
                '", "popular":', category_tags.popular::text,
                '}'
            ), ',' ORDER BY category_tags.id), ']'
        )
    ) AS tags
        FROM categories 
        INNER JOIN category_tags ON categories.id = category_tags.category_id
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
