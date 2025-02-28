const filters = [
    {
      id: 'category',
      name: 'Category',
      options: [
        { value: 'clothing', label: 'Clothing', checked: false },
        { value: 'accessories', label: 'Accessories (Ladies Purse)', checked: false },
      ],
    },
    {
      id: 'subCategory',
      name: 'Sub Category',
      options: [
        { value: 'men-stitched', label: 'Men - Stitched', checked: false },
        { value: 'men-unstitched', label: 'Men - Unstitched', checked: false },
        { value: 'women-stitched', label: 'Women - Stitched', checked: false },
        { value: 'women-unstitched', label: 'Women - Unstitched', checked: false },

      ],
    },
    {
      id: 'size',
      name: 'Size',
      options: [
        { value: 'XS', label: 'XS', checked: false },
        { value: 'S', label: 'S', checked: false },
        { value: 'M', label: 'M', checked: false },
        { value: 'L', label: 'L', checked: false },
        { value: 'XL', label: 'XL', checked: false },
      ],
    },
    {
      id: 'color',
      name: 'Color',
      options: [
        { value: 'black', label: 'Black', checked: false },
        { value: 'white', label: 'White', checked: false },
        { value: 'indigo', label: 'Indigo', checked: false },
      ],
    },
];
  

export default filters;