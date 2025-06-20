import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!itemImage) return;
    if (/^https?:\/\//.test(itemImage)) {
      setImageSrc(itemImage);
    } else {
      setImageSrc(`${API_BASE}${itemImage}`);
    }
  }, [itemImage]);

  const handleDelete = async () => {
    setDeleting(true);
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
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className={styles["product-card"]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/dashboard/view/${id}`)}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={imageSrc}
        alt={itemName}
        onError={() => setImageSrc("/assets/icons/Default.png")}
        className={styles["card-image"]}
      />
      <Card.Body>
        <Card.Title>{itemName}</Card.Title>
        <Card.Text>{ItemPrice}</Card.Text>
      </Card.Body>

      {hover && (
        <div className={styles["hover-overlay"]}>
          <div className={styles["product-name"]}>{itemName}</div>
          <div className={`${styles["buttons"]} d-flex"`}>
            <Button
              variant="warning"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/edit/${id}`);
              }}
              className={styles.actionBtn}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className={styles.actionBtn}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Body className={styles["delete-message"]}>
          <span className={styles["delete-text"]}>
            Are you sure you want to delete the product?
          </span>
          <div className={styles["delete-buttons"]}>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleting}
              className={styles["delete-button"]}
            >
              {deleting ? "Deleting..." : "Yes"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              className={styles["delete-button"]}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ProductCard;
