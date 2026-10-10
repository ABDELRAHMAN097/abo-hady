import {
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const USERS_COLLECTION = "users";

export const DEFAULT_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;
export const MAX_SEARCH_VALUES = 30;

/**
 * Converts Arabic and Persian numerals to English digits.
 */
export const convertArabicNumerals = (value) => {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return String(value ?? "")
        .replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d))
        .replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
};

/**
 * Normalizes Arabic text by stripping diacritics, tatweel, and normalizing alef, ta marbuta, ya.
 */
export const normalizeArabic = (value) => {
    return convertArabicNumerals(value)
        .replace(/[\u064B-\u065F\u0670]/g, "") // Tashkeel / diacritics
        .replace(/\u0640/g, "") // Tatweel
        .replace(/[أإآٱ]/g, "ا") // Alef variants
        .replace(/ة/g, "ه") // Ta marbuta
        .replace(/ى/g, "ي") // Ya / Alef maqsura
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
};

export const normalizeText = (value) => normalizeArabic(value);

/**
 * Normalizes a phone number to digits only, handling Arabic/Persian digits.
 */
export const normalizePhone = (value) => {
    return convertArabicNumerals(value).replace(/\D/g, "");
};

/**
 * Generates normalized search fields for storing in Firestore user documents.
 */
export const getSearchFields = ({
    name = "",
    displayName = "",
    email = "",
    phone = "",
    phoneNumber = "",
}) => ({
    nameNormalized: normalizeArabic(
        name || displayName
    ),
    emailNormalized: String(email ?? "").toLowerCase().trim(),
    phoneNormalized: normalizePhone(
        phone || phoneNumber
    ),
});

/**
 * Updates search fields on a user document if they are missing or out of sync.
 */
export const saveUserSearchFields = async (
    userId,
    userData
) => {
    if (!userId || !userData) {
        return;
    }

    const searchFields =
        getSearchFields(userData);

    const hasSearchFields =
        userData.nameNormalized ===
            searchFields.nameNormalized &&
        userData.emailNormalized ===
            searchFields.emailNormalized &&
        userData.phoneNormalized ===
            searchFields.phoneNormalized;

    if (hasSearchFields) {
        return;
    }

    await updateDoc(
        doc(
            db,
            USERS_COLLECTION,
            userId
        ),
        searchFields
    );
};

/**
 * Chunks an array into smaller slices.
 */
export const chunkArray = (
    array,
    size
) => {
    const chunks = [];

    for (
        let index = 0;
        index < array.length;
        index += size
    ) {
        chunks.push(
            array.slice(
                index,
                index + size
            )
        );
    }

    return chunks;
};

/**
 * Maps a Firestore document snapshot to a user object.
 */
export const mapUser = (docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
});

/**
 * Splits query string into separate search targets.
 * Supports delimiters: commas (English and Arabic), semicolons, pipes, newlines.
 * If no delimiters are present, checks if multiple emails or phones are space-separated.
 * Otherwise treats string as a unified search phrase.
 */
export const parseSearchTargets = (queryStr) => {
    if (!queryStr) return [];

    const hasDelimiter = /[,،;|\n]/.test(queryStr);
    if (hasDelimiter) {
        return queryStr
            .split(/[,،;|\n]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }

    const trimmed = queryStr.trim();
    const spaceTokens = trimmed.split(/\s+/).filter(Boolean);
    if (spaceTokens.length > 1) {
        const areAllPhonesOrEmails = spaceTokens.every(
            (token) => token.includes("@") || /^\d{6,}$/.test(normalizePhone(token))
        );
        if (areAllPhonesOrEmails) {
            return spaceTokens;
        }
    }

    return [trimmed];
};
