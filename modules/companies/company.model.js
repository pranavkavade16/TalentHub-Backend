import mongoose from "mongoose";

import { fileSchema } from "../../shared/schemas/core/file.schema.js";
import { addressSchema } from "../../shared/schemas/core/address.schema.js";
import { contactSchema } from "../../shared/schemas/core/contact.schema.js";
import { socialLinksSchema } from "../../shared/schemas/core/socialLinks.schema.js";
import { toJSONPlugin } from "../../shared/plungins/toJSON.plugin.js";
import { COMPANY_SIZE } from "../../shared/constants/company/companySize.js";
import { INDUSTRIES } from "../../shared/constants/company/industries.js";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    logo: fileSchema,

    description: {
      type: String,
      maxlength: 3000,
    },

    industry: {
      type: String,
      enum: Object.values(INDUSTRIES),
      required: true,
      index: true,
    },

    companySize: {
      type: String,
      enum: Object.values(COMPANY_SIZE),
      required: true,
    },

    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    website: {
      type: String,
      trim: true,
    },

    address: addressSchema,

    contact: contactSchema,

    socialLinks: socialLinksSchema,

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

companySchema.index({ name: "text" });

companySchema.index({
  industry: 1,
  companySize: 1,
});

companySchema.plugin(toJSONPlugin);

export default mongoose.model("Company", companySchema);
