"use client";
import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";

const EditAccount = () => {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !phone) {
      alert("الرجاء ملء جميع الحقول!");
      return;
    }

    try {
      await updateUser({ name, phone, imageUrl });
      alert("تم تحديث البيانات بنجاح!");
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث البيانات:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <Link href="/MyAcount">
          <FaLongArrowAltLeft className="text-pink-500 text-[30px] mb-4 p-1.5 rounded-full shadow-xl cursor-pointer"/>
      </Link>
      <h1 className="text-xl font-bold mb-2">change data</h1>

      {/* حقل الاسم */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* حقل رقم الهاتف */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">your numner</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          placeholder=" phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* رفع الصورة */}
      <h4>enter url photo</h4>
      <div className="mb-4 w-full flex flex-row items-center justify-between gap-2">
        <div className="">
          <label className="block text-sm font-medium mb-2">Upload Photo</label>
          <div className="flex items-center gap-4">
            {/* زر رفع الصورة */}
            <label
              htmlFor="upload-photo"
              className="flex items-center justify-center p-2 bg-pink-500 text-white rounded cursor-pointer hover:bg-pink-600 transition"
            >
              <span className="material-icons mr-2">upload</span>Photo
            </label>
            {/* الحقل الفعلي مخفي */}
            <input
              type="file"
              id="upload-photo"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
            {/* عرض اسم الصورة إذا تم اختيارها */}
            {isUploading ? (
              <span className="text-sm text-gray-500">Uploading...</span>
            ) : (
              imageUrl && (
                <span className="text-sm text-gray-700 truncate overflow-hidden w-2">
                  {imageUrl.split("/").pop()}
                </span>
              )
            )}
          </div>
        </div>

        {/* إدخال رابط الصورة */}
        <div>
          <label className="block text-sm font-medium mb-2">
            enter url photo
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="url photo"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
      </div>

      {/* handleSave */}
      <button
        className="w-full bg-pink-500 hover:bg-pink-600 text-white p-2 rounded"
        onClick={handleSave}
        disabled={isUploading}
      >
        save
      </button>
    </div>
  );
};

export default EditAccount;
