import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "react-feather";
import { Range } from "react-range";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { usePriceFilter } from "./PriceFilterContext";

const FiltersLeftCategory = () => {
  const { priceRange, setPriceRange } = usePriceFilter();
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
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const handleCategoryChange = (categoryId) => {
    let updated = [...selectedCategories];

    if (updated.includes(categoryId)) {
      if (updated.length === 1) {
        toast.error("Bạn phải chọn ít nhất 1 danh mục! Không thể bỏ chọn danh mục duy nhất.");
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

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatMoney = (value) => {
    return `$. ${value.toLocaleString("en-US")}`;
  };

  const sections = [
    {
      id: "categories",
      title: "Categories",
      content: (
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
      ),
    },
    {
      id: "food-preference",
      title: "Food Preference",
      content: (
        <ul className="category-list custom-padding">
          {[
            { id: "veget", label: "Vegetarian", count: 8 },
            { id: "non", label: "Non Vegetarian", count: 9 },
          ].map((item) => (
            <li key={item.id}>
              <div className="form-check ps-0 m-0 category-list-box">
                <input className="checkbox_animated" type="checkbox" id={item.id} />
                <label className="form-check-label" htmlFor={item.id}>
                  <span className="name">{item.label}</span>
                  <span className="number">({item.count})</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "price",
      title: "Price",
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
      title: "Rating",
      content: (
        <ul className="category-list custom-padding">
          <li>
            <div className="form-check ps-0 m-0 category-list-box">
              <input className="checkbox_animated" type="checkbox" id="rating-5" />
              <label className="form-check-label" htmlFor="rating-5">
                <ul className="rating d-flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <li key={i}>
                        <Star size={14} fill="#ffc107" color="#ffc107" />
                      </li>
                    ))}
                </ul>
                <span className="text-content">(5 Star)</span>
              </label>
            </div>
          </li>
        </ul>
      ),
    },
    {
      id: "discount",
      title: "Discount",
      content: (
        <ul className="category-list custom-padding">
          {["5% - 10%", "10% - 15%", "More than 15%"].map((text, i) => (
            <li key={i}>
              <div className="form-check ps-0 m-0 category-list-box">
                <input className="checkbox_animated" type="checkbox" id={`discount-${i}`} />
                <label className="form-check-label" htmlFor={`discount-${i}`}>
                  <span className="name">{text}</span>
                  <span className="number">({8 + i * 2})</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
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
