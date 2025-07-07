// Utility to fetch user profile from backend using access_token
import { fetchWithAuth } from "@/lib/api";

export async function fetchUserProfile() {
  return fetchWithAuth("https://scrummood-be-production.up.railway.app/api/auth/profile");
}
