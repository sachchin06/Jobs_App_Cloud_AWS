FROM public.ecr.aws/lambda/nodejs:18

#COPY app.js package*.json ./
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source


CMD [ "lambda.handler"]