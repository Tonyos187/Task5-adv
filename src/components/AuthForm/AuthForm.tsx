import { useRef, type FormEvent } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { Container } from "react-bootstrap";

interface AuthFormProps {
  type: "signin" | "signup";
  title: string;
  subtitle: string;
  submitButtonText: string;
  redirectText: string;
  redirectLink: string;
  redirectLinkText: string;
}

const AuthForm = ({
  type,
  title,
  subtitle,
  submitButtonText,
  redirectText,
  redirectLink,
  redirectLinkText,
}: AuthFormProps) => {
  const navigate = useNavigate();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const endpoint =
      type === "signin"
        ? "https://web-production-3ca4c.up.railway.app/api/login"
        : "https://web-production-3ca4c.up.railway.app/api/register";

    try {
      let res;

      if (type === "signin") {
        const data = { email, password };
        res = await axios.post(endpoint, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } else {
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const profilePicture = profilePictureRef.current?.files?.[0];
        const passwordConfirm = passwordConfirmRef.current?.value;

        if (
          !firstName ||
          !lastName ||
          !email ||
          !password ||
          !passwordConfirm
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        if (password !== passwordConfirm) {
          alert("Passwords do not match.");
          return;
        }

        const formData = new FormData();
        formData.append("user_name", `${firstName} ${lastName}`);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirm);
        if (profilePicture) {
          formData.append("profile_image", profilePicture);
        }

        res = await axios.post(endpoint, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Auth API response:", res.data);

      const token = res.data.token || res.data.access_token;
      const userName = res.data.user_name || res.data.user?.user_name || "";
      const profileImage =
        res.data.profile_image || res.data.user?.profile_image || "";
      if (token) {
        localStorage.setItem("token", token);
        if (userName) localStorage.setItem("user_name", userName);
        if (profileImage) localStorage.setItem("profile_image", profileImage);
        navigate("/dashboard");
      } else {
        alert("No token received. See console for details.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Auth error response:", error.response?.data);
        const errorMessage =
          error.response?.data?.message ||
          (error.response?.data?.errors &&
            Object.values(error.response.data.errors).flat().join(" ")) ||
          error.response?.data?.error ||
          "An error occurred";
        alert(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <section className="min-vh-100 d-flex flex-column justify-content-center align-items-center z-index-2">
        <div className="allinfo">
          <div className="d-flex flex-column align-items-center mb-50">
            <img src="/assets/icons/Logo.png" alt="logo" />
            <h2 className="title">{title}</h2>
            <p className="text">{subtitle}</p>
          </div>

          <Form onSubmit={handleSubmit} className="w-100">
            {type === "signup" && (
              <>
                <Container className="p-0 d-flex justify-content-between align-items-end w-100">
                  <Form.Group className="" controlId="formFirstName">
                    <Form.Label className="label first-last">Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      className="signing-input"
                      ref={firstNameRef}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="first-last" controlId="formLastName">
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      className="signing-input"
                      ref={lastNameRef}
                      required
                    />
                  </Form.Group>
                </Container>

                <Form.Group className="" controlId="formEmail">
                  <Form.Label className="label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    className="signing-input"
                    ref={emailRef}
                    required
                  />
                </Form.Group>

                <Container className="p-0 d-flex justify-content-between align-items-end w-100">
                  <Form.Group className="first-last" controlId="formPassword">
                    <Form.Label className="label first-last">
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      className="signing-input"
                      ref={passwordRef}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="first-last"
                    controlId="formPasswordConfirm"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      className="signing-input"
                      ref={passwordConfirmRef}
                      required
                    />
                  </Form.Group>
                </Container>

                <Form.Group className="" controlId="formProfilePicture">
                  <Form.Label className="label">Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    className="signing-input"
                    ref={profilePictureRef}
                    accept="image/*"
                  />
                </Form.Group>
              </>
            )}
            {type === "signin" && (
              <>
                <Form.Group className="" controlId="formEmail">
                  <Form.Label className="label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    className="signing-input"
                    ref={emailRef}
                    required
                  />
                </Form.Group>
                <Form.Group className="" controlId="formPassword">
                  <Form.Label className="label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    className="signing-input"
                    ref={passwordRef}
                    required
                  />
                </Form.Group>
              </>
            )}

            <button
              type="submit"
              className="w-100 submit-button text-light border-0"
            >
              {submitButtonText}
            </button>
          </Form>

          <p className="redirect-text">
            {redirectText}{" "}
            <Link className="colorLink" to={redirectLink}>
              {redirectLinkText}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default AuthForm;
