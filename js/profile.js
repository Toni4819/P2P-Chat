// Profile storage
const profileKey = "p2p_profile";

function loadProfile() {
  const raw = localStorage.getItem(profileKey);
  if (!raw) {
    const id = crypto.randomUUID();
    const profile = { id, name: "Device " + id.slice(0, 4) };
    localStorage.setItem(profileKey, JSON.stringify(profile));
    return profile;
  }
  return JSON.parse(raw);
}

function saveProfile(profile) {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

let profile = loadProfile();
