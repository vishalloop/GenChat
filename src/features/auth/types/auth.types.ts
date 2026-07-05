export interface AuthUser {
    id : string;
    name : string;
    email : string;
}

export interface AuthData {
    name? : string;
    email : string;
    password : string;
};

export interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
};