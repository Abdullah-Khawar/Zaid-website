import React, { useEffect, useState } from "react";
import axios from "axios";
import MainCarousel from "../../HomeCarousel/MainCarousel";
import HomeSectionCarousel from "../../HomeSectionCarousel/HomeSectionCarousel";

function HomePage() {
  const [menClothingProducts, setMenClothingProducts] = useState([]);
  const [womenClothingProducts, setWomenClothingProducts] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.BACKEND_URL
  
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const menResponse = await axios.get(`${backendUrl}/productsFilter`, {
          params: { category: "Clothing", subCategory: "Men-Stitched" },
        });

        const menUnstitchedResponse = await axios.get(`${backendUrl}/productsFilter`, {
          params: { category: "Clothing", subCategory: "Men-Unstitched" },
        });

        setMenClothingProducts([...menResponse.data, ...menUnstitchedResponse.data]);

        const womenResponse = await axios.get(`${backendUrl}/productsFilter`, {
          params: { category: "Clothing", subCategory: "Women-Stitched" },
        });

        const womenUnstitchedResponse = await axios.get(`${backendUrl}/productsFilter`, {
          params: { category: "Clothing", subCategory: "Women-Unstitched" },
        });

        setWomenClothingProducts([...womenResponse.data, ...womenUnstitchedResponse.data]);

        const accessoriesResponse = await axios.get(`${backendUrl}/productsFilter`, {
          params: { category: "Accessories" },
        });

        setOtherProducts(accessoriesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <MainCarousel />

      {loading ? (
        <p className="text-center text-xl font-semibold mt-8">Loading products...</p>
      ) : (
        <div className="space">
          <div className="category-section mb-8">
            <HomeSectionCarousel sectionName="Men's Clothing" dummyData={menClothingProducts} />
          </div>

          <div className="category-section mb-8">
            <HomeSectionCarousel sectionName="Women's Clothing" dummyData={womenClothingProducts} />
          </div>

          <div className="category-section mb-8">
            <HomeSectionCarousel sectionName="Women Branded Purses" dummyData={otherProducts} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
