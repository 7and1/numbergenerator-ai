/**
 * @deprecated Import from @/lib/config instead
 * This file is kept for backward compatibility during refactoring
 *
 * Please update your imports to use:
 * import { CONFIG_MAP } from "@/lib/config";
 */
export {
  CONFIG_MAP,
  getAllTools,
  getToolsByCategory,
  getToolBySlug,
  getAllToolSlugs,
} from "./config/index";
