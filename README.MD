Jobs Crud Application

AWS Lambda, Cognito, Api Gateway

SImplements Steps

#create docker image
docker build -t job-app-img:1.0.0 .

#create aws docker registry
aws ecr create-repository --repository-name jobs-api-img --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true

#create docker image with aws registry
auth api image : docker tag 65338a417e5d 728330430041.dkr.ecr.us-east-1.amazonaws.com/jobs-auth-img:0.0.1
jobs api image : docker tag 1d923637eb71 728330430041.dkr.ecr.us-east-1.amazonaws.com/jobs-app-img:0.0.1

#sam build
sam build

#sam deploy
sam deploy --guided
