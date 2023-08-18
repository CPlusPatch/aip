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

LABEL org.opencontainers.image.authors "Gaspard Wierzbinski (https://cpluspatch.com)"
LABEL org.opencontainers.image.source "https://github.com/Uden-AI/aip"
LABEL org.opencontainers.image.vendor "Uden AI"
LABEL org.opencontainers.image.licenses "GPL-3.0"
LABEL org.opencontainers.image.title "Project AIP"
LABEL org.opencontainers.image.description "An advanced FOSS application for conversing with self-hosted AI models."

CMD ["/app/server/index.mjs"]
