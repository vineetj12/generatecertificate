FROM node:20-alpine

# Install Chromium for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads/logos uploads/signatures uploads/pdfs uploads/qrcodes uploads/bulk

EXPOSE 5000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma db push && npm start"]
