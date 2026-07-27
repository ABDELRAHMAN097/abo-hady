"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { BarLoader, BeatLoader } from "react-spinners";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ProtectedRoute from "../../ProtectedRoute/page";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import SearchBar from "@/app/Components/SearchBar ";
import { toast } from "react-toastify";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [load, setLoad] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoad(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      toast.success("The product has been removed");
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      setLoad((prev) => ({ ...prev, [productId]: true }));
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== productId)
      ); // تحديث المنتجات المفلترة بعد الحذف
      toast.success(`The product has been removed with id: ${productId}`);
    } catch (error) {
      console.error("you have error :", error);
    } finally {
      setLoad((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const { user, userRole, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole !== "admin") {
      router.push("/403"); // صفحة لرفض الوصول
    }
  }, [userRole, loading, router]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <BarLoader color={"#d60096"} loading={loading} size={350} />
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div>
        <SearchBar
          products={products}
          setFilteredProducts={setFilteredProducts}
        />

        {/* Products Section */}
        <div className="flex flex-col gap-2 mx-4">
          {filteredProducts.length === 0 ? (
            <p>No Products Available</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row items-center justify-between w-full border hover:border-pink-400 bg-slate-100 my-3 p-3 rounded-lg shadow-md"
              >
                <div className="flex-shrink-0">
                  <img
                    src={product.imageUrls?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-[50px] h-[50px] object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <h2 className="text-xl font-bold">{product.name}</h2>
                </div>

                <div className="flex-1 ml-4">
                  <p className="text-gray-500">Price: ${product.price}</p>
                </div>

                <div className="flex-1 ml-4">
                  <p className="text-gray-500">
                    Description: {product.description}
                  </p>
                </div>

                <div className="flex-1 ml-4">
                  <p className="text-gray-500">Category: {product.category}</p>
                </div>

                <div>
                  <button
                    className="mt-4 text-center p-2 bg-red-500 text-white rounded-lg"
                    disabled={load}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    {load[product.id] ? (
                      <BeatLoader color="#fff" size={8} />
                    ) : (
                      <RiDeleteBin5Fill className="w-full text-center" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DeleteProduct;
