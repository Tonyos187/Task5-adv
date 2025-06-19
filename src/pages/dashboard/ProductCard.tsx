import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ProductCard.module.css";

interface CardProps {
  id: number;
  itemName: string;
  ItemPrice: string;
  itemImage: string;
}

const API_BASE = "https://web-production-3ca4c.up.railway.app";

const ProductCard: React.FC<CardProps> = ({
  id,
  itemName,
  ItemPrice,
  itemImage,
}) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string>(
    "/assets/images/Default.png"
  );

  useEffect(() => {
    if (!itemImage) return;
    if (/^https?:\/\//.test(itemImage)) {
      setImageSrc(itemImage);
    } else {
      setImageSrc(`${API_BASE}${itemImage}`);
    }
  }, [itemImage]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in again");
        return;
      }

      const response = await fetch(`${API_BASE}/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      alert("Item deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete item");
    }
  };

  return (
    <Card
      className="product-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card.Img
        variant="top"
        src={imageSrc}
        alt={itemName}
        onError={() => setImageSrc("/assets/icons/Default.png")}
      />
      <Card.Body>
        <Card.Title>{itemName}</Card.Title>
        <Card.Text>{ItemPrice}</Card.Text>
      </Card.Body>

      {hover && (
        <div className="hover-overlay">
          <Button
            variant="light"
            onClick={() => navigate(`/items/${id}`)}
            className="action-btn"
          >
            Show details
          </Button>
          <Button
            variant="warning"
            onClick={() => navigate(`/edit/${id}`)}
            className="action-btn"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="action-btn"
          >
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;
