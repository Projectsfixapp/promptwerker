#!/usr/bin/env bash
# Deploy von promptwerker.de auf den eigenen Server.
#
# Auf dem Server ausführen:
#   cd /opt/promptwerker && ./ops/deploy.sh
#
# Holt den aktuellen Stand von GitHub, baut das Image und tauscht den
# Container. Caddy bekommt anschließend ein reload — ohne das zeigen seine
# Upstreams nach einem Container-Neubau auf die alte, tote IP.

set -euo pipefail

VERZEICHNIS="/opt/promptwerker"
CADDY_CONTAINER="mitfrauschmidt-caddy-1"

cd "$VERZEICHNIS"

echo "==> Stand holen"
git fetch --quiet origin main
VORHER="$(git rev-parse HEAD)"
git reset --hard --quiet origin/main
NACHHER="$(git rev-parse HEAD)"
echo "    $VORHER -> $NACHHER"

echo "==> Image bauen"
docker compose build promptwerker

echo "==> Container tauschen"
docker compose up -d promptwerker

echo "==> Warten bis der Container gesund ist"
for versuch in $(seq 1 30); do
  zustand="$(docker inspect --format '{{.State.Health.Status}}' promptwerker 2>/dev/null || echo unbekannt)"
  if [ "$zustand" = "healthy" ]; then
    echo "    gesund nach ${versuch}0s"
    break
  fi
  if [ "$versuch" = "30" ]; then
    echo "    FEHLER: Container wird nicht gesund. Letzte Ausgaben:" >&2
    docker logs --tail 40 promptwerker >&2
    exit 1
  fi
  sleep 10
done

# Neuer Container = neue IP im Docker-Netz. Caddy löst Upstream-Namen beim
# Start auf und läuft sonst weiter gegen die alte IP ins Leere.
echo "==> Caddy neu laden"
docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile

echo "==> Prüfen von außen"
code="$(curl -s -o /dev/null -w '%{http_code}' https://promptwerker.de/ || true)"
echo "    https://promptwerker.de/ -> $code"
if [ "$code" != "200" ]; then
  echo "    HINWEIS: kein 200. Solange die Domain noch nicht auf diesen Server" >&2
  echo "    zeigt, ist das erwartbar — dann intern prüfen:" >&2
  docker exec "$CADDY_CONTAINER" wget -qO- --spider http://promptwerker:3000/ && echo "    intern erreichbar" >&2
fi

echo "==> fertig"
