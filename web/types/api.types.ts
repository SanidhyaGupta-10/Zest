
// User

export interface User {
  id: string;
  email: string;
  name:string;
  imageUrl: string;
  createdAt: string;
}

// Sync User

export interface SyncUserInput {
  email: string;
  name: string;
  imageUrl: string;
}