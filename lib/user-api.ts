// Utility to fetch user profile from backend using access_token
import { fetchWithAuth } from "@/lib/api";

export async function fetchUserProfile() {
  return fetchWithAuth("http://127.0.0.1:5000/api/auth/profile");
}
