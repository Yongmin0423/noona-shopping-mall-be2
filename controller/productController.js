import Product from "../models/Product.js";

const PAGE_SIZE = 10;

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
    // MongoDB 중복 키 오류(E11000) 검사
    if (error.code === 11000 && error.keyValue && error.keyValue.sku) {
      return res
        .status(400)
        .json({ status: "fail", error: "중복된 sku값 입니다." });
    }

    // 필수 필드 누락 등 유효성 검사 오류 처리
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ status: "fail", error: "빈 부분을 채워주세요." });
    }
    return res.status(400).json({ status: "fail", error: error.message });
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

export const checkStock = async (item) => {
  // 내가 사려는 아이템 재고 정보 들고오기
  const product = await Product.findById(item.productId);
  // 내가 사려는 아이템 qty, 재고 비교
  if (product.stock[item.size] < item.qty) {
    // 재고가 불충분하면 불충분 메시지와 함께 데이터 반환
    return {
      isVerify: false,
      message: `${product.name}의 ${item.size} 재고가 부족합니다.`,
    };
  }

  return { isVerify: true };
};

// 아이템 목록에 대한 재고 체크 및 차감
export const checkItemListStock = async (itemList) => {
  const insufficientStockItems = []; // 재고가 부족한 아이템을 저장할 배열

  // 재고 확인
  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await checkStock(item);

      if (!stockCheck.isVerify) {
        insufficientStockItems.push({ item, message: stockCheck.message });
      }

      return stockCheck;
    })
  );

  // 재고가 충분한 아이템만 차감
  if (insufficientStockItems.length === 0) {
    await Promise.all(
      itemList.map(async (item) => {
        const product = await Product.findById(item.productId);
        const newStock = { ...product.stock };
        newStock[item.size] -= item.qty;
        product.stock = newStock;
        await product.save();
      })
    );
  }

  return insufficientStockItems;
};
