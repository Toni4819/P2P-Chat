// profile.js
import { Database } from "./core/db.js";

export let profile = null;

// Chargement du profil depuis IndexedDB
export async function loadProfile() {
  const p = await Database.getProfile();

  if (p) {
    profile = p;
    return p;
  }

  // Aucun profil → création d’un nouveau
  const id = crypto.randomUUID();
  const peerid = localStorage.getItem("peerjs_id") || crypto.randomUUID();

  const newProfile = {
    id,
    peerid,
    name: "User " + id.slice(0, 4),
  };

  await Database.saveProfile(newProfile.name, newProfile.id, newProfile.peerid);

  profile = newProfile;
  return newProfile;
}

// Sauvegarde du profil
export async function saveProfile(p) {
  profile = p;
  await Database.saveProfile(p.name, p.id, p.peerid);
}
