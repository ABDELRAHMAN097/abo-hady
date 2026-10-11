const API_URL = "https://cloudinary-uploader-theta.vercel.app";

/**
 * استخراج public_id من رابط Cloudinary
 * @param {string} url
 * @returns {string}
 */
export function getPublicIdFromUrl(url) {
    if (
        !url ||
        typeof url !== "string" ||
        !url.includes("cloudinary.com")
    ) {
        return "";
    }

    try {
        const splitUpload = url.split("/upload/");

        if (splitUpload.length < 2) {
            return "";
        }

        let rest = splitUpload[1];

        // إزالة رقم الإصدار v12345/ إن وجد
        const versionMatch = rest.match(/(?:^|\/)v\d+\/(.+)$/);
        if (versionMatch) {
            rest = versionMatch[1];
        }

        // إزالة الـ query string
        rest = rest.split("?")[0];

        // إزالة امتداد الملف (.jpg, .png, إلخ)
        rest = rest.replace(/\.[^/.]+$/, "");

        return decodeURIComponent(rest).trim();
    } catch (error) {
        console.error("Failed to extract Cloudinary public ID:", error);
        return "";
    }
}

async function handle(res) {
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error(`خطأ في استجابة السيرفر (${res.status})`);
    }

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "حصل خطأ في السيرفر");
    }

    return {
        ...data,
        imageUrl: data.url || data.imageUrl || "",
        publicId: data.public_id || data.publicId || "",
    };
}

/**
 * رفع صورة جديدة
 * بترجع { url, public_id, imageUrl, publicId }
 * @param {File|Blob} file
 */
export async function uploadImage(file) {
    if (!file) {
        throw new Error("لم يتم اختيار أي ملف للرفع");
    }

    const form = new FormData();
    form.append("image", file);

    const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form,
    });

    return handle(res);
}

/**
 * استبدال صورة موجودة بنفس الـ public_id
 * إن لم يوجد public_id أو فشل الاستبدال يتم الرفع كصورة جديدة تلقائياً
 * بترجع { url, public_id, imageUrl, publicId }
 * @param {File|Blob} file
 * @param {string} publicIdOrUrl
 */
export async function replaceImage(file, publicIdOrUrl) {
    if (!file) {
        throw new Error("لم يتم اختيار أي ملف للاستبدال");
    }

    let publicId = publicIdOrUrl;
    if (
        typeof publicIdOrUrl === "string" &&
        (publicIdOrUrl.startsWith("http://") ||
            publicIdOrUrl.startsWith("https://"))
    ) {
        publicId = getPublicIdFromUrl(publicIdOrUrl);
    }

    if (!publicId) {
        return uploadImage(file);
    }

    publicId = String(publicId).trim().replace(/\.[^/.]+$/, "");

    const form = new FormData();
    form.append("image", file);
    form.append("public_id", publicId);

    try {
        const res = await fetch(`${API_URL}/replace`, {
            method: "PUT",
            body: form,
        });

        return await handle(res);
    } catch (error) {
        console.warn("فشل استبدال الصورة بالسيرفر، جاري رفع صورة جديدة كبديل:", error);
        return uploadImage(file);
    }
}

/**
 * حذف صورة من Cloudinary
 * تقبل public_id أو رابط الصورة كاملاً
 * بترجع { result: 'ok', ... }
 * @param {string} publicIdOrUrl
 */
export async function deleteImage(publicIdOrUrl) {
    if (!publicIdOrUrl) {
        return { result: "ok", skipped: true };
    }

    let publicId = publicIdOrUrl;
    if (
        typeof publicIdOrUrl === "string" &&
        (publicIdOrUrl.startsWith("http://") ||
            publicIdOrUrl.startsWith("https://"))
    ) {
        publicId = getPublicIdFromUrl(publicIdOrUrl);
    }

    if (!publicId) {
        return { result: "ok", skipped: true };
    }

    publicId = String(publicId).trim().replace(/\.[^/.]+$/, "");

    const res = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
    });

    return handle(res);
}
