import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Nav,
  Tab,
  Form,
  Button,
  Spinner,
  Alert,
  Carousel,
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
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

  const handleCarouselSelect = (selectedIndex: number) => {
    setCarouselIndex(selectedIndex);
  };

  const handlePrev = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === 0 ? productChunks.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === productChunks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chunkArray = (arr: Product[], size: number): Product[][] =>
    arr.length > 0
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
      : [];

  const productChunks = chunkArray(filteredProducts, 8);

  return (
    <div className={`${styles["dashboard-container"]} 100-vh m-0 no-gutter`}>
      <Container
        fluid
        className={`d-flex position-relative p-0 ${styles["z-index-2"]} no-gutter`}
      >
        <Row className="w-100 no-gutter">
          <Container className={`${styles["dashboard-content"]} no-gutter w-100`}>
            <Tab.Container
              activeKey={key}
              onSelect={(k) => setKey(k || "products")}
            >
              <Nav variant="tabs" className={styles["dashboard-nav"]}>
                <div className={styles.searchInputContainer}>
                  <Form.Control
                    type="text"
                    placeholder="Search product by name "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles["search-input"]}
                  />
                  <img
                    src="/assets/icons/search.png"
                    alt="Search"
                    className={styles.searchIcon}
                  />
                </div>
                <Button
                  variant="warning"
                  onClick={() => navigate("/dashboard/add-item")}
                  className={styles["add-item-btn"]}
                >
                  ADD NEW PRODUCT
                </Button>
              </Nav>
              <Tab.Content className={styles["dashboard-tab-content"]}>
                <Tab.Pane eventKey="products" className="d-flex flex-column justify-content-between gap-2">
                  {loading ? (
                    <div className={styles["loading-container"]}>
                      <Spinner animation="border" variant="warning" />
                      <p>Loading items...</p>
                    </div>
                  ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                  ) : filteredProducts.length === 0 ? (
                    <p className={styles["no-items"]}>
                      No products found. Add your first product!
                    </p>
                  ) : (
                    <>
                      <Carousel
                        indicators={false}
                        controls={false}
                        activeIndex={carouselIndex}
                        onSelect={handleCarouselSelect}
                      >
                        {productChunks.map(
                          (chunk: Product[], index: number) => (
                            <Carousel.Item key={index}>
                              <Row
                                className={`${styles["gapping-cards"]} g0 p-0`}
                              >
                                {chunk.map((product: Product) => (
                                  <Container
                                    key={product.id}
                                    className={`${styles["cards"]}`}
                                  >
                                    <ProductCard
                                      id={product.id}
                                      itemName={product.name}
                                      ItemPrice={product.price}
                                      itemImage={product.image_url}
                                    />
                                  </Container>
                                ))}
                              </Row>
                            </Carousel.Item>
                          )
                        )}
                      </Carousel>
                      <div className={styles.numberIndicators}>
                        <button
                          onClick={handlePrev}
                          className={styles.arrowBtn}
                        >
                          <img src="/assets/icons/left.png" alt="" />
                        </button>
                        {productChunks.map((_, index) => (
                          <button
                            key={index}
                            className={`${styles.indicatorBtn} ${
                              index === carouselIndex
                                ? styles.activeIndicator
                                : ""
                            }`}
                            onClick={() => setCarouselIndex(index)}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={handleNext}
                          className={styles.arrowBtn}
                        >
                          <img src="/assets/icons/right.png" alt="" />
                        </button>
                      </div>
                    </>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Container>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
