import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "react-feather";
import { Range } from "react-range";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { usePriceFilter } from "./PriceFilterContext";
import { useDiscountFilter } from "./DiscountFilterContext";

const FiltersLeftCategory = ({ products, selectedRatings, setSelectedRatings }) => {
  const { priceRange, setPriceRange } = usePriceFilter();
  const { discountRange, setDiscountRange } = useDiscountFilter();
  const [openSections, setOpenSections] = useState({
    categories: true,
    "food-preference": true,
    price: true,
    rating: true,
    discount: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(async (res) => {
        const fetchedCategories = res.data;
        const promises = fetchedCategories.map((cat) =>
          axios.get(`http://localhost:8082/PureFoods/api/product/by-category/${cat.categoryID}`)
        );
        const results = await Promise.all(promises);
        const categoriesWithCount = fetchedCategories.map((cat, index) => ({
          ...cat,
          productCount: results[index].data.length,
        }));
        setCategories(categoriesWithCount);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh mục:", err);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cateParam = params.get("cate");
    if (cateParam) {
      setSelectedCategories(cateParam.split(",").map(Number));
    }
  }, [location.search]);

  useEffect(() => {
    axios
      .get("http://localhost:8082/PureFoods/api/category/getAll")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    let updated = [...selectedCategories];

    if (updated.includes(categoryId)) {
      if (updated.length === 1) {
        Swal.fire({
          icon: "warning",
          title: "Không thể bỏ chọn",
          text: "Bạn phải chọn ít nhất 1 danh mục. Không thể bỏ chọn danh duy nhất.",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: true,
        });
        return;
      }
      updated = updated.filter((id) => id !== categoryId);
    } else {
      updated.push(categoryId);
    }

    setSelectedCategories(updated);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("cate", updated.join(","));
    searchParams.set("page", 1);
    navigate(`/category?${searchParams.toString()}`);
  };

  const handleSelectAllCategories = () => {
    const allIds = categories.map((c) => c.categoryID);
    const isAllSelected = allIds.every((id) => selectedCategories.includes(id));

    if (isAllSelected) {
      Swal.fire({
        icon: "success",
        title: "Đặt lại thành công",
        text: "Đã đặt lại danh mục về mặc định.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      setSelectedCategories([1]);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("cate", "1");
      searchParams.set("page", 1);
      navigate(`/category?${searchParams.toString()}`);
    } else {
      Swal.fire({
        icon: "success",
        title: "Đã chon tất cả danh mục",
        text: "Đã chọn tất cả danh mục, có rất nhiều sản phẩm thú vị. Hãy khám pha ngay!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      setSelectedCategories(allIds);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("cate", allIds.join(","));
      searchParams.set("page", 1);
      navigate(`/category?${searchParams.toString()}`);
    }
  };

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatMoney = (value) => {
    return `$. ${value.toLocaleString("en-US")}`;
  };

  const formatPercent = (value) => {
    return `${value}%`;
  };

  // Tính count cho từng rating level dựa trên products hiện tại
  const ratingCounts = {};
  products.forEach((product) => {
    const rounded = Math.round(product.averageRating || 0);
    ratingCounts[rounded] = (ratingCounts[rounded] || 0) + 1;
  });

  const handleRatingChange = (rating) => {
    let updated = [...selectedRatings];
    if (updated.includes(rating)) {
      updated = updated.filter((r) => r !== rating);
    } else {
      updated.push(rating);
    }
    setSelectedRatings(updated);
  };

  const sections = [
    {
      id: "categories",
      title: "Thể loại",
      content: (
        <>
          <button className="btn btn-sm btn-primary mb-2" onClick={handleSelectAllCategories}>
            {selectedCategories.length === categories.length ? "Đặt về mặc định" : "Chọn tất cả"}
          </button>

          <ul className="category-list custom-padding custom-height">
            {categories.map((category) => (
              <li key={category.categoryID}>
                <div className="form-check ps-0 m-0 category-list-box d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox_animated"
                    checked={selectedCategories.includes(category.categoryID)}
                    onChange={() => handleCategoryChange(category.categoryID)}
                    id={`cat-${category.categoryID}`}
                  />
                  <label className="form-check-label mb-0" htmlFor={`cat-${category.categoryID}`}>
                    <span className="name">{category.categoryName}</span>{" "}
                    <span className="number">({category.productCount})</span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "price",
      title: "Giá thành",
      content: (
        <div className="range-slider">
          <div className="d-flex justify-content-between mb-2">
            <span className="badge bg-success">{formatMoney(priceRange[0])}</span>
            <span className="badge bg-success">{formatMoney(priceRange[1])}</span>
            <span className="badge bg-secondary">{formatMoney(500)}</span>
          </div>
          <Range
            step={5}
            min={0}
            max={500}
            values={priceRange}
            onChange={(values) => setPriceRange(values)}
            renderTrack={({ props, children }) => {
              const percentLeft = (priceRange[0] / 500) * 100;
              const percentRight = 100 - (priceRange[1] / 500) * 100;

              return (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    background: `linear-gradient(to right, #ccc ${percentLeft}%, #007bff ${percentLeft}% ${
                      100 - percentRight
                    }%, #ccc ${100 - percentRight}%)`,
                    borderRadius: "3px",
                  }}
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "16px",
                  width: "16px",
                  backgroundColor: "#007bff",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            )}
          />
          <input
            className="form-control mt-2"
            value={`${formatMoney(priceRange[0])} - ${formatMoney(priceRange[1])}`}
            readOnly
          />
        </div>
      ),
    },
    {
      id: "rating",
      title: "Đánh giá",
      content: (
        <ul className="category-list custom-padding">
          {[5, 4, 3, 2, 1, 0].map((star) => (
            <li key={star}>
              <div className="form-check ps-0 m-0 category-list-box">
                <input
                  className="checkbox_animated"
                  type="checkbox"
                  id={`rating-${star}`}
                  checked={selectedRatings.includes(star)}
                  onChange={() => handleRatingChange(star)}
                />
                <label className="form-check-label" htmlFor={`rating-${star}`}>
                  <ul className="rating d-flex gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <li key={i}>
                          <Star size={14} fill={i < star ? "#ffc107" : "#ddd"} color={i < star ? "#ffc107" : "#ddd"} />
                        </li>
                      ))}
                  </ul>
                  <span className="text-content">{star === 0 ? "(Chưa có đánh giá)" : `(${star} Sao)`} ({ratingCounts[star] || 0})</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "discount",
      title: "Mã giảm giá",
      content: (
        <div className="range-slider">
          <div className="d-flex justify-content-between mb-2">
            <span className="badge bg-success">{formatPercent(discountRange[0])}</span>
            <span className="badge bg-success">{formatPercent(discountRange[1])}</span>
            <span className="badge bg-secondary">{formatPercent(100)}</span>
          </div>
          <Range
            step={1}
            min={0}
            max={100}
            values={discountRange}
            onChange={(values) => setDiscountRange(values)}
            renderTrack={({ props, children }) => {
              const percentLeft = (discountRange[0] / 100) * 100;
              const percentRight = 100 - (discountRange[1] / 100) * 100;

              return (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    background: `linear-gradient(to right, #ccc ${percentLeft}%, #007bff ${percentLeft}% ${
                      100 - percentRight
                    }%, #ccc ${100 - percentRight}%)`,
                    borderRadius: "3px",
                  }}
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "16px",
                  width: "16px",
                  backgroundColor: "#007bff",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            )}
          />
          <input
            className="form-control mt-2"
            value={`${formatPercent(discountRange[0])} - ${formatPercent(discountRange[1])}`}
            readOnly
          />
        </div>
      ),
    },
  ];

  return (
    <div className="accordion custom-accordion">
      {sections.map((section) => (
        <div className="accordion-item" key={section.id}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${openSections[section.id] ? "" : "collapsed"}`}
              onClick={() => toggleSection(section.id)}
            >
              <span className="fw-bold">{section.title}</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${openSections[section.id] ? "show" : ""}`}>
            <div className="accordion-body">{section.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltersLeftCategory;