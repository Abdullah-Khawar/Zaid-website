
export const customerOrders = 

[
  {
      customerId: 1, // Unique customer ID
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerAddress: '123 Main St, Springfield, IL',


      orderId: 'ORD12345', // Unique order ID
      orderDate: '2025-01-28', // Date of the order
      orderStatus: 'Processing', // Order status (e.g., Processing, Shipped, Delivered)
      
      products: [
        {
          productId: 1, // Reference to product in initialProducts
          productName: 'Basic Tee 6-Pack',
          selectedColor: 'black',
          selectedSize: 'M',
          quantity: 2,
          discountedPrice: '$white1622', // Price of the product at the time of order
          totalPrice: '$3244', // Quantity x discountedPrice
          colors: [
            {
              name: 'black',
              imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
              imageAlt: 'Black Basic Tee'
            },
          ],
          sizes: ['S', 'M', 'L'], // Possible sizes for this product
          
        },
        {
          productId: 2, // Reference to product in initialProducts
          productName: 'Focus Paper Refill',
          selectedColor: 'white',
          selectedSize: 'S',
          quantity: 1,
          discountedPrice: '$71',
          totalPrice: '$71',
          colors: [
            {
              name: 'white',
              imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
              imageAlt: 'White Focus Paper Refill'
            },
          ],
          sizes: ['S'], // Possible sizes for this product
          
        },

        {
          productId: 3, // Reference to product in initialProducts
          productName: 'Focus Paper Refill',
          selectedColor: 'white',
          selectedSize: 'S',
          quantity: 1,
          discountedPrice: '$73',
          totalPrice: '$73',
          colors: [
            {
              name: 'white',
              imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
              imageAlt: 'White Focus Paper Refill'
            },
          ],
          sizes: ['S'], // Possible sizes for this product
          
        },
      ],
    }
    
];

