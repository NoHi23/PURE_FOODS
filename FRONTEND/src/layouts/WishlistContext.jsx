import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});

  const fetchWishlistCount = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/wishlist/count/${userId}`);
      setWishlistCount(res.data.totalWishlist || 0);
    } catch (err) {
      console.error("Lỗi khi lấy số lượng wishlist:", err);
    }
  };

  const fetchWishlistDetails = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/wishlist/${userId}`);
      const wishlist = res.data.slice(0, 2);

      const productRequests = wishlist.map(item =>
        axios.get(`http://localhost:8082/PureFoods/api/product/getById/${item.productId}`)
      );

      const responses = await Promise.all(productRequests);
      const products = responses.map((r, idx) => ({
        ...r.data.product,
        wishlistId: wishlist[idx].wishlistId,
      }));
      setWishlistItems(products);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết wishlist:", err);
    }
  };

  const fetchWishlistMap = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/wishlist/${userId}`);
      const map = {};
      res.data.forEach(item => {
        map[item.productId] = item.wishlistId;
      });
      setWishlistMap(map);
    } catch (err) {
      console.error("Lỗi khi lấy wishlist map:", err);
    }
  };

  const refreshWishlist = async () => {
    await fetchWishlistCount();
    await fetchWishlistDetails();
    await fetchWishlistMap();
  };

  useEffect(() => {
    refreshWishlist();
  }, [userId]);

  return (
    <WishlistContext.Provider value={{
      wishlistCount,
      wishlistItems,
      fetchWishlistCount,
      fetchWishlistDetails,
      refreshWishlist,
      fetchWishlistMap,
      wishlistMap,
      setWishlistMap
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
