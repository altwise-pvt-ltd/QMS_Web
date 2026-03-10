/**
 * Normalizes organization data from various API response shapes.
 */
export const normalizeOrg = (org) => {
  if (!org) return null;
  return {
    organizationId: org.organizationId || org.OrganizationId,
    name: org.legalCompanyName || org.LegalCompanyName || "",
    industry: org.industrySector || org.IndustrySector || "",
    phone: org.businessPhone || org.BusinessPhone || "",
    websiteUrl: org.corporateWebsite || org.CorporateWebsite || "",
    address: org.registeredAddress || org.RegisteredAddress || "",
    logo: org.logoPath || org.companyLogoPath || org.CompanyLogo || null,
    status: org.status,
    createdAt: org.createdAt || org.CreatedAt,
    createdBy: org.createdBy || org.CreatedBy,
  };
};

/**
 * Matches a user profile strictly to an organization from a list.
 * Only matches if the organizationId in profile matches an organization in the list.
 */
export const matchUserOrg = (profileData, orgList = []) => {
  try {
    const profile = profileData?.isSuccess ? profileData.value : profileData;
    const profileOrgId = profile?.organizationId || profile?.OrganizationId;

    if (!profileOrgId || String(profileOrgId) === "0") return null;

    if (!Array.isArray(orgList)) return null;

    const matched = orgList.find(
      (org) =>
        String(org.organizationId || org.OrganizationId) === String(profileOrgId),
    );

    return matched ? normalizeOrg(matched) : null;
  } catch (error) {
    console.error("matchUserOrg failed:", error);
    return null;
  }
};
