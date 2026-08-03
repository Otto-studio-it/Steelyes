#!/usr/bin/env bash
# Run ON the Droplet as deploy (sudo): starts Coolify Traefik proxy.
set -euo pipefail

echo "Starting Coolify proxy..."
cd /data/coolify/proxy
if [[ -f docker-compose.yml ]]; then
  sudo docker compose up -d
elif [[ -f /data/coolify/source/docker-compose.prod.yml ]]; then
  # Fallback: start from saved proxy compose if present
  sudo docker compose -f /data/coolify/proxy/docker-compose.yml up -d 2>/dev/null || true
fi

# Prefer Coolify-managed compose written under /data/coolify/proxy
if sudo docker ps -a --format '{{.Names}}' | grep -qx coolify-proxy; then
  sudo docker start coolify-proxy || sudo docker compose -f /data/coolify/proxy/docker-compose.yml up -d
else
  # Write compose from Coolify default if missing
  if [[ ! -f /data/coolify/proxy/docker-compose.yml ]]; then
    sudo tee /data/coolify/proxy/docker-compose.yml >/dev/null <<'YAML'
name: coolify-proxy
networks:
  coolify:
    external: true
services:
  traefik:
    container_name: coolify-proxy
    image: 'traefik:v3.6'
    restart: unless-stopped
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - coolify
    ports:
      - '80:80'
      - '443:443'
      - '443:443/udp'
      - '8080:8080'
    healthcheck:
      test: 'wget -qO- http://localhost:80/ping || exit 1'
      interval: 4s
      timeout: 2s
      retries: 5
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
      - '/data/coolify/proxy/:/traefik'
    command:
      - '--ping=true'
      - '--ping.entrypoint=http'
      - '--api.dashboard=true'
      - '--entrypoints.http.address=:80'
      - '--entrypoints.https.address=:443'
      - '--entrypoints.http.http.encodequerysemicolons=true'
      - '--entryPoints.http.http2.maxConcurrentStreams=250'
      - '--entrypoints.https.http.encodequerysemicolons=true'
      - '--entryPoints.https.http2.maxConcurrentStreams=250'
      - '--entrypoints.https.http3'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--certificatesresolvers.letsencrypt.acme.httpchallenge=true'
      - '--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=http'
      - '--certificatesresolvers.letsencrypt.acme.storage=/traefik/acme.json'
      - '--api.insecure=false'
      - '--providers.docker=true'
      - '--providers.docker.exposedbydefault=false'
    labels:
      - traefik.enable=true
      - traefik.http.routers.traefik.entrypoints=http
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.services.traefik.loadbalancer.server.port=8080
      - coolify.managed=true
      - coolify.proxy=true
YAML
  fi
  sudo mkdir -p /data/coolify/proxy/dynamic
  sudo touch /data/coolify/proxy/acme.json
  sudo chmod 600 /data/coolify/proxy/acme.json
  cd /data/coolify/proxy && sudo docker compose up -d
fi

sudo docker ps --filter name=coolify-proxy --format '{{.Names}} {{.Status}}'
echo "Done. If Coolify UI still shows exited, open Servers → localhost → Proxy → Start Proxy once."
