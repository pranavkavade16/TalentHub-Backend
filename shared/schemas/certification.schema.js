import { Schema } from "mongoose";

export const certificationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  issuingOrganization: {
    type: String,
    required: true,
  },

  issueDate: Date,

  expiryDate: Date,

  credentialId: String,

  credentialUrl: String,
});
