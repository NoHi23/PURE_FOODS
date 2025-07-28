import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomepageLayout from '../../layouts/HomepageLayout';
import { Link } from 'react-router-dom';

const LocationFilter = () => {
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available locations (example API endpoint)
    axios.get('http://localhost:8082/PureFoods/api/locations')
      .then(res => setLocations(res.data))
      .catch(() => setError('Unable to fetch locations'));
  }, []);

  const handleFilter = async () => {
    if (!location) {
      setError('Please select a location');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/product/search?location=${encodeURIComponent(location)}&page=0&size=100`);
      if (res.data.status === 200) {
        setProducts(res.data.products || []);
      } else {
        setError('No products found for this location');
      }
    } catch {
      setError('Error fetching products');
    }
  };

  return (
    <HomepageLayout>
      <section className="section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="title section-t-space">
                <h2>Location-Based Product Filter</h2>
              </div>
              <div className="d-flex align-items-center mb-3" style={{ maxWidth: "600px", width: "100%" }}>
                <select
                  className="form-select me-2 flex-grow-1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={handleFilter}>
                  Filter
                </button>
              </div>
              {error && <div className="text-danger">{error}</div>}
              {products.length > 0 ? (
                <div className="row g-4">
                  {products.map((product, index) => (
                    <div key={index} className="col-md-3 col-sm-6">
                      <div className="product-box">
                        <div className="product-box-image">
                          <Link to={`/product/${product.productId}`} className="product-image">
                            <img
                              src={product.imageURL || `/assets/images/vegetable/blog/placeholder.jpg`}
                              className="bg-img blur-up lazyload"
                              alt={product.productName}
                            />
                          </Link>
                        </div>
                        <div className="product-detail">
                          <Link to={`/product/${product.productId}`}>
                            <h5>{product.productName}</h5>
                          </Link>
                          <p>${product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !error && <div className="text-center">No products available.</div>}
            </div>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
};

export default LocationFilter;