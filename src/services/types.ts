export interface Auth {
  tokenType: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface Profile {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
}
