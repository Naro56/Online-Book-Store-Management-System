// Mock orders for demo purposes
export const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-2023-0042",
    userId: 1,
    customer: {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      address: {
        street: "42/B, Nehru Nagar",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400076",
        country: "India"
      },
      phone: "+91 9876543210"
    },
    items: [
      {
        id: 1,
        bookId: 1,
        title: "Godan",
        author: "Munshi Premchand",
        price: 299.00,
        quantity: 2,
        isbn: "9788126415786",
        imageUrl: "https://m.media-amazon.com/images/I/81Ym0oKRMDL._AC_UF1000,1000_QL80_.jpg"
      },
      {
        id: 2,
        bookId: 3,
        title: "Gunaho Ka Devta",
        author: "Dharamvir Bharati",
        price: 249.00,
        quantity: 1,
        imageUrl: "https://m.media-amazon.com/images/I/81jv44QdNwL._AC_UF1000,1000_QL80_.jpg"
      }
    ],
    totalAmount: 847.00,
    status: "PROCESSING",
    paymentMethod: "Credit Card",
    createdAt: "2023-11-15T14:30:00",
    updatedAt: "2023-11-15T14:30:00",
    shippingAddress: {
      street: "42/B, Nehru Nagar",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400076",
      country: "India"
    },
    trackingNumber: null
  },
  {
    id: 2,
    orderNumber: "ORD-2023-0041",
    userId: 2,
    customer: {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      address: {
        street: "15, Vasant Vihar",
        city: "New Delhi",
        state: "Delhi",
        postalCode: "110057",
        country: "India"
      },
      phone: "+91 8765432109"
    },
    items: [
      {
        id: 3,
        bookId: 4,
        title: "Pather Panchali",
        author: "Bibhutibhushan Bandyopadhyay",
        price: 349.00,
        quantity: 1,
        isbn: "9788171673940",
        imageUrl: "https://m.media-amazon.com/images/I/51QZQZQZQZQ.jpg"
      },
      {
        id: 4,
        bookId: 7,
        title: "Ponniyin Selvan",
        author: "Kalki Krishnamurthy",
        price: 799.00,
        quantity: 1,
        isbn: "9788184934229",
        imageUrl: "https://m.media-amazon.com/images/I/51QZQZQZQZQ.jpg"
      }
    ],
    totalAmount: 748.00,
    status: "SHIPPED",
    paymentMethod: "PayPal",
    createdAt: "2023-11-14T09:15:00",
    updatedAt: "2023-11-14T15:30:00",
    shippingAddress: {
      street: "15, Vasant Vihar",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110057",
      country: "India"
    },
    trackingNumber: "IND123456789"
  },
  {
    id: 3,
    orderNumber: "ORD-2023-0040",
    userId: 4,
    customer: {
      id: 4,
      name: "Ananya Patel",
      email: "ananya.patel@example.com",
      address: {
        street: "7, Satellite Road",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380015",
        country: "India"
      },
      phone: "+91 7654321098"
    },
    items: [
      {
        id: 5,
        bookId: 10,
        title: "Aadujeevitham",
        author: "Benyamin",
        price: 349.00,
        quantity: 1,
        isbn: "9788126438617",
        imageUrl: "https://m.media-amazon.com/images/I/51QZQZQZQZQ.jpg"
      }
    ],
    totalAmount: 399.00,
    status: "DELIVERED",
    paymentMethod: "Credit Card",
    createdAt: "2023-11-13T16:45:00",
    updatedAt: "2023-11-15T10:20:00",
    shippingAddress: {
      street: "7, Satellite Road",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380015",
      country: "India"
    },
    trackingNumber: "IND987654321"
  },
  {
    id: 4,
    orderNumber: "ORD-2023-0039",
    userId: 5,
    customer: {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      address: {
        street: "22, Civil Lines",
        city: "Jaipur",
        state: "Rajasthan",
        postalCode: "302006",
        country: "India"
      },
      phone: "+91 6543210987"
    },
    items: [
      {
        id: 6,
        bookId: 2,
        title: "Madhushala",
        author: "Harivansh Rai Bachchan",
        price: 199.00,
        quantity: 1,
        isbn: "9788126439874",
        imageUrl: "https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg"
      },
      {
        id: 7,
        bookId: 5,
        title: "Gora",
        author: "Rabindranath Tagore",
        price: 399.00,
        quantity: 1,
        isbn: "9788171676989",
        imageUrl: "https://m.media-amazon.com/images/I/51QZQZQZQZQ.jpg"
      }
    ],
    totalAmount: 498.00,
    status: "PROCESSING",
    paymentMethod: "PayPal",
    createdAt: "2023-11-12T11:20:00",
    updatedAt: "2023-11-12T11:20:00",
    shippingAddress: {
      street: "22, Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302006",
      country: "India"
    },
    trackingNumber: null
  },
  {
    id: 5,
    orderNumber: "ORD-2023-0038",
    userId: 1,
    customer: {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      address: {
        street: "42/B, Nehru Nagar",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400076",
        country: "India"
      },
      phone: "+91 9876543210"
    },
    items: [
      {
        id: 8,
        bookId: 8,
        title: "Sivagamiyin Sabatham",
        author: "Kalki Krishnamurthy",
        price: 699.00,
        quantity: 1,
        isbn: "9788184934236",
        imageUrl: "https://m.media-amazon.com/images/I/51QZQZQZQZQ.jpg"
      }
    ],
    totalAmount: 349.00,
    status: "CANCELLED",
    paymentMethod: "Credit Card",
    createdAt: "2023-11-11T13:10:00",
    updatedAt: "2023-11-11T15:45:00",
    shippingAddress: {
      street: "42/B, Nehru Nagar",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400076",
      country: "India"
    },
    trackingNumber: null
  }
];

