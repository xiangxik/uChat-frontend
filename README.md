# uChat Frontend

React 18 + TypeScript + Vite frontend for uChat.

## Requirements

- Node.js 20+
- npm 10+

## Run

From frontend directory:

```bash
cd /Volumes/NVME/github/xiangxik/uChat/uChat-frontend
npm run dev -- --host 127.0.0.1
```

From repository root (if current directory is /Volumes/NVME/github/xiangxik/uChat):

```bash
npm --prefix /Volumes/NVME/github/xiangxik/uChat/uChat-frontend run dev -- --host 127.0.0.1
```

Frontend starts on http://127.0.0.1:5173.

## Build

```bash
npm run build
```

## Test

```bash
npm run test:run
```

## Backend dependency

- Frontend reads backend runtime config from /api/config.
- Backend default address: http://127.0.0.1:8080.

## Local integration checklist

1. Start backend first:

```bash
cd /Volumes/NVME/github/xiangxik/uChat/uChat-backend
./mvnw spring-boot:run
```

Or from repository root:

```bash
/Volumes/NVME/github/xiangxik/uChat/uChat-backend/mvnw -f /Volumes/NVME/github/xiangxik/uChat/uChat-backend/pom.xml spring-boot:run
```

2. Start frontend:

```bash
cd /Volumes/NVME/github/xiangxik/uChat/uChat-frontend
npm run dev -- --host 127.0.0.1
```

3. Open http://127.0.0.1:5173.

## Troubleshooting

- Port 5173 already in use:
  - Stop old process on 5173 and rerun frontend.
- Browser shows API or websocket errors:
  - Confirm backend is running and http://127.0.0.1:8080/actuator/health returns status UP.
- Running from repo root fails to find the frontend package:
  - Use npm --prefix /Volumes/NVME/github/xiangxik/uChat/uChat-frontend run dev -- --host 127.0.0.1.
