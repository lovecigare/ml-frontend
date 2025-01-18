import { SocialLinks } from "./common";
import { BaseMongoDBDocument } from "./mongo";

type Admin = BaseMongoDBDocument & {
  address: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  socialLinks?: SocialLinks;
};

export type { Admin };
