export const ROLES = {
  ADMIN: "admin",
  STUDENT: "etudiant",
  PROFESSOR: "professeur",
  LOCATOR: "locateur",
  OWNER: "proprietaire",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrateur",
  [ROLES.STUDENT]: "Étudiant",
  [ROLES.PROFESSOR]: "Professeur",
  [ROLES.LOCATOR]: "Locateur",
  [ROLES.OWNER]: "Propriétaire",
};

export const DASHBOARD_ROLES = [ROLES.PROFESSOR, ROLES.LOCATOR, ROLES.OWNER];
