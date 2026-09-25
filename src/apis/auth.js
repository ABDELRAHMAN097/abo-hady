import { axiosInstance } from "@/kalb";

export const login = async (email_or_phone, password) => {
    const res = await axiosInstance.post("auth/login", { email_or_phone, password });
    return res.data;
};

export const register = async (payload) => {
    const res = await axiosInstance.post("auth/teacher/register", payload);
    return res.data;
};
export const myProfile = async () => {
    const res = await axiosInstance.get("auth/me");
    return res.data;
};

// Get available subjects
export const getSubjects = async () => {
    const res = await axiosInstance.get("teacher/subjects");
    return res.data;
};

// Get available levels
export const getLevels = async () => {
    const res = await axiosInstance.get("teacher/levels");
    return res.data;
};
// logout
export const logout = async () => {
  const res = await axiosInstance.post("auth/logout");
  return res.data;
};

// DASHBOARD

export const getDashboardSummary = async () => {
  const res = await axiosInstance.get("teacher/profile");
  return res.data;
};

export const getStudentJoinRequests = async () => {
  const res = await axiosInstance.get("teacher/student-join-requests", {
    params: {
      status: "pending",
      per_page: 3,
    },
  });

  return res.data;
};

export const acceptStudentJoinRequest = async (requestId) => {
  const res = await axiosInstance.post(
    `teacher/student-join-requests/${requestId}/accept`
  );

  return res.data;
};

export const rejectStudentJoinRequest = async (requestId) => {
  const res = await axiosInstance.post(
    `teacher/student-join-requests/${requestId}/reject`
  );

  return res.data;
};

export const getTeacherStudents = async (params = {}) => {
  const res = await axiosInstance.get("teacher/students", { params });
  return res.data;
};

// TeacherProfile
export const getTeacherProfile = async () => {
  const res = await axiosInstance.get("teacher/profile");
  return res.data;
};

export const updateTeacherProfile = async (formData) => {
  formData.append("_method", "PATCH");

  const res = await axiosInstance.post(
    "teacher/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};