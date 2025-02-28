export const orderHistoryData = 
[
    {
      customerId: 1,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerAddress: '123 Main St, Springfield, IL',

      orders: [
        {
         
          orderDate: '2025-01-28',
          orderStatus: 'shipped',
          orderAddress: "GUJRANWALA",
          totalAmount: 3315,
          products: [
            {
              
              productName: 'Basic Tee 6-Pack',
              selectedColor: 'black',
              selectedSize: 'M',
              quantity: 2,
              discountedPrice: 1622,
              totalPrice: 3244,
              colors: [
                {
                  name: 'black',
                  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
                  imageAlt: 'Black Basic Tee',
                },
              ],
              sizes: ['S', 'M', 'L'],
            },
            {
              productId: 2,
              productName: 'Focus Paper Refill',
              selectedColor: 'white',
              selectedSize: 'S',
              quantity: 1,
              discountedPrice: 71,
              totalPrice: 71,
              colors: [
                {
                  name: 'white',
                  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
                  imageAlt: 'White Focus Paper Refill',
                },
              ],
              sizes: ['S'],
            },
          ],
        },

        {
          orderId: 'ORD67890',
          orderDate: '2025-01-20',
          orderStatus: 'delivered',
          orderAddress: "Lahore",
          totalAmount: 170,
          products: [
            {
              productId: 3,
              productName: 'Minimalist Wallet',
              selectedColor: 'brown',
              selectedSize: 'One Size',
              quantity: 1,
              discountedPrice: 50,
              totalPrice: 50,
              colors: [
                {
                  name: 'brown',
                  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
                  imageAlt: 'Brown Minimalist Wallet',
                },
              ],
              sizes: ['One Size'],
            },
            {
              productId: 4,
              productName: 'Running Shoes',
              selectedColor: 'gray',
              selectedSize: 10,
              quantity: 1,
              discountedPrice: 120,
              totalPrice: 120,
              colors: [
                {
                  name: 'gray',
                  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
                  imageAlt: 'Gray Running Shoes',
                },
              ],
              sizes: ['9', '10', '11'],
            },
          ],
        },
        {
          orderId: 'ORD54321',
          orderDate: '2025-01-15',
          orderStatus: 'cancelled',
          orderAddress: "Karachi",
          totalAmount: 200,
          products: [
            {
              productId: 5,
              productName: 'Wireless Headphones',
              selectedColor: 'black',
              selectedSize: 'One Size',
              quantity: 1,
              discountedPrice: 200,
              totalPrice: 200,
              colors: [
                {
                  name: 'black',
                  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
                  imageAlt: 'Black Wireless Headphones',
                },
              ],
              sizes: ['One Size'],
            },
          ],
        },

        {
          orderId: 'ORD5323',
          orderDate: '2025-01-15',
          orderStatus: 'shipped',
          orderAddress: "Karachi",
          totalAmount: 200,
          products: [
            {
              productId: 5,
              productName: 'Wireless Headphones',
              selectedColor: 'black',
              selectedSize: 'One Size',
              quantity: 1,
              discountedPrice: 200,
              totalPrice: 200,
              colors: [
                {
                  name: 'black',
                  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
                  imageAlt: 'Black Wireless Headphones',
                },
              ],
              sizes: ['One Size'],
            },
          ],
        },
      ],
    },
  ];
  
  