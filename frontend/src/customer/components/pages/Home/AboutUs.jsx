import React from "react";

const About = () => {
  return (
    <>
    
      <section className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] bg-gray-50 dark:bg-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between -mx-4">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://i.ibb.co/rfHFq15/image-2.jpg"
                      alt="Elegant Men's Suit"
                      className="w-full rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105"
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://i.ibb.co/rfHFq15/image-2.jpg"
                      alt="Stylish Women's Purse"
                      className="w-full rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative z-10 my-4">
                    <img
                      src="https://i.ibb.co/9y7nYCD/image-3.jpg"
                      alt="Men's Fashion Accessories"
                      className="w-full rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105"
                    />
                    <span className="absolute -right-7 -bottom-7 z-[-1]">
                      <svg
                        width={134}
                        height={106}
                        viewBox="0 0 134 106"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {Array.from({ length: 12 }, (_, index) => (
                          <React.Fragment key={index}>
                            {Array.from({ length: 12 }, (_, subIndex) => (
                              <circle
                                key={`${index}-${subIndex}`}
                                cx={index * 15 + 1.6667}
                                cy={subIndex * 15 + 1.6667}
                                r="1.66667"
                                transform={`rotate(-90 ${index * 15 + 1.6667} ${subIndex * 15 + 1.6667})`}
                                fill="#3056D3"
                              />
                            ))}
                          </React.Fragment>
                        ))}
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <span className="block mb-4 text-lg font-semibold text-primary">
                  Why Shop With Us
                </span>
                <h2 className="mb-5 text-3xl font-bold text-dark dark:text-black sm:text-[40px]/[48px]">
                  Elevate Your Style with Our Premium Collection.
                </h2>
                <p className="mb-5 text-base text-body-color dark:text-black-6">
                  At our store, we offer a premium selection of men’s suits and women’s purses designed to match your distinct style. Whether you're attending a formal event or looking for an everyday look, our collection promises timeless fashion that brings out the best in you.
                </p>
                <p className="mb-8 text-base text-body-color dark:text-dark-6">
                  Our suits are tailored for the modern gentleman, while our purses are crafted with elegance and functionality in mind. Step into a world of high-end fashion that caters to your unique preferences.
                </p>
                <a
                  href="#shop-now"
                  className="inline-flex items-center justify-center py-3 text-base font-medium text-center text-white border border-transparent rounded-md px-7 bg-primary hover:bg-opacity-90 transition-all duration-300 ease-in-out"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
