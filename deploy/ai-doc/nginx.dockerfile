FROM nginx:1.16.1-alpine

ARG container_version=0.1

LABEL description="AI doc, nginx" \
      version=$container_version \
      maintainer="<WebMaps> webmaps@2gis.ru" \
      source="https://gitlab.2gis.ru/WebMaps/ai_documentation"

WORKDIR /ai-doc

COPY deploy/ai-doc/*.conf /etc/nginx/
