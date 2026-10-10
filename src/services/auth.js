/**
 * Central Auth & User Services Hub
 * Re-exports all authentication, profile, user query/management, and utility functions
 * for backwards compatibility and consolidated access.
 */

// Core Firebase Authentication Service
export * from "./authService";

// User Profile Service
export * from "./profileService";

// User Administration & Queries Service
export * from "./userService";

// Text, Phone, and Search Utilities
export * from "./userUtils";

// Firebase App instances
export { auth, db } from "../config/firebase";