export const mockUsers = [
  // Regular Users
  {
    id: 1,
    username: "rajesh_kumar",
    email: "rajesh.kumar@example.com",
    displayName: "Rajesh Kumar",
    roles: ["ROLE_USER"],
    profileImage: null,
    userType: "user",
    description: "Book Lover",
    address: {
      street: "42/B, Nehru Nagar",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400076",
      country: "India"
    },
    phone: "+91 9876543210"
  },
  {
    id: 2,
    username: "priya_sharma",
    email: "priya.sharma@example.com",
    displayName: "Priya Sharma",
    roles: ["ROLE_USER"],
    profileImage: null,
    userType: "user",
    description: "Fiction Reader",
    address: {
      street: "15, Vasant Vihar",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110057",
      country: "India"
    },
    phone: "+91 8765432109"
  },
  {
    id: 4,
    username: "ananya_patel",
    email: "ananya.patel@example.com",
    displayName: "Ananya Patel",
    roles: ["ROLE_USER"],
    profileImage: null,
    userType: "user",
    description: "Poetry Enthusiast",
    address: {
      street: "7, Satellite Road",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380015",
      country: "India"
    },
    phone: "+91 7654321098"
  },
  {
    id: 5,
    username: "vikram_singh",
    email: "vikram.singh@example.com",
    displayName: "Vikram Singh",
    roles: ["ROLE_USER"],
    profileImage: null,
    userType: "user",
    description: "History Buff",
    address: {
      street: "22, Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302006",
      country: "India"
    },
    phone: "+91 6543210987"
  },

  // Admin Users
  {
    id: 3,
    username: "admin",
    email: "admin@bookstore.com",
    displayName: "Main Admin",
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    isAdmin: true,
    profileImage: null,
    userType: "admin",
    description: "Store Manager",
    address: {
      street: "123, MG Road",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India"
    },
    phone: "+91 9988776655"
  },
  {
    id: 6,
    username: "super_admin",
    email: "super@bookstore.com",
    displayName: "Super Admin",
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    isAdmin: true,
    profileImage: null,
    userType: "admin",
    description: "Store Owner",
    address: {
      street: "456, Park Avenue",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600001",
      country: "India"
    },
    phone: "+91 9876543210"
  },
  {
    id: 7,
    username: "inventory_admin",
    email: "inventory@bookstore.com",
    displayName: "Inventory Admin",
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    isAdmin: true,
    profileImage: null,
    userType: "admin",
    description: "Inventory Manager",
    address: {
      street: "789, Book Street",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700001",
      country: "India"
    },
    phone: "+91 8765432109"
  }
];

