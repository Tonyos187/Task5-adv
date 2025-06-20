import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Spinner, Image } from "react-bootstrap";
import axios from "axios";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await axios.post(
        "https://web-production-3ca4c.up.railway.app/api/items",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/dashboard");
    } catch {
      setError("Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Add New Product</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div className="mt-3 text-center">
              <Image src={imagePreview} alt="Preview" fluid style={{ maxHeight: 200 }} />
            </div>
          )}
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="warning" type="submit" disabled={saving} className="w-100">
          {saving ? <Spinner animation="border" size="sm" /> : "Add Product"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddProduct; 