FROM node:20.19-alpine
RUN npm install -g nodemon
EXPOSE 3000
WORKDIR /app
COPY . .
RUN npm install
ENV DEBUG='bookshareapp:*'
ENTRYPOINT ["npm", "run", "dev"]
