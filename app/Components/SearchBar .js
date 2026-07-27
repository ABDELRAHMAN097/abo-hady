"use client";
import { useState } from "react";

const SearchBar = ({ products, setFilteredProducts }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );

    setFilteredProducts(filtered);
  };
  return (
    <div className="flex justify-center my-4">
      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={handleSearch}
        className="border border-gray-300 rounded-full focus:outline-none focus:border-pink-500 p-2 w-[80%] md:w-[50%]"
      />
    </div>
  );
};
export default SearchBar;
