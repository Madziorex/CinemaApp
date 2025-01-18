import React, { useState } from "react";
import api from "../services/api";
import "../css/Form.css";

interface Coupon {
  id?: string;
  code: string;
  discountAmount?: number;
  discountPercent?: number;
  expiryDate: string;
  isActive: boolean;
}

interface CRUDCouponFormProps {
  editingCoupon?: Coupon | null;
  onCouponsUpdated: () => void;
  onClose: () => void;
}

const CRUDCouponForm: React.FC<CRUDCouponFormProps> = ({ editingCoupon, onCouponsUpdated, onClose }) => {
  const [coupon, setCoupon] = useState<Coupon>(
    editingCoupon || {
      code: "",
      discountAmount: 0,
      discountPercent: 0,
      expiryDate: "",
      isActive: false,
    }
  );

  const [useDiscountAmount, setUseDiscountAmount] = useState<boolean>(
    editingCoupon ? !!editingCoupon.discountAmount : true
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCoupon({
      ...coupon,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDiscountTypeChange = (type: "amount" | "percent") => {
    if (type === "amount") {
      setUseDiscountAmount(true);
      setCoupon((prevCoupon) => ({
        ...prevCoupon,
        discountAmount: prevCoupon.discountAmount || 0,
        discountPercent: 0,
      }));
    } else {
      setUseDiscountAmount(false);
      setCoupon((prevCoupon) => ({
        ...prevCoupon,
        discountPercent: prevCoupon.discountPercent || 0,
        discountAmount: 0,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCoupon) {
        await api.put(`/Coupon/${editingCoupon.id}`, coupon);
        alert("The coupon has been updated!");
      } else {
        await api.post("/Coupon", coupon);
        alert("The coupon has been added!");
      }

      setCoupon({
        code: "",
        discountAmount: 0,
        discountPercent: 0,
        expiryDate: "",
        isActive: false,
      });
      onCouponsUpdated();
      onClose();
    } catch (error) {
      alert("An error occurred while processing the coupon.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Coupon Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            required
          />
        </div>
        {editingCoupon && (
          <div className="checkbox-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={coupon.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
        )}
        <div className="form-group">
          <label>Discount Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="discountType"
                checked={useDiscountAmount}
                onChange={() => handleDiscountTypeChange("amount")}
              />
              Discount Amount
            </label>
            <label>
              <input
                type="radio"
                name="discountType"
                checked={!useDiscountAmount}
                onChange={() => handleDiscountTypeChange("percent")}
              />
              Discount Percent
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="discountAmount">Discount Amount (zł):</label>
          <input
            type="number"
            id="discountAmount"
            name="discountAmount"
            value={coupon.discountAmount ?? 0}
            onChange={handleChange}
            disabled={!useDiscountAmount}
          />
        </div>
        <div className="form-group">
          <label htmlFor="discountPercent">Discount Percent (%):</label>
          <input
            type="number"
            id="discountPercent"
            name="discountPercent"
            value={coupon.discountPercent ?? 0}
            onChange={handleChange}
            disabled={useDiscountAmount}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={coupon.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <button type="submit" className="submit-button">
            {editingCoupon ? "Update Coupon" : "Add Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CRUDCouponForm;
