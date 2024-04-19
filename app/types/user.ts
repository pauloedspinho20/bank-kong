export interface IUser extends INodeWP {
  avatar?: {
    url: string;
  };
  capabilites?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
  registeredDate?: string;
  username: string;
}
