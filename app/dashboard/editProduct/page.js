"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import SearchBar from "@/app/Components/SearchBar ";

const storage = getStorage();

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { userRole, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      router.push("/403");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    }
  };

  const handleEditProduct = (productId) => {
    const product = filteredProducts.find((p) => p.id === productId);
    setEditingProduct(product);
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
  
    const uploadedImages = [...(editingProduct.imageUrls || [])]; // الاحتفاظ بالصور القديمة
  
    try {
      for (const file of files) {
        const storageRef = ref(storage, `productImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        uploadedImages.push(imageUrl); // إضافة الصورة الجديدة للمصفوفة
      }
  
      setEditingProduct((prev) => ({ ...prev, imageUrls: uploadedImages }));
    } catch (error) {
      console.error("خطأ في رفع الصور:", error);
    }
  };
  
  const handleSaveEdit = async () => {
    try {
      const productRef = doc(db, "products", editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.name,
        brand: editingProduct.brand,
        stock: editingProduct.stock,
        rating: editingProduct.rating,
        price: editingProduct.price,
        description: editingProduct.description,
        category: editingProduct.category,
        imageUrls: editingProduct.imageUrls || [], // تحديث الصور كمصفوفة
      });
  
      await fetchProducts(); // تحديث المنتجات بعد التعديل
      setEditingProduct(null);
      console.log("تم تعديل المنتج بنجاح");
    } catch (error) {
      console.error("خطأ في تعديل المنتج:", error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <BarLoader color={"#d60096"} loading={loading} size={350} />
      </div>
    );
  }

  return (
    <div>
      <SearchBar
        products={products}
        setFilteredProducts={setFilteredProducts}
      />

      {/* عرض المنتجات */}
      <div className="flex flex-col gap-0 md:gap-2 mx-5">
        {filteredProducts.length === 0 ? (
          <p>No Products Available</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row items-center justify-between w-full my-3 p-3 border hover:border-pink-400 bg-slate-100 rounded-lg shadow-md"
            >
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrls?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-[50px] h-[50px] object-cover rounded-lg mb-2"
                />
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <h2 className="text-xl font-bold">{product.name}</h2>
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <h2 className="text-xl font-bold">{product.brand}</h2>
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <h2 className="text-xl font-bold">{product.stock}</h2>
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <h2 className="text-xl font-bold">{product.rating}</h2>
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <p className="text-gray-500">Price: ${product.price}</p>
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <p className="text-gray-500">
                  Description: {product.description}
                </p>
              </div>

              <div className="flex-1 ml-0 md:ml-1">
                <p className="text-gray-500">Category: {product.category}</p>
              </div>

              <div>
                <button
                  className="mt-2 text-center p-2 bg-pink-500 text-white rounded-lg"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* نموذج التعديل */}
      {editingProduct && (
        <div className="mt-6 mx-4 bg-slate-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

          <div className="mb-4">
            <label className="block mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">brand</label>
            <input
              type="text"
              name="brand"
              value={editingProduct.brand}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">stock</label>
            <input
              type="text"
              name="stock"
              value={editingProduct.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">rating</label>
            <input
              type="text"
              name="rating"
              value={editingProduct.rating}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={editingProduct.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={editingProduct.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleSaveEdit}
            className="w-full p-2 bg-green-500 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
