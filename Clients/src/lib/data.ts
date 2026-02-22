  
 export interface userDataProps {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  image?: string;
  phone: string;
}

export interface authResponse {
    success: boolean;
    user: userDataProps;
    token: string;
    message: string;
  }
  
