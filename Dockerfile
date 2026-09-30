FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

COPY . .

# Build
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
