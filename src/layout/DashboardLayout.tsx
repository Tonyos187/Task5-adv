import { Container, Row } from "react-bootstrap";
import Sidebar from "../pages/dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import "../index.css"
const DashboardLayout = () => {
  const userName = localStorage.getItem("user_name") || "";
  const profileImage = localStorage.getItem("profile_image") || "/assets/images/User.png";

  return (
    <Container fluid className="p-0 m-0 g-0 gap-0">
      <Row className="d-flex gap-0 g-0 m-0 p-0">
        <Container className="sidebar-width p-0">
          <Sidebar
            userName={userName}
            userImage={profileImage}
            storeLogo="/assets/icons/Logo.png"
          />
        </Container>
        <Container className="dashboard-width p-0">
          <Outlet />
        </Container>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
