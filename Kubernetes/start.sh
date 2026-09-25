#!/bin/bash

# cd into Kubernetes first, then run this script

# Don't need to run these three lines if you're using Windows/Mac
minikube start
kubectl config use-context minikube
docker context use default

kubectl apply -f booktracker.yaml -l data=config
kubectl apply -f booktracker.yaml -l app=mongodb

export mongodb_ip=$( kubectl get services/mongodb-service --template='{{.spec.clusterIP}}' )
	
kubectl get configmap/mongodb-config -o yaml    | sed -r "s/NOTSET/$mongodb_ip/" | kubectl apply -f -

kubectl apply -f booktracker.yaml -l app=booktrackerapp
kubectl apply -f booktracker.yaml -l app=bookservice

# Don't need to run this line if you're using Windows/Mac
minikube service booktrackerapp-service