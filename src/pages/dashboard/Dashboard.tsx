import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Form,
  Button,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Dashboard.module.css";

interface Product {
  id: number;
  price: string;
  name: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  const [key, setKey] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          "https://web-production-3ca4c.up.railway.app/api/items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setProducts(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setError("Failed to fetch items");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles["dashboard-container"]}>
      <Container
        fluid
        className={`d-flex position-relative p-0  ${styles["z-index-2"]} no-gutter`}
      >
        <Row className="w-100 no-gutter">
          <Col xs={12} className={styles["dashboard-content"]}>
            <Tab.Container
              activeKey={key}
              onSelect={(k) => setKey(k || "products")}
            >
              <Nav variant="tabs" className={styles["dashboard-nav"]}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Search Items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles["search-input"]}
                  />
                  <Button
                    variant="warning"
                    onClick={() => navigate("/add-item")}
                    className={styles["add-item-btn"]}
                  >
                    Add item
                  </Button>
                </div>
              </Nav>
              <Tab.Content className={styles["dashboard-tab-content"]}>
                <Tab.Pane eventKey="products">
                  {loading ? (
                    <div className={styles["loading-container"]}>
                      <Spinner animation="border" variant="warning" />
                      <p>Loading items...</p>
                    </div>
                  ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                  ) : (
                    <>
                      <Row className="g-3">
                        {displayedProducts.length > 0 ? (
                          displayedProducts.map((product) => (
                            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                              <ProductCard
                                id={product.id}
                                itemName={product.name}
                                ItemPrice={product.price}
                                itemImage={product.image_url}
                              />
                            </Col>
                          ))
                        ) : (
                          <p className={styles["no-items"]}>
                            No products found. Add your first product!
                          </p>
                        )}
                      </Row>
                      {totalPages > 1 && (
                        <div className={styles["pagination-container"]}>
                          <Pagination>
                            {[...Array(totalPages)].map((_, index) => (
                              <Pagination.Item
                                key={index + 1}
                                active={currentPage === index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                              >
                                {index + 1}
                              </Pagination.Item>
                            ))}
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
