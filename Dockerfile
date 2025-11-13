FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci || npm install
COPY tsconfig.json .
COPY src ./src
COPY prisma ./prisma
RUN npm run prisma:generate && npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]