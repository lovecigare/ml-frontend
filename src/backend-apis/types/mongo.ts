type BaseMongoDBDocument = {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

type WithoutBaseMongoDBDocument<T> = Omit<T, "_id" | "createdAt" | "updatedAt">;

export type { BaseMongoDBDocument, WithoutBaseMongoDBDocument };
