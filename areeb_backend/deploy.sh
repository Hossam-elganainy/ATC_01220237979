set -e
ssh root@45.10.161.56 'cd /root/areeb && git pull --recurse-submodules'
ssh root@45.10.161.56 'cd /root/areeb && docker-compose up -d --build'
ssh root@45.10.161.56 'cp /root/areeb/infrastructure/nginx.conf /etc/nginx/sites-enabled/areeb.conf'
ssh root@45.10.161.56 'cp /root/areeb/infrastructure/front_nginx.conf /etc/nginx/sites-enabled/front_areeb.conf'
ssh root@45.10.161.56 'sudo nginx -s reload'


py manage.py makemessages -l ar
py manage.py compilemessages