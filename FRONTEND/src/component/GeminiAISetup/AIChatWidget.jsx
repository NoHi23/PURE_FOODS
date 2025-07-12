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
Bạn là một trợ lý AI của Pure Foods, chuyên chuyển đổi ngôn ngữ tự nhiên thành các tham số truy vấn API.
Dựa vào câu của người dùng, hãy trích xuất các thông tin sau và trả về dưới dạng một đối tượng JSON **duy nhất**.

Các trường có thể có:
- "q": (string) Từ khóa tìm kiếm chính, chỉ lấy phần quan trọng nhất.
- "categoryId": (number) ID của danh mục.
- "supplierId": (number) ID của nhà cung cấp.
- "minDiscount": (number) Mức giảm giá tối thiểu, chỉ lấy số.

Ví dụ:
User: "tìm sữa vinamilk giảm giá 10%" -> {"q": "sữa vinamilk", "minDiscount": 10}
User: "cho tôi các sản phẩm trong danh mục 5" -> {"categoryId": 5}
User: "mì ăn liền của nhà cung cấp 12, có giảm giá" -> {"supplierId": 12, "minDiscount": 1}
User: "sản phẩm 123" -> {"q": "123"}  // <-- Thêm ví dụ này

**QUAN TRỌNG**: Chỉ trả về JSON, không thêm bất kỳ giải thích hay markdown nào khác.
`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(m => [...m, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const prompt = `${systemInstruction}\nUser: "${inputValue}"`;

    try {
      const geminiRes = await model.generateContent(prompt);
      const responseText = geminiRes.response.text();

      const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonCriteria = JSON.parse(cleanedJsonString);

      const apiResponse = await findProductsByCriteria(jsonCriteria);

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