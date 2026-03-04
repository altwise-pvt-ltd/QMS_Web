import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "./AuthContext";
import { setOrganization } from "../store/slices/authSlice";
import organizationService from "../features/onboarding/services/organizationService";

const normalizeOrg = (org) => {
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

const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    user,
    organization,
    loading: authLoading,
  } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  const [orgCheckDone, setOrgCheckDone] = useState(false);
  const [orgChecking, setOrgChecking] = useState(false);

  useEffect(() => {
    // Already have org, already checked, auth still loading, or not logged in — skip
    if (
      authLoading ||
      organization ||
      orgCheckDone ||
      orgChecking ||
      !isAuthenticated
    ) {
      if (organization && !orgCheckDone) setOrgCheckDone(true);
      return;
    }

    const fetchOrg = async () => {
      setOrgChecking(true);
      try {
        const orgResponse = await organizationService.getAllOrganizations();

        const orgList = Array.isArray(orgResponse)
          ? orgResponse
          : orgResponse?.isSuccess
            ? orgResponse.value
            : [];

        if (orgList.length > 0) {
          const currentUserId = user?.id || user?.adminUserId;
          let matched = null;

          if (user?.organizationId) {
            matched = orgList.find(
              (org) =>
                String(org.organizationId || org.OrganizationId) ===
                String(user.organizationId),
            );
          }
          if (!matched && currentUserId) {
            matched = orgList.find(
              (org) =>
                String(org.createdBy || org.CreatedBy) ===
                String(currentUserId),
            );
          }

          if (matched) {
            dispatch(setOrganization(normalizeOrg(matched)));
          }
        }
      } catch (err) {
        console.error("ProtectedRoute: org fetch failed", err);
      } finally {
        setOrgCheckDone(true);
        setOrgChecking(false);
      }
    };

    fetchOrg();
  }, [
    authLoading,
    isAuthenticated,
    organization,
    orgCheckDone,
    orgChecking,
    user,
    dispatch,
  ]);

  // Show spinner while auth loads OR while we're checking for org
  if (authLoading || (isAuthenticated && !organization && !orgCheckDone)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only redirect to onboarding after confirming no org exists
  if (orgCheckDone && !organization && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
