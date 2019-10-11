export interface IProject {
  url: string;
  name: string;
  volume: string;
  img_url: string;
  category: string;
  sort_desc: string;
  description: string;
  update_time: string;
}

export default class Project implements IProject {
  url: string;
  name: string;
  volume: string;
  img_url: string;
  category: string;
  sort_desc: string;
  description: string;
  update_time: string;

  constructor(project: IProject) {
    const {
      url,
      name,
      volume,
      img_url,
      category,
      sort_desc,
      description,
      update_time
    } = project;

    this.url = url;
    this.name = name;
    this.volume = volume;
    this.img_url = img_url;
    this.category = category;
    this.sort_desc = sort_desc;
    this.description = description;
    this.update_time = update_time;
  }
}
