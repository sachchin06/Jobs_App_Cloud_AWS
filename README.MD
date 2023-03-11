docker tag 165b3a229578 728330430041.dkr.ecr.us-east-1.amazonaws.com/jobs-auth-img:0.0.1

728330430041.dkr.ecr.us-east-1.amazonaws.com/jobs-api-img

aws ecr create-repository --repository-name jobs-api-img --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true

steps

#create docker image
docker build -t job-app-img:1.0.0 .

#create aws docker registry
