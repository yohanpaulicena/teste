export type Role = "client" | "admin";

export const currentUser = {
  id: 42,
  role: "client" as Role,
  clientId: 123,
  clientName: "Cliente X",
};

export const clientOptions = [
  { id: 123, name: "Cliente X" },
  { id: 456, name: "Cliente Aurora" },
  { id: 789, name: "Cliente Nimbus" },
];
