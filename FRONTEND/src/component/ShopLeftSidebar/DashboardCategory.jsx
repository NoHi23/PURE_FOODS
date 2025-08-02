import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderCategory from "./HeaderCategory";
import FiltersLeftCategory from "./FiltersLeftCategory";
import FilterCategoryLayout from "../../layouts/FilterCategoryLayout";
import { useParams, useLocation } from "react-router-dom";
import Products from "./Products";
import { PriceFilterProvider } from "./PriceFilterContext";
import { DiscountFilterProvider } from "./DiscountFilterContext";

const DashboardCategory = () => {
  const { categoryID } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const userId = userLocal?.userId || null;
  const [selectedRatings, setSelectedRatings] = useState([]);

  const fetchAverages = async (prods) => {
    if (prods.length === 0) return prods;
    const ids = prods.map(p => p.productId);
    const resps = await Promise.all(
      ids.map(id => 
        axios.get(`http://localhost:8082/PureFoods/api/review/average/product?productId=${id}`)
          .then(res => res.data || 0)
          .catch(() => 0) // Handle error or no reviews as 0
      )
    );
    const avgMap = {};
    resps.forEach((avg, idx) => {
      avgMap[ids[idx]] = avg;
    });
    return prods.map(p => ({ ...p, averageRating: avgMap[p.productId] }));
  };

  useEffect(() => {
    if (categoryID) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8082/PureFoods/api/product/by-category/${categoryID}`)
        .then(async (response) => {
          console.log("Sản phẩm theo category:", response.data);
          const updatedProducts = await fetchAverages(response.data);
          setProducts(updatedProducts);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy sản phẩm:", error);
          setIsLoading(false);
        });
    }
  }, [categoryID]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cateParam = params.get("cate");

    if (cateParam) {
      const cateIDs = cateParam.split(",").map(Number);
      const requests = cateIDs.map((id) => axios.get(`http://localhost:8082/PureFoods/api/product/by-category/${id}`));
      Promise.all(requests).then(async (responses) => {
        const allProducts = responses.flatMap((res) => res.data);
        const updatedProducts = await fetchAverages(allProducts);
        setProducts(updatedProducts);
      });
    } else {
      axios.get("http://localhost:8082/PureFoods/api/product/getAll").then(async (res) => {
        const updatedProducts = await fetchAverages(res.data);
        setProducts(updatedProducts);
      });
    }
  }, [location.search]);

  return (
    <PriceFilterProvider>
      <DiscountFilterProvider>
        <FilterCategoryLayout>
          <div>
            <HeaderCategory />
            <div className="row">
              <div className="col-lg-2 col-md-3">
                <FiltersLeftCategory 
                  products={products} 
                  selectedRatings={selectedRatings} 
                  setSelectedRatings={setSelectedRatings} 
                />
              </div>
              <div className="col-lg-10 col-md-9">
                <Products 
                  products={products} 
                  setProducts={setProducts} 
                  isLoading={isLoading} 
                  userId={userId} 
                  selectedRatings={selectedRatings} 
                />
              </div>
            </div>
          </div>
        </FilterCategoryLayout>
      </DiscountFilterProvider>
    </PriceFilterProvider>
  );
};

export default DashboardCategory;