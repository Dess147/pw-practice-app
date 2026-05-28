FROM mcr.microsoft.com/playwright:v1.59.1-noble

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npx playwright install 