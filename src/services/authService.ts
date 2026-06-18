import axios from "axios";
import { toast } from "react-toastify";
import { usePurchased } from "../store/purchasedStore";

const api = axios.create({
  baseURL: "https://6a0818fefa9b27c848faa2b1.mockapi.io",
});

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const allUsers = await api.get("/users");
  const existing = allUsers.data?.find((u: any) => u.email === data.email)
  if (existing){ 
    toast.error("This email already exists")
    throw new Error("This email already exists");
  }

  const res = await api.post("/users", data);
  return res.data;
};

export const loginUser = async (email: string, password: string, rememberMe: boolean) => {
  const res = await api.get("/users");
  
  const user = res.data?.find((u: any) => u.email === email);

  if (!user) { 
    toast.error("User not found!")
    throw new Error("User not found") 
  }
  if (user.password !== password) {
    toast.error("Please sure password is correct!")
    throw new Error("Please sure password is correct")
  }

  if (rememberMe) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("authToken", "mock-token");
  } else {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("authToken", "mock-token");
  }

  return user;
};   

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("authToken");
  usePurchased.setState({ purchased: []})
  usePurchased.persist.rehydrate()
};