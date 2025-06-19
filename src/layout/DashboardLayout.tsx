import { Container, Row } from "react-bootstrap";
import Sidebar from "../pages/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const userName = localStorage.getItem("user_name") || "";
  const profileImage = localStorage.getItem("profile_image") || "/assets/images/User.png";

  return (
    <Container fluid>
      <Row>
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
