const express =require('express');
const connection = require("./db")
const cors=require('cors');
const authRoutes = require("./routes/auth")
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const app = express();
app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.get("/",async(req,res)=>{
try {
   res.setHeader('Content-Type', 'text/html');
   const htmlcode =`<!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Social Media Server</title>
   </head>
   <body>
       <header style="background-color: #3498db; color: white; padding: 20px; text-align: center;">
           <h1>Welcome to Our Social Media Server</h1>
       </header>
       <nav style="background-color: #f1f1f1; padding: 10px; text-align: center;">
           <ul style="list-style: none;">
               <li style="display: inline; margin-right: 20px;"><a href="/api/auth" style="text-decoration: none; color: #333;">Auth</a></li>
               <li style="display: inline; margin-right: 20px;"><a href="/api/users" style="text-decoration: none; color: #333;">Profile</a></li>
               <li style="display: inline; margin-right: 20px;"><a href="/api/posts" style="text-decoration: none; color: #333;">Post</a></li>
               <li style="display: inline; margin-right: 20px;"><a href="/docs" style="text-decoration: none; color: #333;">Swaggerdoc</a></li>
           </ul>
       </nav>
       <main style="margin: 20px;">
           <section class="post" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 20px;">
               <div class="user-info" style="display: flex; align-items: center;">
                   <img src="https://tse1.mm.bing.net/th?id=OIP.0JfH6B6mLppqKNo9o4qRIgHaFf&pid=Api&P=0&h=220" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                   <h2>Batman</h2>
               </div>
               <p>Batman is an American live-action television series based on the DC Comics character of the same name.</p>
           </section>
           <!-- More post sections can be added here -->
       </main>
       <footer style="text-align: center; padding: 10px; background-color: #f1f1f1;">
           <p>&copy; 2023 Social Media Server. All rights reserved.</p>
       </footer>
   </body>
   </html>
   `
   res.status(200).send(htmlcode)
} catch (error) {
   res.send(error)
}
})
app.listen(4500,async()=>{
try {
   await connection;
   console.log("connected to the DB and server running at http://localhost:4500");
} catch (error) {
   console.log(error.message)
}
})