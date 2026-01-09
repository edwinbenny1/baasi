import { db } from "../config/firebaseAdmin.js";
import { findMatchingSuppliers } from "../services/supplierService.js";
import { sendSupplierMail } from "../services/emailService.js";

export const createRequirement = async (req, res) => {
  try {
    const data = req.body;

    // Save requirement
    await db.collection("requirements").add({
      ...data,
      createdAt: new Date(),
    });

    // Find matching suppliers
    const suppliers = await findMatchingSuppliers(
      data.category,
      data.subCategory
    );

    // Send emails
    for (const supplier of suppliers) {
      if (supplier.email) {
        await sendSupplierMail(supplier.email, data);
      }
    }

    res.status(200).json({
      success: true,
      message: "Requirement submitted & emails sent",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
