# Fitness App Backend Using Nodejs Express MongoDB and Cloudinary

## TechUsed

```pgsql
- Nodejs(for Backend)
- ExpressJs( nodejs framework)
- MongoDB (Database)
- Cloudinary. (to store images and Documents)
- bcrypt (for HashedPassword)
- pdfKit( to convert form data into a pdf document)
- socket.io (for communication)
- cors (for connect with frontend)
- cookieParser ( to store cookie)
- jsonwebtoken (to store data in cookie format)
- multer (to store img in database and upload on cloudinary)
- nodemailer (to reset password )
```


## .env these value needs

```env
# Database Url from MongoDB Altas

MONGO_URI=

# admin AUTHCode (to create admin)

- AUTH_CODE=

# jwt secret keys and expiry

- JWT_REFRESH_EXPIRY=7d
- JWT_ACCESS_EXPIRY=30m
- JWT_REFRESH_TOKEN=node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
- JWT_ACCESS_TOKEN=node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Cloudinary Keys

- CLOUDINARY_CLOUD_NAME=
- CLOUDINARY_API_KEY=
- CLOUDINARY_API_SECRET=

# Backend Port and Node mode

- PORT=5000
- NODE_ENV=development

# Nodemailer Email and host

- EMAIL_HOST=stmp.gmail.com
- EMAIL_PORT=587
- EMAIL_USER=<your-email>@gmail.com
- EMAIL_PASS= <your email secret pass like(wweuwoieuwoe)


```

✅ Tip: For Cloudinary, enable PDF/ZIP file delivery in the security settings to serve PDFs correctly.

# npm install

```
npm i
```

# for github Clone

```bash
https://github.com/SyedTalha71x/timathy1/tree/master/server
```
