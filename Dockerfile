FROM node:12
MAINTAINER jonathan.fung@connect.qut.edu.au
ADD . /app
WORKDIR /app
RUN npm install
EXPOSE 80
ENV PORT 80
ENTRYPOINT ["npm", "start"]
# run with docker run -p 80:80 cab432:latest Dockerfile
