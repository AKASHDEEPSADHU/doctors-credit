FROM node:22-bookworm-slim
# Portable fallback image. Production hosting is Cloudflare Workers, not this
# container and not Vercel.
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
ENV APP_ENV=production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
