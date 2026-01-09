import { db } from "../config/firebaseAdmin.js";

export const findMatchingSuppliers = async (category, subCategory) => {
  const snapshot = await db
    .collection("shops")
    .where("category", "==", category)
    .where("subCategory", "==", subCategory)
    .get();

  const suppliers = [];
  snapshot.forEach((doc) => suppliers.push(doc.data()));

  return suppliers;
};
