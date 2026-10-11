/**
 * @deprecated
 * تم إيقاف هذا الملف بالكامل واستبداله بـ cloudinaryApi.js
 * هذا الملف لم يعد له أي دور أو تأثير مستقل داخل المشروع.
 */

import {
    uploadImage,
    replaceImage,
    deleteImage,
    getPublicIdFromUrl,
} from "./cloudinaryApi";

// توافقية احتياطية فقط - يتم توجيه كل العمليات إلى cloudinaryApi.js المعتمد حصراً
export const uploadToCloudinary = uploadImage;
export const deleteFromCloudinary = deleteImage;
export { getPublicIdFromUrl, replaceImage, uploadImage, deleteImage };

export default {
    uploadToCloudinary,
    deleteFromCloudinary,
    getPublicIdFromUrl,
    uploadImage,
    replaceImage,
    deleteImage,
};