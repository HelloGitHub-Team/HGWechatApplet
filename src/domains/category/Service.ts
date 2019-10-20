import Api, { Response } from "@/utils/Api";
import { ICategory } from "./entity";
import awaitWrap from "@/utils/await-wrap";

type ICategories = ICategory[];

class CategoryService {
  async getCategories() {
    const [error, data] = await awaitWrap<Response<ICategories>>(
      Api.get<Response<ICategories>>("/category/")
    );

    if (error) {
      throw error.message || "获取分类列表失败！";
    }

    return data.payload;
  }
}

export default new CategoryService();
