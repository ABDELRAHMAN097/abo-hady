"use client";
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase"; // تأكد من صحة المسار
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";


export default function AddProducts() {
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [rating, setRating] = useState("");
  const [stock, setStock] = useState(1);
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadProductImages = async (files) => {
    if (!files.length) throw new Error("لا توجد ملفات للرفع.");

    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `products/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });

    return await Promise.all(uploadPromises);
  };

  const addProductWithImages = async (productData) => {
    try {
      setLoading(true);
      const imageUrls = await uploadProductImages(files);
      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        imageUrls,
      });
      toast.success(`The product has been added with the ID: ${docRef.id}`);
      return true;
    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(selectedFiles);

    // إنشاء عرض للصور قبل الرفع
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  const handleAddProduct = async () => {
    if (files.length > 0 && name && price && rating > 0 && stock > 0) {
      const productData = {
        name,
        price: parseFloat(price),
        description,
        category,
        rating,
        stock: parseInt(stock),
        brand,
        discount: parseFloat(discount),
      };

      const success = await addProductWithImages(productData);
      if (success) {
        resetForm();
        console.log("تم إضافة المنتج بنجاح.");
      } else {
        console.error("فشل في إضافة المنتج.");
      }
    } else {
      console.error("تأكد من إدخال جميع الحقول بشكل صحيح.");
    }
  };

  const resetForm = () => {
    setFiles([]);
    setPreviewImages([]);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("Men");
    setRating(0);
    setStock(1);
    setBrand("");
    setDiscount(0);
  };

  return (
    <div className="my-8 mx-4 min-h-[50vh]">
      <input
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        type="text"
        placeholder="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        type="number"
        placeholder="السعر"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        type="text"
        placeholder="اسم العلامة التجارية"
        value={brand === 1 ? "" : brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <input
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        type="number"
        placeholder="عدد القطع في المخزون"
        value={stock === 1 ? "" : stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <input
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        type="number"
        placeholder="نسبة الخصم (%)"
        value={discount === 1 ? "" : discount}
        onChange={(e) => setDiscount(e.target.value)}
      />
      <textarea
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        placeholder="الوصف"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Accessories">Accessories</option>
      </select>
      <input
        className="block w-full border border-gray-300 p-2 rounded-lg mb-4"
        type="number"
        placeholder="التقييم (1-5)"
        value={rating === 1 ? "" : rating}
        onChange={(e) => setRating(e.target.value)}
      />

      {/* عرض الصور قبل الرفع */}
      {previewImages.length > 0 && (
        <div className="flex gap-2 mb-4">
          {previewImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="معاينة الصورة"
              className="w-20 h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}

      <input
        type="file"
        multiple
        className="block w-full mb-4"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        className="block w-full p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition"
        disabled={loading}
        onClick={handleAddProduct}
      >
        {loading ? <BeatLoader color="#fff" size={8} /> : "إضافة المنتج"}{" "}
      </button>
    </div>
  );
}
