// profile.js

export const profileKey = "p2p_profile_peerjs";

export function loadProfile() {
  const raw = localStorage.getItem(profileKey);
  if (!raw) {
    const id = crypto.randomUUID();
    const profile = { id, name: "User " + id.slice(0, 4) };
    localStorage.setItem(profileKey, JSON.stringify(profile));
    return profile;
  }
  return JSON.parse(raw);
}

export function saveProfile(p) {
  localStorage.setItem(profileKey, JSON.stringify(p));
}

export let profile = loadProfile();
