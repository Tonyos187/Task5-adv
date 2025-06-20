import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string;
}

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setProduct(response.data);
      } catch {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return null;

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Product Details</h2>
      <Form>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={product.name} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control type="text" value={product.price} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image_url">
          <Form.Label>Image</Form.Label>
          <div>
            <Image
              src={product.image_url}
              alt={product.name}
              fluid
              style={{ maxHeight: 200 }}
            />
          </div>
        </Form.Group>
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="w-100 mt-3"
        >
          Back
        </Button>
      </Form>
    </Container>
  );
};

export default ViewProduct;
