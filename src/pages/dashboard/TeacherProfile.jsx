import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuBadgeCheck,
  LuBookOpen,
  LuBuilding2,
  LuChevronRight,
  LuGraduationCap,
  LuMail,
  LuPhone,
  LuSettings,
  LuUsersRound,
} from "react-icons/lu";

import {
  getTeacherProfile,
  updateTeacherProfile,
} from "@/apis/auth";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-color focus:ring-2 focus:ring-blue-100";

export default function TeacherProfile() {
  const { locale } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    bio_ar: "",
    bio_en: "",
    qualification: "",
    experience_years: "",
    profile_image: null,
  });

  const user = profile?.user;
  const teacher = profile?.teacher_profile;
  const summary = profile?.memberships_summary;

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const profileStrength = useMemo(() => {
    const fields = [
      user?.name,
      user?.email,
      user?.phone,
      teacher?.bio_ar || teacher?.bio_en,
      teacher?.qualification,
      teacher?.experience_years,
      profile?.subjects?.length,
      profile?.levels?.length,
    ];

    return Math.round(
      (fields.filter(Boolean).length / fields.length) * 100
    );
  }, [profile, teacher, user]);

  const statistics = [
    {
      label: "Students",
      value: summary?.students_count ?? 0,
      icon: LuUsersRound,
    },
    {
      label: "Groups",
      value: summary?.groups_count ?? 0,
      icon: LuGraduationCap,
    },
    {
      label: "Centers",
      value: summary?.centers_count ?? 0,
      icon: LuBuilding2,
    },
  ];

  const fillForm = (account) => {
    setForm({
      name: account?.user?.name || "",
      bio_ar: account?.teacher_profile?.bio_ar || "",
      bio_en: account?.teacher_profile?.bio_en || "",
      qualification: account?.teacher_profile?.qualification || "",
      experience_years:
        account?.teacher_profile?.experience_years ?? "",
      profile_image: null,
    });

    setImagePreview(
      account?.teacher_profile?.profile_image_url || ""
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getTeacherProfile();

        if (res.success) {
          setProfile(res.data.account);
        }
      } catch (error) {
        console.error("TEACHER PROFILE ERROR:", error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    fillForm(profile);
    setIsEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setForm((current) => ({
      ...current,
      profile_image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("bio_ar", form.bio_ar);
      formData.append("bio_en", form.bio_en);
      formData.append("qualification", form.qualification);
      formData.append("experience_years", form.experience_years);

      if (form.profile_image) {
        formData.append("profile_image", form.profile_image);
      }

      const res = await updateTeacherProfile(formData);

      if (res.success) {
        setProfile(res.data.account);

        localStorage.setItem(
          "talep_user",
          JSON.stringify(res.data.account.user)
        );

        setIsEditing(false);
        toast.success(res.message || "Profile updated successfully.");
      }
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-72 rounded-3xl bg-slate-200" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="h-72 rounded-3xl bg-white" />
          <div className="h-72 rounded-3xl bg-white lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 pb-6"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07183D] via-[#11255C] to-[#2856A5] shadow-xl"
      >
        <div className="absolute -top-24 -end-16 h-72 w-72 rounded-full bg-sky-300/10 blur-2xl" />
        <div className="absolute -bottom-24 start-1/3 h-56 w-56 rounded-full bg-indigo-300/10 blur-2xl" />

        <div className="relative p-5 sm:p-8">
          <div className="mb-7 flex justify-end gap-2">
            <Link
              to={`/${locale}/setting`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <LuSettings className="h-4 w-4" />
              Settings
            </Link>

            <button
              type="button"
              onClick={handleEdit}
              className="rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-500"
            >
              Edit Profile
            </button>
          </div>

          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
              {teacher?.profile_image_url ? (
                <img
                  src={teacher.profile_image_url}
                  alt={user?.name || "Teacher"}
                  className="h-24 w-24 rounded-3xl border-4 border-white/20 object-cover shadow-xl sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white/20 bg-sky-400 text-3xl font-bold text-white shadow-xl sm:h-28 sm:w-28">
                  {initials || "T"}
                </div>
              )}

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
                    {user?.name || "Teacher Profile"}
                  </h1>

                  {teacher?.verification_status === "approved" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                      <LuBadgeCheck className="h-4 w-4" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-sm text-sky-100">
                  {teacher?.teacher_code || "Teacher Account"}
                </p>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
                  {teacher?.bio_en ||
                    teacher?.bio_ar ||
                    "Add your professional bio to complete your profile."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {statistics.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="min-w-[88px] rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-sm sm:min-w-[104px] sm:p-4"
                >
                  <Icon className="mx-auto mb-2 h-5 w-5 text-sky-200" />

                  <p className="text-xl font-bold text-white sm:text-2xl">
                    {value}
                  </p>

                  <p className="mt-1 text-[10px] font-medium text-slate-300 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSave}
            className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <h2 className="text-xl font-bold text-primary-color">
                Edit Profile
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Update your professional information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div className="flex flex-col items-center gap-3 sm:col-span-2 sm:flex-row">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-400 text-xl font-bold text-white">
                    {initials || "T"}
                  </div>
                )}

                <label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-primary-color transition hover:bg-blue-50">
                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">
                  Full Name
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">
                  Qualification
                </span>

                <input
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Example: Mathematics degree"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-600">
                  Experience Years
                </span>

                <input
                  type="number"
                  name="experience_years"
                  min="0"
                  max="80"
                  value={form.experience_years}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <div className="hidden sm:block" />

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-600">
                  Bio in English
                </span>

                <textarea
                  name="bio_en"
                  rows="4"
                  value={form.bio_en}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-600">
                  Bio in Arabic
                </span>

                <textarea
                  name="bio_ar"
                  rows="4"
                  dir="rtl"
                  value={form.bio_ar}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary-color px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b347a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400">
                PROFILE STRENGTH
              </p>

              <h2 className="mt-1 text-lg font-bold text-primary-color">
                Complete your profile
              </h2>
            </div>

            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#38BDF8 ${profileStrength}%, #EAF0F8 0)`,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-primary-color">
                {profileStrength}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileStrength}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#11255C] to-sky-400"
              />
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-color hover:text-sky-500"
            >
              Complete profile
              <LuChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6"
        >
          <div className="mb-6">
            <p className="text-xs font-bold tracking-wider text-slate-400">
              CONTACT DETAILS
            </p>

            <h2 className="mt-1 text-lg font-bold text-primary-color">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-2xl border border-slate-100 p-4">
              <div className="h-fit rounded-xl bg-blue-50 p-2.5 text-primary-color">
                <LuMail className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                  {user?.email || "Not added yet"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-slate-100 p-4">
              <div className="h-fit rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <LuPhone className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {user?.phone || "Not added yet"}
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <LuGraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400">
                EXPERIENCE
              </p>

              <h2 className="text-lg font-bold text-primary-color">
                Professional Details
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Qualification
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {teacher?.qualification || "Not added yet"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Teaching Experience
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {teacher?.experience_years
                  ? `${teacher.experience_years} Years of experience`
                  : "Not added yet"}
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
              <LuBookOpen className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400">
                TEACHING SCOPE
              </p>

              <h2 className="text-lg font-bold text-primary-color">
                Subjects & Levels
              </h2>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">
                SUBJECTS
              </p>

              <div className="flex flex-wrap gap-2">
                {profile?.subjects?.length ? (
                  profile.subjects.map((subject) => (
                    <span
                      key={subject.id}
                      className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-primary-color"
                    >
                      {subject.name_en || subject.name_ar}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No subjects added yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">
                LEVELS
              </p>

              <div className="flex flex-wrap gap-2">
                {profile?.levels?.length ? (
                  profile.levels.map((level) => (
                    <span
                      key={level.id}
                      className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600"
                    >
                      {level.name_en || level.name_ar}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No levels added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}