export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  folder: string;
  tags: string[];
  isFavorite: boolean;
  readLater: boolean;
  createdAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  originalFolder?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type Language = 'ar' | 'en';