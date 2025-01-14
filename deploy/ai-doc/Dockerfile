FROM node:22.0.0

ARG container_version=0.1

ENV NODE_ENV production

LABEL description="ai-doc, nodejs" \
      version=$container_version \
      maintainer="<WebMaps> webmaps@2gis.ru" \
      source="https://gitlab.2gis.ru/WebMaps/ai_documentation"

WORKDIR /ai-doc-backend

COPY dist dist/
COPY package.json .
COPY package-lock.json .

RUN npm ci

CMD node dist/main.js
