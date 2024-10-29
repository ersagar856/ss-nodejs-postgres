const pool = require("../../../db/index.js");
const categoryModel = require("../../../models/api/v1/categoryModel.js");

exports.addCategoryWithTags = async (req, res) => {
  console.log("Request body:", req.body);
  const categories = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const category of categories) {
      const { name, tags } = category;

      const categoryResult = await client.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [name]
      );
      const categoryId = categoryResult.rows[0].id;

      const tagInsertQuery = `
        INSERT INTO category_tags (id, category_id, name, slug, popular)
        VALUES ($1, $2, $3, $4, $5)
      `;

      for (const tag of tags) {
        await client.query(tagInsertQuery, [
          tag.id,
          categoryId,
          tag.name,
          tag.slug,
          tag.popular,
        ]);
      }
    }
    await client.query("COMMIT");
    res
      .status(201)
      .json({ message: "Categories and tags added successfully." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding category with tags:", error);
    res.status(500).json({ error: "Failed to add category with tags." });
  } finally {
    client.release();
  }
};

exports.getCategoryList = async (req, res) => {
  try {
    console.log("Request Query Params:", req.query);

    const page_no = parseInt(req.query.page_no, 10) || 1;
    const records_per_page = 100;
    const offset = (page_no - 1) * records_per_page;
    const limit = records_per_page;
    const category_id = req.query.category_id || "";

    const categoryResponse = await categoryModel.getCategoryWithTags(
      limit,
      offset,
      category_id
    );

    if (categoryResponse && categoryResponse.length > 0) {
        const formattedResponse = categoryResponse.map(category => {
            let tags;
            try {
              tags = JSON.parse(category.tags); 
            } catch (error) {
              console.error("Error parsing tags:", error);
              tags = [];
            }
      
            return {
              name: category.name,
              tags: Array.isArray(tags) ? tags : []
            };
          });
      
          const total_count = formattedResponse.length; 
          return res.status(200).json({
            success: true,
            total_count, 
            categories: formattedResponse, 
          });
    } else {
      return res.status(404).json({ message: "No categories found." });
    }
  } catch (error) {
    console.error("Error fetching category list:", error);
    return res.status(500).send({
      message: "Internal Server Error.",
    });
  }
};
