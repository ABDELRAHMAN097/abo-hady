import { useEffect, useState } from "react";

import { uploadToCloudinary, deleteFromCloudinary } from "@/services/cloudinary";


import {
    getLandingPage,
    saveLandingPage,
} from "@/services/landing";

export default function EditLanding() {
    /* =========================================================
       STATES
    ========================================================= */

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [heroUploading, setHeroUploading] =
        useState(false);

    const [galleryUploading, setGalleryUploading] =
        useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [heroFile, setHeroFile] =
        useState(null);

    const [galleryFiles, setGalleryFiles] =
        useState({});

    /* =========================================================
       FORM
    ========================================================= */

    const [form, setForm] = useState({
        hero: {
            ar: {
                title: "",
                subtitle: "",
                description: "",
                buttonText: "",
                buttonLink: "",
            },

            en: {
                title: "",
                subtitle: "",
                description: "",
                buttonText: "",
                buttonLink: "",
            },

            image: {
                imageUrl: "",
                publicId: "",
                alt: "",
            },
        },

        services: {
            ar: {
                eyebrow: "",
                title: "",
                description: "",
            },

            en: {
                eyebrow: "",
                title: "",
                description: "",
            },

            cards: {},
        },

        featuredCars: [],

        gallery: [],
    });

    /* =========================================================
       LOAD LANDING PAGE
    ========================================================= */

    useEffect(() => {
        const loadLandingPage = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getLandingPage({
                        forceRefresh: true,
                    });

                if (!data) {
                    return;
                }

                setForm({
                    hero: {
                        ar: {
                            title:
                                data.hero?.ar
                                    ?.title || "",

                            subtitle:
                                data.hero?.ar
                                    ?.subtitle || "",

                            description:
                                data.hero?.ar
                                    ?.description || "",

                            buttonText:
                                data.hero?.ar
                                    ?.buttonText || "",

                            buttonLink:
                                data.hero?.ar
                                    ?.buttonLink || "",
                        },

                        en: {
                            title:
                                data.hero?.en
                                    ?.title || "",

                            subtitle:
                                data.hero?.en
                                    ?.subtitle || "",

                            description:
                                data.hero?.en
                                    ?.description || "",

                            buttonText:
                                data.hero?.en
                                    ?.buttonText || "",

                            buttonLink:
                                data.hero?.en
                                    ?.buttonLink || "",
                        },

                        image: {
                            imageUrl:
                                data.hero?.image
                                    ?.imageUrl || "",

                            publicId:
                                data.hero?.image
                                    ?.publicId || "",

                            alt:
                                data.hero?.image
                                    ?.alt || "",
                        },
                    },

                    services: {
                        ar: {
                            eyebrow:
                                data.services?.ar?.eyebrow ||
                                "",

                            title:
                                data.services?.ar?.title ||
                                "",

                            description:
                                data.services?.ar?.description ||
                                "",
                        },

                        en: {
                            eyebrow:
                                data.services?.en?.eyebrow ||
                                "",

                            title:
                                data.services?.en?.title ||
                                "",

                            description:
                                data.services?.en?.description ||
                                "",
                        },

                        cards:
                            data.services?.cards || {},
                    },

                    featuredCars:
                        Array.isArray(
                            data.featuredCars
                        )
                            ? data.featuredCars
                            : [],

                    gallery:
                        Array.isArray(
                            data.gallery
                        )
                            ? data.gallery
                            : [],
                });
            } catch (err) {
                console.error(err);

                setError(
                    err.message ||
                    "Failed to load landing page."
                );
            } finally {
                setLoading(false);
            }
        };

        loadLandingPage();
    }, []);

    /* =========================================================
       HERO LANGUAGE CHANGE
    ========================================================= */

    const handleHeroChange = (
        language,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,

            hero: {
                ...prev.hero,

                [language]: {
                    ...prev.hero[language],
                    [field]: value,
                },
            },
        }));
    };

    /* =========================================================
       HERO ALT CHANGE
    ========================================================= */

    const handleHeroAltChange = (e) => {
        const { value } = e.target;

        setForm((prev) => ({
            ...prev,

            hero: {
                ...prev.hero,

                image: {
                    ...prev.hero.image,
                    alt: value,
                },
            },
        }));
    };

    /* =========================================================
       HERO FILE SELECT
    ========================================================= */

    const handleHeroFileChange = (e) => {
        const file =
            e.target.files?.[0] || null;

        setHeroFile(file);

        setError("");
        setSuccess("");
    };

    /* =========================================================
       UPLOAD HERO IMAGE
    ========================================================= */

    const handleHeroUpload = async () => {
        if (!heroFile) {
            setError(
                "Please select a hero image first."
            );

            return;
        }

        try {
            setHeroUploading(true);

            setError("");
            setSuccess("");

            /* =====================================================
               SAVE OLD PUBLIC ID
            ===================================================== */

            const oldPublicId =
                form?.hero?.image?.publicId || "";

            /* =====================================================
               UPLOAD NEW IMAGE FIRST
            ===================================================== */

            const uploaded =
                await uploadToCloudinary(
                    heroFile
                );

            /* =====================================================
               UPDATE FORM WITH NEW IMAGE
            ===================================================== */

            setForm((prev) => ({
                ...prev,

                hero: {
                    ...prev.hero,

                    image: {
                        ...prev.hero.image,

                        imageUrl:
                            uploaded.imageUrl,

                        publicId:
                            uploaded.publicId,
                    },
                },
            }));

            setHeroFile(null);

            /* =====================================================
               DELETE OLD IMAGE
            ===================================================== */

            if (
                oldPublicId &&
                oldPublicId !==
                uploaded.publicId
            ) {
                try {
                    await deleteFromCloudinary(
                        oldPublicId
                    );
                } catch (deleteError) {
                    console.error(
                        "Old hero image deletion failed:",
                        deleteError
                    );

                    setError(
                        "New hero image uploaded successfully, but the old image could not be deleted."
                    );

                    return;
                }
            }

            /* =====================================================
               SUCCESS
            ===================================================== */

            setSuccess(
                "Hero image uploaded successfully and the old image was deleted."
            );
        } catch (err) {
            console.error(
                "Hero upload error:",
                err
            );

            setError(
                err.message ||
                "Failed to upload hero image."
            );
        } finally {
            setHeroUploading(false);
        }
    };

    /* =========================================================
       REMOVE HERO IMAGE (DELETES FROM CLOUDINARY)
    ========================================================= */

    const handleHeroRemove = async () => {
        const oldPublicId = form?.hero?.image?.publicId;

        if (oldPublicId) {
            try {
                await deleteFromCloudinary(oldPublicId);
            } catch (deleteError) {
                console.warn(
                    "Old hero image deletion failed:",
                    deleteError
                );
            }
        }

        setForm((prev) => ({
            ...prev,
            hero: {
                ...prev.hero,
                image: {
                    imageUrl: "",
                    publicId: "",
                    alt: "",
                },
            },
        }));

        setHeroFile(null);
        setSuccess("Hero image removed successfully from Cloudinary.");
    };

    /* =========================================================
       SERVICE
    ========================================================= */
    /* =========================================================
UPDATE SERVICES SECTION
========================================================= */

    const updateServicesContent = (
        language,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,

            services: {
                ...prev.services,

                [language]: {
                    ...prev.services[language],

                    [field]: value,
                },
            },
        }));
    };

    /* =========================================================
       ADD SERVICE
    ========================================================= */

    const addService = () => {
        const id = `service-${crypto.randomUUID()}`;

        setForm((prev) => ({
            ...prev,

            services: {
                ...prev.services,

                cards: {
                    ...prev.services.cards,

                    [id]: {
                        id,

                        icon: "car",

                        ar: {
                            title: "",
                            description: "",
                        },

                        en: {
                            title: "",
                            description: "",
                        },
                    },
                },
            },
        }));
    };

    /* =========================================================
       UPDATE SERVICE CARD
    ========================================================= */

    const updateService = (
        serviceId,
        language,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,

            services: {
                ...prev.services,

                cards: {
                    ...prev.services.cards,

                    [serviceId]: {
                        ...prev.services.cards[
                        serviceId
                        ],

                        [language]: {
                            ...prev.services.cards[
                            serviceId
                            ]?.[language],

                            [field]: value,
                        },
                    },
                },
            },
        }));
    };

    /* =========================================================
       UPDATE SERVICE ICON
    ========================================================= */

    const updateServiceIcon = (
        serviceId,
        value
    ) => {
        setForm((prev) => ({
            ...prev,

            services: {
                ...prev.services,

                cards: {
                    ...prev.services.cards,

                    [serviceId]: {
                        ...prev.services.cards[
                        serviceId
                        ],

                        icon: value,
                    },
                },
            },
        }));
    };

    /* =========================================================
       DELETE SERVICE
    ========================================================= */

    const removeService = (serviceId) => {
        setForm((prev) => {
            const cards = {
                ...prev.services.cards,
            };

            delete cards[serviceId];

            return {
                ...prev,

                services: {
                    ...prev.services,

                    cards,
                },
            };
        });
    };

    /* =========================================================
       ADD GALLERY IMAGE
    ========================================================= */

    const addGalleryImage = () => {
        setForm((prev) => ({
            ...prev,

            gallery: [
                ...prev.gallery,

                {
                    id: crypto.randomUUID(),

                    imageUrl: "",

                    publicId: "",

                    alt: "",
                },
            ],
        }));
    };

    /* =========================================================
       GALLERY FILE SELECT
    ========================================================= */

    const handleGalleryFileChange = (
        index,
        file
    ) => {
        if (!file) return;

        setGalleryFiles((prev) => ({
            ...prev,
            [index]: file,
        }));

        setError("");
        setSuccess("");
    };

    /* =========================================================
       UPLOAD GALLERY IMAGE
    ========================================================= */

    const handleGalleryUpload = async (
        index
    ) => {
        const file =
            galleryFiles[index];

        if (!file) {
            setError(
                "Please select a gallery image first."
            );

            return;
        }

        try {
            setGalleryUploading(index);

            setError("");
            setSuccess("");

            const oldPublicId =
                form?.gallery?.[index]?.publicId || "";

            const uploaded =
                await uploadToCloudinary(
                    file
                );

            // Delete old image from Cloudinary to preserve space
            if (
                oldPublicId &&
                oldPublicId !== uploaded.publicId
            ) {
                try {
                    await deleteFromCloudinary(
                        oldPublicId
                    );
                } catch (deleteError) {
                    console.warn(
                        "Old gallery image deletion failed:",
                        deleteError
                    );
                }
            }

            setForm((prev) => {
                const gallery = [
                    ...prev.gallery,
                ];

                gallery[index] = {
                    ...gallery[index],

                    imageUrl:
                        uploaded.imageUrl,

                    publicId:
                        uploaded.publicId,
                };

                return {
                    ...prev,
                    gallery,
                };
            });

            setGalleryFiles((prev) => {
                const files = {
                    ...prev,
                };

                delete files[index];

                return files;
            });

            setSuccess(
                "Gallery image uploaded successfully and previous image removed."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to upload gallery image."
            );
        } finally {
            setGalleryUploading(null);
        }
    };

    /* =========================================================
       UPDATE GALLERY ITEM
    ========================================================= */

    const updateGalleryItem = (
        index,
        field,
        value
    ) => {
        setForm((prev) => {
            const gallery = [
                ...prev.gallery,
            ];

            gallery[index] = {
                ...gallery[index],
                [field]: value,
            };

            return {
                ...prev,
                gallery,
            };
        });
    };

    /* =========================================================
       DELETE GALLERY IMAGE
    ========================================================= */

    const removeGalleryImage = async (index) => {
        const item = form?.gallery?.[index];
        const oldPublicId = item?.publicId;

        // Delete from Cloudinary to preserve storage space
        if (oldPublicId) {
            try {
                await deleteFromCloudinary(oldPublicId);
            } catch (deleteError) {
                console.warn(
                    "Failed to delete removed gallery image from Cloudinary:",
                    deleteError
                );
            }
        }

        setForm((prev) => ({
            ...prev,

            gallery:
                prev.gallery.filter(
                    (_, galleryIndex) =>
                        galleryIndex !== index
                ),
        }));

        setGalleryFiles((prev) => {
            const files = {
                ...prev,
            };

            delete files[index];

            return files;
        });
    };

    /* =========================================================
       SAVE LANDING PAGE
    ========================================================= */

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            setError("");
            setSuccess("");

            await saveLandingPage({
                hero: form.hero,

                services:
                    form.services,

                featuredCars:
                    form.featuredCars,

                gallery:
                    form.gallery,
            });

            setSuccess(
                "Landing page saved successfully. Visitors will see the changes automatically."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to save landing page."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-background p-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary-color" />

                    <p className="text-text-secondary">
                        Loading landing page...
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================================
       UI
    ========================================================= */

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
                                Edit Landing Page
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                                Manage the content displayed
                                on your public website.
                            </p>
                        </div>

                        <div className="rounded-xl border border-primary-color/20 bg-primary-color/10 px-4 py-3">
                            <p className="text-xs text-text-muted">
                                Publishing
                            </p>

                            <p className="mt-1 text-sm font-semibold text-primary-color">
                                Live Website
                            </p>
                        </div>

                    </div>
                </div>

                {/* =================================================
                    ALERTS
                ================================================= */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm leading-6 text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-primary-color/30 bg-primary-color/10 px-4 py-4 text-sm leading-6 text-primary-color">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSave}
                    className="space-y-6"
                >

                    {/* =================================================
                        HERO CONTENT
                    ================================================= */}

                    <section className="overflow-hidden rounded-2xl border border-border bg-card">

                        <div className="border-b border-border p-5 sm:p-6">

                            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                                Hero Section
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                Create the main hero content
                                in Arabic and English.
                            </p>

                        </div>

                        <div className="p-5 sm:p-6">

                            <div className="grid gap-6 xl:grid-cols-2">

                                {/* =================================================
                                    ARABIC
                                ================================================= */}

                                <div
                                    dir="rtl"
                                    className="rounded-2xl border border-border bg-background p-5"
                                >

                                    <div className="mb-6 flex items-center justify-between">

                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">
                                                العربية
                                            </h3>

                                            <p className="mt-1 text-xs text-text-muted">
                                                Arabic Content
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-primary-color/10 px-3 py-1 text-xs font-semibold text-primary-color">
                                            AR
                                        </span>

                                    </div>

                                    <div className="space-y-5">

                                        {/* TITLE */}

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                العنوان
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    form
                                                        .hero
                                                        .ar
                                                        .title
                                                }
                                                onChange={(e) =>
                                                    handleHeroChange(
                                                        "ar",
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="الفخامة تبدأ من هنا"
                                                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent"
                                            />
                                        </div>

                                        {/* SUBTITLE */}

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                العنوان الفرعي
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    form
                                                        .hero
                                                        .ar
                                                        .subtitle
                                                }
                                                onChange={(e) =>
                                                    handleHeroChange(
                                                        "ar",
                                                        "subtitle",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="استمتع بتجربة قيادة استثنائية"
                                                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent"
                                            />
                                        </div>

                                        {/* DESCRIPTION */}

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                الوصف
                                            </label>

                                            <textarea
                                                rows={5}
                                                value={
                                                    form
                                                        .hero
                                                        .ar
                                                        .description
                                                }
                                                onChange={(e) =>
                                                    handleHeroChange(
                                                        "ar",
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="اكتب وصف الموقع..."
                                                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 leading-7 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent"
                                            />
                                        </div>

                                        {/* BUTTON */}

                                        <div className="grid gap-5 sm:grid-cols-2">

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                                    نص الزر
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        form
                                                            .hero
                                                            .ar
                                                            .buttonText
                                                    }
                                                    onChange={(e) =>
                                                        handleHeroChange(
                                                            "ar",
                                                            "buttonText",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="احجز سيارتك"
                                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                                    رابط الزر
                                                </label>

                                                <input
                                                    type="text"
                                                    dir="ltr"
                                                    value={
                                                        form
                                                            .hero
                                                            .ar
                                                            .buttonLink
                                                    }
                                                    onChange={(e) =>
                                                        handleHeroChange(
                                                            "ar",
                                                            "buttonLink",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="/booking"
                                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                />
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                {/* =================================================
                                    ENGLISH
                                ================================================= */}

                                <div
                                    dir="ltr"
                                    className="rounded-2xl border border-border bg-background p-5"
                                >

                                    <div className="mb-6 flex items-center justify-between">

                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">
                                                English
                                            </h3>

                                            <p className="mt-1 text-xs text-text-muted">
                                                English Content
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                                            EN
                                        </span>

                                    </div>

                                    <div className="space-y-5">

                                        {/* TITLE */}

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                Title
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    form
                                                        .hero
                                                        .en
                                                        .title
                                                }
                                                onChange={(e) =>
                                                    handleHeroChange(
                                                        "en",
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Drive Luxury"
                                                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent"
                                            />
                                        </div>

                                        {/* SUBTITLE */}

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                Subtitle
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    form
                                                        .hero
                                                        .en
                                                        .subtitle
                                                }
                                                onChange={(e) =>
                                                    handleHeroChange(
                                                        "en",
                                                        "subtitle",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Experience Excellence"
                                                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent"
                                            />
                                        </div>

                                        {/* DESCRIPTION */}

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                Description
                                            </label>

                                            <textarea
                                                rows={5}
                                                value={
                                                    form
                                                        .hero
                                                        .en
                                                        .description
                                                }
                                                onChange={(e) =>
                                                    handleHeroChange(
                                                        "en",
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Write your landing page description..."
                                                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 leading-7 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent"
                                            />
                                        </div>

                                        {/* BUTTON */}

                                        <div className="grid gap-5 sm:grid-cols-2">

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                                    Button Text
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        form
                                                            .hero
                                                            .en
                                                            .buttonText
                                                    }
                                                    onChange={(e) =>
                                                        handleHeroChange(
                                                            "en",
                                                            "buttonText",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Book Your Ride"
                                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                                    Button Link
                                                </label>

                                                <input
                                                    type="text"
                                                    dir="ltr"
                                                    value={
                                                        form
                                                            .hero
                                                            .en
                                                            .buttonLink
                                                    }
                                                    onChange={(e) =>
                                                        handleHeroChange(
                                                            "en",
                                                            "buttonLink",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="/booking"
                                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                />
                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        HERO IMAGE
                    ================================================= */}

                    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                                Hero Image
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                Upload the main website
                                image through Cloudinary.
                            </p>
                        </div>

                        {form.hero.image.imageUrl ? (
                            <div className="mb-6 overflow-hidden rounded-2xl border border-border">

                                <img
                                    src={
                                        form.hero
                                            .image
                                            .imageUrl
                                    }
                                    alt={
                                        form.hero
                                            .image
                                            .alt ||
                                        "Hero"
                                    }
                                    className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
                                />

                            </div>
                        ) : (
                            <div className="mb-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-background sm:h-80">

                                <div className="text-center">
                                    <p className="font-medium text-text-secondary">
                                        No hero image
                                    </p>

                                    <p className="mt-2 text-sm text-text-muted">
                                        Upload an image below.
                                    </p>
                                </div>

                            </div>
                        )}

                        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">

                            <div className="rounded-xl border border-dashed border-border bg-background p-5">

                                <label className="mb-3 block text-sm font-medium text-text-primary">
                                    Select Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={
                                        handleHeroFileChange
                                    }
                                    className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-primary-color file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-primary-hover"
                                />

                                {heroFile && (
                                    <div className="mt-4 rounded-lg border border-border bg-card p-3">

                                        <p className="text-xs text-text-muted">
                                            Selected file
                                        </p>

                                        <p className="mt-1 break-all text-sm font-medium text-text-primary">
                                            {heroFile.name}
                                        </p>

                                    </div>
                                )}

                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">

                                <button
                                    type="button"
                                    onClick={
                                        handleHeroUpload
                                    }
                                    disabled={
                                        !heroFile ||
                                        heroUploading
                                    }
                                    className="w-full rounded-xl bg-secondary-color px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {heroUploading
                                        ? "Uploading..."
                                        : "Upload Image"}
                                </button>

                                {form.hero.image.imageUrl && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleHeroRemove
                                        }
                                        className="rounded-xl border border-red-500/30 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
                                    >
                                        Remove Image
                                    </button>
                                )}

                            </div>

                        </div>

                        {/* ALT */}

                        <div className="mt-6">

                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                Image Alt Text
                            </label>

                            <input
                                type="text"
                                value={
                                    form.hero
                                        .image.alt
                                }
                                onChange={
                                    handleHeroAltChange
                                }
                                placeholder="Luxury car"
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                            />

                        </div>

                    </section>

                    {/* =================================================
    SERVICES
================================================= */}

                    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">

                        {/* =================================================
        HEADER
    ================================================= */}

                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                                    Services
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Manage the services section in Arabic
                                    and English.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addService}
                                className="rounded-xl bg-primary-color px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
                            >
                                + Add Service
                            </button>

                        </div>

                        {/* =================================================
        SECTION CONTENT
    ================================================= */}

                        <div className="grid gap-6 xl:grid-cols-2">

                            {/* =================================================
            ARABIC SECTION CONTENT
        ================================================= */}

                            <div
                                dir="rtl"
                                className="rounded-2xl border border-border bg-background p-5"
                            >

                                <div className="mb-6 flex items-center justify-between">

                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary">
                                            العربية
                                        </h3>

                                        <p className="mt-1 text-xs text-text-muted">
                                            Services Section - Arabic
                                        </p>
                                    </div>

                                    <span className="rounded-lg bg-primary-color/10 px-3 py-1 text-xs font-semibold text-primary-color">
                                        AR
                                    </span>

                                </div>

                                <div className="space-y-5">

                                    {/* EYEBROW */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-text-primary">
                                            النص الصغير
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                form.services.ar.eyebrow
                                            }
                                            onChange={(e) =>
                                                updateServicesContent(
                                                    "ar",
                                                    "eyebrow",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="خدماتنا"
                                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                        />
                                    </div>

                                    {/* TITLE */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-text-primary">
                                            العنوان
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                form.services.ar.title
                                            }
                                            onChange={(e) =>
                                                updateServicesContent(
                                                    "ar",
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="كل ما تحتاجه في تجربة واحدة"
                                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-text-primary">
                                            الوصف
                                        </label>

                                        <textarea
                                            rows={4}
                                            value={
                                                form.services.ar.description
                                            }
                                            onChange={(e) =>
                                                updateServicesContent(
                                                    "ar",
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="نقدم خدمات متكاملة..."
                                            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 leading-7 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* =================================================
            ENGLISH SECTION CONTENT
        ================================================= */}

                            <div
                                dir="ltr"
                                className="rounded-2xl border border-border bg-background p-5"
                            >

                                <div className="mb-6 flex items-center justify-between">

                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary">
                                            English
                                        </h3>

                                        <p className="mt-1 text-xs text-text-muted">
                                            Services Section - English
                                        </p>
                                    </div>

                                    <span className="rounded-lg bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                                        EN
                                    </span>

                                </div>

                                <div className="space-y-5">

                                    {/* EYEBROW */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-text-primary">
                                            Eyebrow
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                form.services.en.eyebrow
                                            }
                                            onChange={(e) =>
                                                updateServicesContent(
                                                    "en",
                                                    "eyebrow",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Our Services"
                                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                        />
                                    </div>

                                    {/* TITLE */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-text-primary">
                                            Title
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                form.services.en.title
                                            }
                                            onChange={(e) =>
                                                updateServicesContent(
                                                    "en",
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Everything You Need in One Experience"
                                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-text-primary">
                                            Description
                                        </label>

                                        <textarea
                                            rows={4}
                                            value={
                                                form.services.en.description
                                            }
                                            onChange={(e) =>
                                                updateServicesContent(
                                                    "en",
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Premium services designed..."
                                            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 leading-7 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
        SERVICE CARDS
    ================================================= */}

                        <div className="mt-8">

                            <div className="mb-5">

                                <h3 className="text-lg font-bold text-text-primary">
                                    Service Cards
                                </h3>

                                <p className="mt-1 text-sm text-text-secondary">
                                    Manage each service in Arabic and English.
                                </p>

                            </div>

                            {/* EMPTY */}

                            {Object.keys(form.services.cards || {}).length === 0 ? (

                                <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">

                                    <p className="text-text-secondary">
                                        No services added yet.
                                    </p>

                                    <p className="mt-2 text-sm text-text-muted">
                                        Click "Add Service" to create your first service.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-6">

                                    {Object.values(
                                        form.services.cards || {}
                                    ).map((service, index) => (

                                        <div
                                            key={
                                                service.id ||
                                                index
                                            }
                                            className="rounded-2xl border border-border bg-background p-5"
                                        >

                                            {/* =================================================
                            CARD HEADER
                        ================================================= */}

                                            <div className="mb-6 flex items-center justify-between gap-4">

                                                <div>

                                                    <h4 className="font-semibold text-text-primary">
                                                        Service #{index + 1}
                                                    </h4>

                                                    <p className="mt-1 text-xs text-text-muted">
                                                        ID: {service.id}
                                                    </p>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeService(
                                                            service.id
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                            {/* =================================================
                            ICON
                        ================================================= */}

                                            <div className="mb-6">

                                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                                    Icon
                                                </label>

                                                <select
                                                    value={
                                                        service.icon ||
                                                        "car"
                                                    }
                                                    onChange={(e) =>
                                                        updateServiceIcon(
                                                            service.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-text-primary outline-none focus:border-accent"
                                                >

                                                    <option value="car">
                                                        Car
                                                    </option>

                                                    <option value="driver">
                                                        Driver
                                                    </option>

                                                    <option value="airport">
                                                        Airport
                                                    </option>

                                                    <option value="security">
                                                        Security
                                                    </option>

                                                </select>

                                            </div>

                                            {/* =================================================
                            LANGUAGES
                        ================================================= */}

                                            <div className="grid gap-6 xl:grid-cols-2">

                                                {/* =================================================
                                ARABIC
                            ================================================= */}

                                                <div
                                                    dir="rtl"
                                                    className="rounded-2xl border border-border bg-card p-5"
                                                >

                                                    <div className="mb-5 flex items-center justify-between">

                                                        <h5 className="font-bold text-text-primary">
                                                            العربية
                                                        </h5>

                                                        <span className="rounded-lg bg-primary-color/10 px-3 py-1 text-xs font-semibold text-primary-color">
                                                            AR
                                                        </span>

                                                    </div>

                                                    <div className="space-y-5">

                                                        {/* TITLE */}

                                                        <div>

                                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                                العنوان
                                                            </label>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    service.ar?.title ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateService(
                                                                        service.id,
                                                                        "ar",
                                                                        "title",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="تأجير السيارات الفاخرة"
                                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                            />

                                                        </div>

                                                        {/* DESCRIPTION */}

                                                        <div>

                                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                                الوصف
                                                            </label>

                                                            <textarea
                                                                rows={4}
                                                                value={
                                                                    service.ar?.description ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateService(
                                                                        service.id,
                                                                        "ar",
                                                                        "description",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="وصف الخدمة..."
                                                                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 leading-7 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                            />

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* =================================================
                                ENGLISH
                            ================================================= */}

                                                <div
                                                    dir="ltr"
                                                    className="rounded-2xl border border-border bg-card p-5"
                                                >

                                                    <div className="mb-5 flex items-center justify-between">

                                                        <h5 className="font-bold text-text-primary">
                                                            English
                                                        </h5>

                                                        <span className="rounded-lg bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                                                            EN
                                                        </span>

                                                    </div>

                                                    <div className="space-y-5">

                                                        {/* TITLE */}

                                                        <div>

                                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                                Title
                                                            </label>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    service.en?.title ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateService(
                                                                        service.id,
                                                                        "en",
                                                                        "title",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Luxury Car Rental"
                                                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                            />

                                                        </div>

                                                        {/* DESCRIPTION */}

                                                        <div>

                                                            <label className="mb-2 block text-sm font-medium text-text-primary">
                                                                Description
                                                            </label>

                                                            <textarea
                                                                rows={4}
                                                                value={
                                                                    service.en?.description ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateService(
                                                                        service.id,
                                                                        "en",
                                                                        "description",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Describe this service..."
                                                                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 leading-7 text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                            />

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </section>



                    {/* =================================================
                        FEATURED CARS
                    ================================================= */}

                    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                                Featured Cars
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                                Featured cars will later
                                be selected from the
                                Cars Management system.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">

                            <p className="font-medium text-text-secondary">
                                No featured cars
                                selected.
                            </p>

                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-muted">
                                Once the car management
                                system is ready, you
                                will be able to select
                                cars and display them
                                on the landing page.
                            </p>

                        </div>

                    </section>

                    {/* =================================================
                        GALLERY
                    ================================================= */}

                    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">

                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                                    Gallery
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-text-secondary">
                                    Upload and manage
                                    gallery images using
                                    Cloudinary.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    addGalleryImage
                                }
                                className="rounded-xl bg-primary-color px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
                            >
                                + Add Image
                            </button>

                        </div>

                        {form.gallery.length ===
                            0 ? (
                            <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">

                                <p className="text-text-secondary">
                                    No gallery images
                                    added yet.
                                </p>

                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                                {form.gallery.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                item.id ||
                                                index
                                            }
                                            className="overflow-hidden rounded-2xl border border-border bg-background"
                                        >

                                            {/* IMAGE */}

                                            {item.imageUrl ? (
                                                <img
                                                    src={
                                                        item.imageUrl
                                                    }
                                                    alt={
                                                        item.alt ||
                                                        "Gallery"
                                                    }
                                                    className="h-52 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-52 items-center justify-center bg-card">

                                                    <span className="text-sm text-text-muted">
                                                        No image
                                                        uploaded
                                                    </span>

                                                </div>
                                            )}

                                            <div className="p-5">

                                                {/* FILE */}

                                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                                    Select Image
                                                </label>

                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleGalleryFileChange(
                                                            index,
                                                            e
                                                                .target
                                                                .files?.[0]
                                                        )
                                                    }
                                                    className="block w-full text-xs text-text-secondary file:mr-2 file:rounded-lg file:border-0 file:bg-primary-color file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                                                />

                                                {galleryFiles[
                                                    index
                                                ] && (
                                                        <p className="mt-3 break-all text-xs text-text-muted">
                                                            {
                                                                galleryFiles[
                                                                    index
                                                                ]
                                                                    .name
                                                            }
                                                        </p>
                                                    )}

                                                {/* UPLOAD */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleGalleryUpload(
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        !galleryFiles[
                                                        index
                                                        ] ||
                                                        galleryUploading ===
                                                        index
                                                    }
                                                    className="mt-4 w-full rounded-xl bg-secondary-color px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {galleryUploading ===
                                                        index
                                                        ? "Uploading..."
                                                        : "Upload to Cloudinary"}
                                                </button>

                                                {/* ALT */}

                                                <div className="mt-5">

                                                    <label className="mb-2 block text-sm font-medium text-text-primary">
                                                        Alt Text
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            item.alt ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateGalleryItem(
                                                                index,
                                                                "alt",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Luxury car"
                                                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
                                                    />

                                                </div>

                                                {/* PUBLIC ID */}

                                                {item.publicId && (
                                                    <div className="mt-4">

                                                        <p className="mb-2 text-xs font-medium text-text-muted">
                                                            Cloudinary Public ID
                                                        </p>

                                                        <p className="break-all rounded-lg bg-card p-3 text-xs text-text-secondary">
                                                            {
                                                                item.publicId
                                                            }
                                                        </p>

                                                    </div>
                                                )}

                                                {/* REMOVE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeGalleryImage(
                                                            index
                                                        )
                                                    }
                                                    className="mt-5 w-full rounded-xl border border-red-500/30 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                                                >
                                                    Remove Image
                                                </button>

                                            </div>
                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                    {/* =================================================
                        SAVE
                    ================================================= */}

                    <div className="sticky bottom-4 z-20 flex justify-end">

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                heroUploading ||
                                galleryUploading !==
                                null
                            }
                            className="w-full rounded-xl bg-primary-color px-8 py-4 font-bold text-white shadow-lg transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Landing Page"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}