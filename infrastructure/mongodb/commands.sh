kubectl create -f headless-service.yaml
kubectl create -f mongodb-statefulset.yaml

kubectl exec -it mongo-0 -- mongo
> rs.initiate()
> var cfg = rs.conf()
> cfg.members[0].host="mongo-0.mongo:27017"
> rs.reconfig(cfg)
> rs.add("mongo-1.mongo:27017")
> rs.add("mongo-2.mongo:27017")
> rs.status()

# mongo mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo/admin?replicaSet=rs0

kubectl create -f mongo-express.yaml

