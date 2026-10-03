FROM node:22-alpine AS build
WORKDIR /repo
COPY server/package.json server/package-lock.json server/
COPY server/tsconfig.json server/tsconfig.json
COPY server/src server/src
COPY src/lib src/lib
WORKDIR /repo/server
RUN npm ci && ln -s /repo/server/node_modules /repo/node_modules && npm run build

FROM node:22-alpine
WORKDIR /repo
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4000
COPY server/package.json server/package-lock.json server/
WORKDIR /repo/server
RUN npm ci --omit=dev
WORKDIR /repo
COPY --from=build /repo/server/dist server/dist
COPY data data
COPY messages messages
EXPOSE 4000
CMD ["node", "server/dist/server/src/main.js"]
