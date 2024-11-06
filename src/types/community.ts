export interface Post {
  post_id: string;
  user_id: string;
  post_title: string;
  post_content: string;
  created_at: string;
  updated_at: string;
  like: number;
  comment: number;
  post_img?: string[];
  location: string;
  price: string;
  params: { type: string };
  user_info: { user_nickname: string };
}

export interface PostCreateType {
  user_id: string;
  title: string;
  content: string;
  formattedUrls: string;
  price: string;
  location: string;
  type: string;
}