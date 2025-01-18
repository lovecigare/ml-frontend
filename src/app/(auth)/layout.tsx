import AuthLayout from "@/layouts/auth-layout";

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => <AuthLayout>{children}</AuthLayout>;

export default Layout;
