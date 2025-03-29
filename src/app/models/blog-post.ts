import { PostCategory } from "../constants/post-category";
import { User } from "./user";

export class BlogPost {
  id!: number;
  title!: string;
  shortContent!: string;
  shortContentImageUrl!: string;
  category!: PostCategory;
  htmlContent!: Uint8Array;
  publishedAt!: string;
  likeCount!: number;
  commentCount!: number;
  viewCount!: number;
  comments!: Comment[];
  likedBy!: User[];
  postOwner!: User;
}
