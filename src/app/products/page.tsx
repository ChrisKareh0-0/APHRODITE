import ProductsPage from "../components/ProductsPage";
import "../products-page.css";
import "../center-navbar.css";

export const metadata = {
  title: "All Products - Aphrodite",
  description: "Discover our complete collection of premium fashion items. Shop clothing, shoes, and accessories from top brands.",
  keywords: "fashion, clothing, shoes, accessories, premium, online shopping",
  openGraph: {
    title: "All Products - Aphrodite",
    description: "Discover our complete collection of premium fashion items.",
    type: "website"
  }
};

export default function Products() {
  return <ProductsPage />;
}