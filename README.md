# E-Commerce Application Backend

## Description

This e-commerce backend application is designed to provide a comprehensive platform for online shopping, combining robust backend functionality with a focus on security, user experience, and efficient product management.

## Core Features of the E-commerce Application

### User Authentication and Authorization

- **User Registration, Login, and Profile Updates:** Facilitates easy onboarding and profile management for users.
- **Password Encryption with Bcrypt:** Ensures secure password handling for user accounts.
- **JWT Token Generation:** Enables secure authentication across the application.
- **Role-Based Access Control:** Admin-specific functionalities are safeguarded with middleware checks.

### Product Management

- **CRUD Operations:** Complete management of product listings through Create, Read, Update, and Delete operations.
- **Advanced Product Features:** Enhancements like filtering, sorting, pagination, and field limitation to improve navigation and product discovery.
- **Image Upload and Management:** Utilizes Cloudinary for efficient handling of product images.

### Order and Cart Management

- **Cart Functionality:** Supports adding products to cart, calculating total cart value, and cart emptying processes.
- **Order Creation and Status Updates:** Manages the lifecycle of an order from placement to fulfillment.
- **Coupon Functionality:** Allows for the application of discounts and promotional offers.

### Security and Error Handling

- **Error Handling Middleware:** Provides comprehensive handling for API errors and not found requests.
- **Sensitive Operations Security:** Secure management of operations like password reset, including token generation and management.

### User Experience Enhancements

- **Wishlist Functionality:** Enables users to save and manage products for later viewing.
- **Product Rating and Review System:** Allows community-driven ratings and reviews for products.

### Backend Infrastructure

- **Robust Architecture:** Built on Node.js, ensuring clear separation among models, controllers, and routes.
- **MongoDB for Data Storage:** Leverages Mongoose for data schema definition and validation, enhancing data integrity.

### Additional Features

- **Multi-Address Functionality:** Allows users to manage multiple shipping addresses.
- **Blog Section Management:** Supports creating, updating, liking, and disliking blog posts, fostering community engagement.

---

Our application combines a rich set of features to provide users with a secure, engaging, and comprehensive online shopping experience. By leveraging modern web technologies and best practices, we ensure that our platform remains at the forefront of e-commerce innovation.

## Dependencies

This project uses the following dependencies:

- bcrypt
- cloudinary
- cookie-parser
- dotenv
- express
- express-async-handler
- jsonwebtoken
- mongoose
- morgan
- multer
- nodemailer
- sharp
- slugify
- uniqid

## Installation

To run this project, follow these steps:

1. Clone the repository: `git clone https://github.com/FahimJadid/e-commerce-backend.git`
2. Navigate to the project directory: `cd server`
3. Install the dependencies: `npm install`
4. Start the project: `npm start`
5. Create a `.env` file in the root directory of the project and add the following environment variables: 

## .env example
```
PORT=5000
DATABASE_URL=<Your_MongoDB_Connection_String>
JWT_SECRET=<Your_JWT_Secret>
MAIL_USER_ID=<Your_Email>
MAIL_PASS=<Your_Email_App_Password>
CLOUDINARY_CLOUD_NAME=<Your_Cloudinary_Cloud_Name>
CLOUDINARY_API_KEY=<Your_Cloudinary_API_Key>
CLOUDINARY_API_SECRET=<Your_Cloudinary_API_Secret>
FOLDER_NAME=

```

## Usage

After starting the project, it will listen for requests on `http://localhost:5000`. You can use a tool like Postman to send requests to the API endpoints.

## Contributing

If you want to contribute, please fork the repository and create a pull request. We appreciate any help!

## Author

- Fahim Al Jadid

## License

This project is licensed under the MIT License.
