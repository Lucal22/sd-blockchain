# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_PORT=5000
ENV NEXT_PUBLIC_API_PORT=$NEXT_PUBLIC_API_PORT

RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/.next ./.next

ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT

CMD ["sh", "-c", "npm start -- -p $PORT"]
