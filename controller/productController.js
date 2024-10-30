import Product from "../models/Product.js";

const PAGE_SIZE = 1;

export const postProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;
    const newProduct = await Product.create({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });
    return res.status(200).json({ status: "success", newProduct });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "fail", error: "빈칸을 전부 채워주세요" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { page, name } = req.query;
    const cond = name
      ? { name: { $regex: name, $options: "i" }, isDeleted: false }
      : { isDeleted: false };
    let query = Product.find(cond);
    let response = { status: "success" };
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      //최종 몇개 페이지인지
      // 데이터가 총 몇개있는지
      const totalItemNum = await Product.countDocuments(cond);
      // 데이터 총 개수 / 10
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const productList = await query.exec();
    response.data = productList;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { sku, name, size, image, price, description, stock, status } =
      req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, size, image, price, description, stock, status },
      { new: true }
    );
    if (!product) throw new Error("item doesn't exist");
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id, { isDeleted: true });
    if (!product) throw new Error("No item found");
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error("No item found");
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};
