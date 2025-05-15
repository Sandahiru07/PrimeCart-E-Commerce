import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(10);
  const [expanded, setExpanded] = useState(false); // Track toggle state

  const handleSeeMore = () => {
    // If already expanded, reset to 10
    if (expanded) {
      setVisibleCount(10);
      setExpanded(false);
    } else {
      // If only 10 or fewer items, do nothing
      if (products.length <= 10) return;
      setVisibleCount(products.length);
      setExpanded(true);
    }
  };

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products.slice(0, visibleCount).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {products.length <= 10 ? (
        <p className="text-gray-500 mb-8">No more products</p>
      ) : (
        <button
          onClick={handleSeeMore}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          {expanded ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default HomeProducts;
