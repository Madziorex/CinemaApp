import { useState, useEffect } from "react";
import api from "../services/api";
import CRUDCouponForm from "./CRUDCouponForm";
import Button from "./Button";
import PopupForm from "./PopupForm";
import "../css/CRUDCoupon.css";

interface Coupon {
  id: string;
  code: string;
  discountAmount: number;
  discountPercent: number;
  expiryDate: string;
  isActive: boolean;
}

interface ListQuery {
  pageIndex: number;
  pageSize: number;
  searchBy: string;
  searchFor: string;
  ascending: boolean;
}

interface Response {
  items: Coupon[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const CRUDCoupon = () => {
  const [data, setData] = useState<Coupon[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [query, setQuery] = useState<ListQuery>({
    pageIndex: 0,
    pageSize: 10,
    searchBy: "code",
    searchFor: "",
    ascending: false,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchCoupons = async () => {
    setLoadingData(true);
    try {
      const response = await api.get<Response>("/Coupon", { params: query });
      setData(response.data.items);
      setPagination({
        pageIndex: response.data.pageIndex,
        totalPages: response.data.totalPages,
        hasPreviousPage: response.data.hasPreviousPage,
        hasNextPage: response.data.hasNextPage,
      });
    } catch (error) {
      console.error("Error while fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [query]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery((prevQuery) => ({
      ...prevQuery,
      searchFor: value,
      pageIndex: 0,
    }));
  };

  const handlePageChange = (direction: "next" | "prev") => {
    const newPageIndex =
      direction === "next"
        ? query.pageIndex + 1
        : Math.max(query.pageIndex - 1, 0);

    if (newPageIndex !== query.pageIndex) {
      setQuery((prevQuery) => ({
        ...prevQuery,
        pageIndex: newPageIndex,
      }));
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setIsPopupOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsPopupOpen(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmed) return;

    try {
      const response = await api.delete(`/Coupon/${id}`);
      if (response.status === 200) {
        alert("The coupon has been deleted!");
        fetchCoupons();
      } else {
        alert("An error occurred while deleting the coupon.");
      }
    } catch (error) {
      console.error("Error while deleting the coupon:", error);
      alert("An error occurred while deleting the coupon.");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingCoupon(null);
  };

  return (
    <div className="CRUDCoupon-content">
      <div className="title-and-button">
        <h1 className="title">Coupons</h1>
        <Button onClick={handleAddCoupon} className="AddCoupon-button">
          Add New Coupon
        </Button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by code"
          value={query.searchFor}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="coupon-list">
        <div className="coupon-header">
          <span>Code</span>
          <span>Discount</span>
          <span>Percent</span>
          <span>Expiry</span>
          <span>Active</span>
          <span>Actions</span>
        </div>
        {loadingData ? (
          <div className="coupon-row">
          </div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="coupon-row">
              <span>{item.code}</span>
              <span>{item.discountAmount} zł</span>
              <span>{item.discountPercent} %</span>
              <span>{item.expiryDate}</span>
              <span>{item.isActive ? "Yes" : "No"}</span>
              <div className="button-group">
                <Button
                  className="edit-button"
                  onClick={() => handleEditCoupon(item)}
                >
                  Edit
                </Button>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteCoupon(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>No coupons found.</div>
        )}
      </div>
      <div className="pagination">
        <Button
          onClick={() => handlePageChange("prev")}
          disabled={!pagination.hasPreviousPage}
          className="pagination-button"
        >
          Previous
        </Button>
        <span>
          Page {pagination.pageIndex + 1} of {pagination.totalPages}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={!pagination.hasNextPage}
          className="pagination-button"
        >
          Next
        </Button>
      </div>
      {isPopupOpen && (
        <PopupForm
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          title={editingCoupon ? "Edit Coupon" : "Add New Coupon"}
        >
          <CRUDCouponForm
            editingCoupon={editingCoupon}
            onCouponsUpdated={fetchCoupons}
            onClose={handleClosePopup}
          />
        </PopupForm>
      )}
    </div>
  );
};

export default CRUDCoupon;
