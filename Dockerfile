FROM node:12
MAINTAINER jonathan.fung@connect.qut.edu.au
ADD ./app /app
WORKDIR /app
RUN npm install
ENV PORT 80
EXPOSE 80
ENV NODE_ENV production
CMD "./deploy.sh"
# run with docker run -p 80:80 cab432:latest Dockerfile
