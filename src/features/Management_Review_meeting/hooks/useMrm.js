import { useMrmContext } from "../context/MrmContext";

/**
 * Hook to access Management Review Meeting state and actions.
 * Now uses a centralized Context to prevent duplicate API hits.
 */
export const useMrm = () => {
  return useMrmContext();
};
