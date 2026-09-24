FROM node:20.19-alpine
RUN npm install -g nodemon
EXPOSE 3001
WORKDIR /app
COPY . .
RUN npm install
ENV DEBUG='bookservice:*'
ENTRYPOINT ["npm", "run", "dev"]