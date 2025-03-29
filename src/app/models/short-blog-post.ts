import { User } from "./user";

export interface BlogPost {
  id: number;
  title: string;
  imageLink: string;
  shortContent: string;
  category: string;
  likeCount: number;
  commentCount: number;
}
