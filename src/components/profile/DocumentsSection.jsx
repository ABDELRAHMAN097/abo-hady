import { useState, useRef } from "react";
import {
    FiCheckCircle,
    FiFileText,
    FiUpload,
    FiClock,
    FiLoader,
    FiExternalLink,
} from "react-icons/fi";
import { uploadToCloudinary } from "@/services/cloudinary";
import { updateUserProfileData } from "@/services/profileService";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n/i18n/context";

const DocumentsSection = ({ user, role, onProfileUpdated }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const [uploadingDocKey, setUploadingDocKey] = useState(null);
    const fileInputRef = useRef(null);
    const activeDocKeyRef = useRef(null);

    const userDocs = user?.documents || {};

    const documentDefs =
        role === "driver"
            ? [
                  {
                      key: "licenseFront",
                      title: isArabic ? "رخصة القيادة - الوجه الأمامي" : "Driving License - Front",
                  },
                  {
                      key: "licenseBack",
                      title: isArabic ? "رخصة القيادة - الوجه الخلفي" : "Driving License - Back",
                  },
                  {
                      key: "nationalId",
                      title: isArabic ? "بطاقة الرقم القومي / جواز السفر" : "National ID / Passport",
                  },
              ]
            : [
                  {
                      key: "nationalId",
                      title: isArabic ? "بطاقة الرقم القومي / جواز السفر" : "National ID / Passport",
                  },
                  {
                      key: "licenseFront",
                      title: isArabic ? "رخصة القيادة" : "Driving License",
                  },
              ];

    const handleUploadClick = (docKey) => {
        if (uploadingDocKey) return;
        activeDocKeyRef.current = docKey;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        const docKey = activeDocKeyRef.current;
        if (!file || !docKey) return;

        e.target.value = "";

        if (file.size > 10 * 1024 * 1024) {
            toast.error(
                isArabic
                    ? "حجم الملف كبير جداً، الحد الأقصى 10 ميجابايت"
                    : "File size exceeds 10MB"
            );
            return;
        }

        try {
            setUploadingDocKey(docKey);
            const uploadRes = await uploadToCloudinary(file);
            const updatedDocuments = {
                ...userDocs,
                [docKey]: {
                    url: uploadRes.imageUrl,
                    publicId: uploadRes.publicId,
                    status: "Pending",
                    uploadedAt: new Date().toISOString(),
                },
            };

            const targetUid = user?.uid || user?.id;
            if (targetUid) {
                await updateUserProfileData(targetUid, {
                    documents: updatedDocuments,
                });
            }

            if (onProfileUpdated) {
                await onProfileUpdated();
            }

            toast.success(
                isArabic
                    ? "تم رفع المستند بنجاح وهو قيد المراجعة!"
                    : "Document uploaded successfully and pending review!"
            );
        } catch (error) {
            console.error("Document upload failed:", error);
            toast.error(
                error.message ||
                    (isArabic ? "فشل رفع المستند" : "Failed to upload document")
            );
        } finally {
            setUploadingDocKey(null);
            activeDocKeyRef.current = null;
        }
    };

    return (
        <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            <div>
                <h3 className="text-lg font-semibold text-[#F9FAFB]">
                    {isArabic ? "المستندات والوثائق" : "Documents"}
                </h3>

                <p className="mt-1 text-sm text-[#9CA3AF]">
                    {isArabic
                        ? "رفع وإدارة وثائق الهوية ورخصة القيادة المعتمدة."
                        : "Manage your uploaded verification documents and approval status."}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {documentDefs.map((def) => {
                    const docData = userDocs[def.key];
                    const isUploaded = Boolean(docData?.url);
                    const isVerified = docData?.status === "Verified";
                    const isPending = docData?.status === "Pending";
                    const isCurrentUploading = uploadingDocKey === def.key;

                    return (
                        <div
                            key={def.key}
                            className="rounded-2xl border border-white/5 bg-[#0B0C10]/60 p-5 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
                                            <FiFileText size={19} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-[#F9FAFB]">
                                                {def.title}
                                            </p>

                                            <div className="mt-1 flex items-center gap-1.5 text-xs">
                                                {isVerified ? (
                                                    <span className="flex items-center gap-1 text-[#10B981]">
                                                        <FiCheckCircle size={13} />
                                                        {isArabic ? "تم التحقق والاعتماد" : "Verified"}
                                                    </span>
                                                ) : isPending ? (
                                                    <span className="flex items-center gap-1 text-yellow-400">
                                                        <FiClock size={13} />
                                                        {isArabic ? "قيد المراجعة" : "Pending Review"}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        {isArabic ? "لم يتم الرفع بعد" : "Not Uploaded"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isUploaded && (
                                        <a
                                            href={docData.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-gray-400 hover:text-[#10B981] transition"
                                            title={isArabic ? "معاينة المستند" : "View Document"}
                                        >
                                            <FiExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleUploadClick(def.key)}
                                disabled={isCurrentUploading}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#1F2937] px-4 py-2.5 text-sm font-medium text-[#F9FAFB] transition hover:bg-white/10 cursor-pointer disabled:opacity-75"
                            >
                                {isCurrentUploading ? (
                                    <>
                                        <FiLoader size={16} className="animate-spin text-[#10B981]" />
                                        <span>{isArabic ? "جاري الرفع..." : "Uploading..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <FiUpload size={16} />
                                        <span>
                                            {isUploaded
                                                ? isArabic
                                                    ? "استبدال المستند"
                                                    : "Replace Document"
                                                : isArabic
                                                ? "رفع المستند"
                                                : "Upload Document"}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DocumentsSection;