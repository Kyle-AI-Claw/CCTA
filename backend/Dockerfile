FROM node:20-bookworm AS builder

WORKDIR /app
# Copy prisma first so it's available for postinstall
COPY prisma ./prisma
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY prisma ./prisma
COPY index.ts ./index.ts
COPY controllers ./controllers
COPY routes ./routes
COPY lib ./lib
COPY types ./types
COPY middleware ./middleware
RUN npx tsc

FROM node:20-bookworm
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/types ./types
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
RUN mkdir -p uploads/thumbnails
COPY prisma/schema.prisma ./prisma/
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]