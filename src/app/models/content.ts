import { PostCategory } from "../constants/post-category";

export class Content {
  by!: string;
  comments!: number;
  htmlContent!: any;
  shortContent!: string;
  likes!: number;
  postTitle!: string;
  publishedAt!: string;
  category!: PostCategory;
  image!: string
}
