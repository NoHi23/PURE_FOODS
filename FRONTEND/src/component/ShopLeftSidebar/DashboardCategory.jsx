import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderCategory from "./HeaderCategory";
import FiltersLeftCategory from "./FiltersLeftCategory";
import FilterCategoryLayout from "../../layouts/FilterCategoryLayout";
import { useParams, useLocation } from "react-router-dom";
import Products from "./Products";
import { PriceFilterProvider } from "./PriceFilterContext";

const DashboardCategory = () => {
  const { categoryID } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (categoryID) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8082/PureFoods/api/product/by-category/${categoryID}`)
        .then((response) => {
          console.log("Sản phẩm theo category:", response.data);
          setProducts(response.data);
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
      Promise.all(requests).then((responses) => {
        const allProducts = responses.flatMap((res) => res.data);
        setProducts(allProducts);
      });
    } else {
      axios.get("http://localhost:8082/PureFoods/api/product/getAll").then((res) => setProducts(res.data));
    }
  }, [location.search]);

  return (
    <PriceFilterProvider>
      <FilterCategoryLayout>
        <div>
          <HeaderCategory />
          <div className="row">
            <div className="col-lg-2 col-md-3">
              <FiltersLeftCategory />
            </div>
            <div className="col-lg-10 col-md-9">
              <Products products={products} setProducts={setProducts} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </FilterCategoryLayout>
    </PriceFilterProvider>
  );
};

export default DashboardCategory;