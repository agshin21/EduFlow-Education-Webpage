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

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  password?: string;
}

const readUser = (): any | null => {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeUser = (user: any) => {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(user);
  if (localStorage.getItem("user")) {
    localStorage.setItem("user", raw);
  } else {
    sessionStorage.setItem("user", raw);
  }
  window.dispatchEvent(new Event("auth-change"));
};

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
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"));
  }
};

export const getCurrentUser = () => readUser();

export const updateUser = async (
  data: UpdateProfileData
): Promise<any> => {
  const currentUser = readUser();
  if (!currentUser || !currentUser.id) {
    toast.error("You must be logged in to update your profile.");
    throw new Error("Not authenticated");
  }

  const payload: UpdateProfileData = { ...data };

  let updatedRemote: any = currentUser;
  try {
    const res = await api.put(`/users/${currentUser.id}`, payload);
    updatedRemote = res.data ?? { ...currentUser, ...payload };
  } catch (err) {
    console.warn(
      "Remote update failed, falling back to local-only update",
      err
    );
    updatedRemote = { ...currentUser, ...payload };
    toast.warning(
      "Saved locally only — server sync failed, will retry on next save."
    );
  }

  writeUser(updatedRemote);
  // Force purchased store to rehydrate under the (possibly unchanged) user id
  usePurchased.persist.rehydrate();

  return updatedRemote;
};

export const uploadAvatar = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file selected");
  if (!file.type.startsWith("image/")) {
    toast.error("Please choose an image file");
    throw new Error("Invalid file type");
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error("Image is too large. Max size is 2 MB.");
    throw new Error("File too large");
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};