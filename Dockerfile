FROM docker.io/node:18-alpine AS builder

RUN apk add --update \
  git

RUN npm install --global pnpm

COPY . /app

RUN cd ./app && pnpm install
RUN cd ./app && pnpm build

FROM docker.io/node:18-alpine

COPY --from=builder /app/.output/ /app
COPY --from=builder /app/nuxt.config.ts /nuxt.config.ts

CMD ["/app/server/index.mjs"]
