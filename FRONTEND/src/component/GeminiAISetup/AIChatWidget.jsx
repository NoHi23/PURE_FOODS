import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './AIChatWidget.css'
const API_KEY = "AIzaSyA8FkJ9XTonXbIsN0rcN-GeLlrmNmUR3EM";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });


const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Chào bạn! Tôi là trợ lý AI của Pure Foods. Bạn cần tìm gì?', sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Hàm gọi API backend, không thay đổi nhiều
  async function findProductsByCriteria(criteria, page = 0, size = 12) {
    const params = new URLSearchParams();

    if (criteria.q) params.append('q', criteria.q); // Sửa từ productName -> q
    if (criteria.categoryId) params.append('categoryId', criteria.categoryId);
    if (criteria.supplierId) params.append('supplierId', criteria.supplierId);
    if (criteria.minDiscount) params.append('minDiscount', criteria.minDiscount); // Sửa từ discountPercent -> minDiscount

    params.append('page', page);
    params.append('size', size);

    const res = await fetch(`http://localhost:8082/PureFoods/api/product/search?${params.toString()}`);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("API Error Response:", errorBody);
      throw new Error('Lỗi khi gọi API tìm kiếm sản phẩm');
    }
    return res.json();
  }
  const systemInstruction = `
Bạn là một trợ lý AI giúp người dùng tìm sản phẩm. 
Nhiệm vụ của bạn là chuyển đổi truy vấn ngôn ngữ tự nhiên thành JSON để gửi đến API tìm kiếm sản phẩm. 
Chỉ trả về đúng object JSON, KHÔNG giải thích thêm.

Các trường được hỗ trợ:
- q: từ khóa tìm kiếm
- priceFrom: giá tối thiểu (số)
- priceTo: giá tối đa (số)
- supplierId: mã nhà cung cấp
- categoryId: mã danh mục

Nếu không biết supplierId hoặc categoryId, hãy trả về "supplierName" hoặc "categoryName" thay thế để hệ thống xử lý sau.

🎯 🎯 Nếu người dùng nhập một từ hoặc cụm từ (ví dụ: "Vinamilk", "Fresh Produce B", "Rau", "Trái cây"):
- Nếu nó giống tên nhà cung cấp → gán vào "supplierName"
- Nếu giống tên danh mục sản phẩm → gán vào "categoryName"
- Nếu không chắc chắn → vẫn ưu tiên gán vào "supplierName", sau đó là "categoryName", sau cùng mới là "q"


Các API liên quan:
1. [Tìm sản phẩm theo tiêu chí]:
- Đầu vào: JSON có thể chứa q, priceFrom, priceTo, supplierId, categoryId
- API: /api/products/search

2. [Lấy supplierId theo tên]:
- Đầu vào: supplierName
- API: /api/supplier/searchByName?name={name}
- Trả về: supplierId

3. [Lấy categoryId theo tên]:
- Đầu vào: categoryName
- API: /api/category/searchByName?name={name}
- Trả về: categoryId

Ví dụ:
"Tìm sản phẩm vinamilk giá dưới 20000" → 
{ "q": "vinamilk", "priceTo": 20000 }

"Tìm sữa từ nhà cung cấp vinamilk" → 
{ "q": "sữa", "supplierName": "vinamilk" }

"Fresh" → 
{ "supplierName": "Fresh" }

"Trái cây" → 
{ "categoryName": "Trái cây" }

"Bánh" → 
{ "q": "bánh" }
`;


  async function resolveMissingIds(criteria) {
    const updated = { ...criteria };

    // Lấy supplierId nếu chỉ có supplierName
    // Nếu chỉ có "q", thử kiểm tra xem nó có khớp supplierName không
    if (!updated.supplierId && !updated.supplierName && updated.q) {
      try {
        const res = await fetch(`http://localhost:8082/PureFoods/api/supplier/searchByName?name=${encodeURIComponent(updated.q)}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].supplierId) {
          updated.supplierId = data[0].supplierId;
          delete updated.q;
        }
      } catch (e) {
        console.warn("Lỗi khi kiểm tra q là supplier:", e);
      }
    }

    // Nếu không phải supplier, thử kiểm tra category
    if (!updated.categoryId && !updated.categoryName && updated.q) {
      try {
        const res = await fetch(`http://localhost:8082/PureFoods/api/category/searchByName?name=${encodeURIComponent(updated.q)}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].categoryId) {
          updated.categoryId = data[0].categoryId;
          delete updated.q;
        }
      } catch (e) {
        console.warn("Lỗi khi kiểm tra q là category:", e);
      }
    }

    return updated;
  }




  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(m => [...m, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const inputTextLower = inputValue.toLowerCase();

    // ✅ Nếu có từ "rẻ" thì gọi API /cheapest-list
    if (inputTextLower.includes("rẻ")) {
      try {
        const res = await fetch(`http://localhost:8082/PureFoods/api/product/cheapest`);
        const data = await res.json();
        if (data && data.products && data.products.length > 0) {
          setMessages(m => [
            ...m,
            { id: Date.now() + 1, text: `Đây là những sản phẩm giá rẻ nhất hiện có:`, sender: 'ai' },
            { id: Date.now() + 2, sender: 'products', products: data.products }
          ]);
        } else {
          setMessages(m => [
            ...m,
            { id: Date.now() + 1, text: 'Không tìm thấy sản phẩm giá rẻ nào.', sender: 'ai' }
          ]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API giá rẻ:", error);
        setMessages(m => [
          ...m,
          { id: Date.now() + 1, text: 'Xin lỗi, có lỗi xảy ra khi lấy danh sách sản phẩm giá rẻ.', sender: 'ai' }
        ]);
      } finally {
        setIsLoading(false);
      }
      return; // 🔚 không tiếp tục gọi Gemini nếu đã match từ "rẻ"
    }

    // Nếu không có từ "rẻ" → tiếp tục xử lý AI như cũ
    const prompt = `${systemInstruction}\nUser: "${inputValue}"`;
    try {
      const geminiRes = await model.generateContent(prompt);
      const responseText = geminiRes.response.text();
      const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const rawCriteria = JSON.parse(cleanedJsonString);
      const jsonCriteria = await resolveMissingIds(rawCriteria);
      const apiResponse = await findProductsByCriteria(jsonCriteria);
      console.log("📦 rawCriteria từ Gemini:", rawCriteria);
      console.log("✅ jsonCriteria sau khi resolve:", jsonCriteria);
      if (apiResponse && apiResponse.products && apiResponse.products.length > 0) {
        setMessages(m => [
          ...m,
          { id: Date.now() + 1, text: `Tìm thấy ${apiResponse.totalElements} sản phẩm phù hợp.`, sender: 'ai' },
          { id: Date.now() + 2, sender: 'products', products: apiResponse.products }
        ]);
      } else {
        setMessages(m => [
          ...m,
          { id: Date.now() + 1, text: 'Xin lỗi, không tìm được sản phẩm nào phù hợp với yêu cầu của bạn.', sender: 'ai' }
        ]);
      }
    } catch (err) {
      console.error("Đã xảy ra lỗi:", err);
      setMessages(m => [
        ...m,
        { id: Date.now() + 1, text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.', sender: 'ai' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={`ai-chat-widget ${isOpen ? 'active' : ''}`}>
      <button className="chat-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : <ChatIcon />}
      </button>

      <div className="chat-panel">
        <div className="chat-header">
          <h3>Pure Foods AI Hỗ trợ</h3>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        <div className="chat-messages">
          {messages.map(msg => {
            if (msg.sender === 'products') {
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
                  {msg.products.map(p => (
                    <a
                      key={p.productId}
                      href={`/product/${p.productId}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "12px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        textDecoration: "none",
                        backgroundColor: "#fff",
                        transition: "box-shadow 0.2s ease",
                      }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <img
                        src={p.imageURL}
                        alt={p.productName}
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h4 style={{ margin: 0, fontSize: "16px", color: "#333" }}>{p.productName}</h4>
                        {p.discountPercent > 0 ? (
                          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "14px" }}>
                            <del style={{ color: "#999", marginRight: "6px" }}>${p.price.toLocaleString()}</del>
                            ${(p.price * (1 - p.discountPercent / 100)).toLocaleString()}
                          </p>
                        ) : (
                          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "14px" }}>
                            ${p.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              );
            }
            return (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            );
          })}
          {isLoading && (
            <div className="message ai">
              <p>Đang tìm kiếm...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Nhập yêu cầu của bạn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>Gửi</button>
        </form>
      </div>
    </div>
  );
}

export default AIChatWidget;