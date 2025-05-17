"use client";
import React, { useEffect, useState } from "react";
import Product from "./Product";
import Link from "next/link";
import Cookies from "js-cookie";
import { getApiUrl, API_ROUTES } from "../config/api.config";

export default function Events({ type, onServiceCount, selectedBranch }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [closed_dates, setClosedDates] = useState([]);
  const token = Cookies.get("token");
  useEffect(() => {
    async function fetch_function() {
      try {
        const response = await fetch(getApiUrl(API_ROUTES.EVENTS));
        const data = await response.json();
        const closedDates = data
          .map((event) =>
            event.reservations_dates.map((date) => date.split("T")[0]).join(",")
          )
          .join(", ");
        setClosedDates(closedDates);
        if (type === "Home") {
          setProducts(data.slice(0, 6));
          setFilteredProducts(data.slice(0, 6));
        } else {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetch_function();
  }, []);

  // Filter products when selectedBranch changes
  useEffect(() => {
    if (!selectedBranch || selectedBranch === "جميع الفروع") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.branch === selectedBranch
      );
      setFilteredProducts(filtered);
    }
  }, [selectedBranch, products]);

  // Update event count whenever filtered products change
  useEffect(() => {
    if (onServiceCount) {
      onServiceCount(filteredProducts.length);
    }
  }, [filteredProducts, onServiceCount]);

  return (
    <div className="w-[90%] mx-auto my-10">
      {type === "Home" && (
        <div className="flex items-center flex-col gap-6 md:flex-row justify-center md:justify-between mb-10">
          <h1 className="text-sky-600 font-bold text-6xl">الفعاليات </h1>
          <Link href="/event">
            <button className="cursor-pointer relative border border-gray-300 rounded-lg text-black overflow-hidden hover:text-white transition duration-300 ease-in-out px-6 py-2 group">
              <span className="absolute inset-0 bg-sky-600 scale-y-0 origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-100"></span>
              <span className="relative z-10">اكتشف المزيد</span>
            </button>
          </Link>
        </div>
      )}

      <div
        className={
          type === "Home"
            ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }
      >
        {filteredProducts.map((product) => (
          <Product
            key={product.id}
            event={product.id}
            name={product.name}
            location={product.branch}
            price={parseFloat(product.price)}
            rating={product.rating || 0}
            image={product.image}
            closed_date={closed_dates ? closed_dates : ""}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-xl">
            لا توجد فعاليات متطابقة مع بحثك
          </p>
        </div>
      )}
    </div>
  );
}
