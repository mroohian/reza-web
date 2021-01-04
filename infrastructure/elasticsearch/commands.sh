> htpasswd -c auth admin
> kubectl create secret generic basic-auth --from-file=auth