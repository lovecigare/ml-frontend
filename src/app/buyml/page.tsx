"use client";

// import ThemeToggle from "@/components/themes/theme-toggle";
import AdminLayout from "@/layouts/admin-layout";
import Footer from "@/layouts/admin-layout/footer";
import Navbar from "@/layouts/admin-layout/navbar";
import Sidebar from "@/layouts/admin-layout/sidebar";
import BuyML from "@/sections/buy-ml";

const Home = () => {
  return (
    <AdminLayout
      SideBar={<Sidebar />}
      NavBar={<Navbar title="title" />}
      Footer={<Footer />}
    >
      <BuyML />
    </AdminLayout>
  );
};

export default Home;