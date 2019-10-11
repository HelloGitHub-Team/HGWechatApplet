import Api, { WithPage } from "@/utils/Api";

import Project, { IProject } from "./entity";
import awaitWrap from "@/utils/await-wrap";
type IProjects = IProject[];

class ProjectService {
  async getProjects(params: { id: number; page?: number }) {
    const [error, data] = await awaitWrap<WithPage<IProjects>>(
      Api.get<WithPage<IProjects>>("/category/projects", {
        data: params
      })
    );

    if (error) {
      throw error.message || "获取项目列表失败！";
    }

    const { payload, has_more } = data;

    return { has_more, projects: payload.map(p => new Project(p)) };
  }
}

export default new ProjectService();
