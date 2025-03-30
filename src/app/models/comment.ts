import { User } from "./user";

export class BlogComment {
  id!: number;
  content!: string;
  user!: User;
}
