#Selected the node version image to start.
FROM node:12
#selected where in the container the app files should be.
WORKDIR /usr/src/ezops
#Copy all the packages in the root folder to install dependencies after.
COPY package*.json ./
#The line above helps provide faster, reliable, reproducible builds for production environments.
RUN npm install --only=production
#Copy the source code to the image.
COPY . .
#expose the app port
EXPOSE 8080
#Finally, the command to run the app.
CMD [ "node", "index.js" ]