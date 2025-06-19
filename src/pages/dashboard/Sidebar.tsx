import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  userName: string;
  userImage: string;
  storeLogo: string;
}

const API_BASE = "https://web-production-3ca4c.up.railway.app";

const Sidebar: React.FC<SidebarProps> = ({
  userName,
  userImage,
  storeLogo,
}) => {
  const navigate = useNavigate();
  const [profileSrc, setProfileSrc] = useState<string>(
    "/assets/icons/User.png"
  );

  useEffect(() => {
    if (!userImage) return;

    if (/^https?:\/\//.test(userImage) || userImage.startsWith("/assets/")) {
      setProfileSrc(userImage);
    } else {
      setProfileSrc(`${API_BASE}/${userImage}`);
    }
  }, [userImage]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      await fetch("https://web-production-3ca4c.up.railway.app/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      localStorage.removeItem("token");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout");
    }
  };

  return (
    <Navbar
      className={`${styles.sidebar} flex-column vh-100 justify-content-between align-items-center`}
    >
      <Container
        className={`${styles["sidebar-header"]} align-self-center justify-content-center`}
      >
        <div className={`${styles["store-logo-yellow"]}`}></div>
        <Image
          src={storeLogo}
          alt="Store Logo"
          className={`${styles["store-logo"]}`}
        />
      </Container>

      <Container className={`${styles["user-profile"]} flex-column`}>
        <div className={styles["my-image"]}>
          <Image
            src={profileSrc}
            alt="User"
            className={styles["user-image"]}
            onError={() => setProfileSrc("/assets/icons/User.png")}
          />
        </div>
        <h5 className={`${styles["user-name"]}`}>{userName}</h5>
      </Container>

      <Nav className={`${styles["sidebar-nav"]} flex-column`}>
        <Button
          variant="secondary"
          className={`${styles["nav-btn"]} mb-2 d-flex justify-content-center align-items-center`}
        >
          <img src="/assets/icons/cubes.png" alt="" />
          <span>Products</span>
        </Button>
        <Button
          variant="secondary"
          className={`${styles["nav-btn"]} mb-2 d-flex justify-content-center align-items-center`}
        >
          <img src="/assets/icons/bookmark 1.png" alt="" />
          <span>Favorites</span>
        </Button>
        <Button
          variant="secondary"
          className={`${styles["nav-btn"]} mb-2 d-flex justify-content-center align-items-center`}
        >
          <img src="/assets/icons/bookmark 1.png" alt="" />
          <span> Order List</span>
        </Button>
      </Nav>

      <div className={`${styles["sidebar-footer"]} `}>
        <Button
          variant="danger"
          onClick={handleLogout}
          className={`${styles["logout-btn"]} d-flex justify-content-between align-items-center`}
        >
          <span>Log out</span>
          <img src="/assets/icons/sign-out-alt 1.png" alt="" />
        </Button>
      </div>
    </Navbar>
  );
};

export default Sidebar;
