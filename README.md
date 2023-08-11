# News-Hub Setup Guide

**Frontend:**

To get started with the News-Hub frontend project built using the Vite framework, follow these steps:

1. Create a `.env` file in the root directory.
2. Inside the `.env` file, define two variables:
   - `VITE_NEWS_API_URL`: Set this variable to the GNews API URL. Example: `VITE_NEWS_API_URL=https://gnews.io/api/v4/search?q={example}&lang=en&apikey=YOUR_API_KEY`
   - `VITE_BASE_URL`: Set this variable to the backend URL. Example: `VITE_BASE_URL=http://yourbackendapi.com`
3. Run the following command to start the development server:
   ```
   npm run dev
   ```

**Backend:**

To run the News-Hub backend project on your local machine, follow these steps:

1. Create a `.env` file in the backend directory.
2. Inside the `.env` file, define the following variables:
   - `DB_URL`: MongoDB URL. Example: `DB_URL=mongodb://127.0.0.1:27017/NewsHub`
   - `PORT`: Port number for the server. Example: `PORT=8080`
   - `JWT_SECRET_KEY`: Secret key for JWT authentication. Example: `JWT_SECRET_KEY=anything`
   - `OTP_API`: API for sending OTP. You can use the provided API or console log the OTP. To log the OTP, modify the `sendOtp` method in `Backend/controller/userController.js` with this code: `console.log(otp
   - FRONTEND_DOMAIN= "https://yourfrontenddomain.com"
   - `GNEWS_API`: Your GNews API key.
   - `NEWS_URL`: News URL with placeholders. Example: `NEWS_URL=https://gnews.io/api/v4/search?q={element}&lang=en&apikey=API_KEY`
3. To start the server, run the following command:
   ```
   npm run dev
   ```

**Demo Links**
Frontend : - https://melodic-queijadas-0d93d0.netlify.app <br />
Backend Api: - https://news-hub-ivory.vercel.app
