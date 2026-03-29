# Liamoles

A prize-shop web app backed by AWS Lambda + DynamoDB.

## Repo structure

```
liamoles-app/       React frontend (GitHub Pages)
liamoles-backend/   AWS CDK stack (Lambda + DynamoDB + API Gateway)
```

---

## 1 — Deploy the backend first

### Prerequisites
- AWS CLI configured (`aws configure`)
- Node 18+
- CDK bootstrapped in us-east-1: `npx cdk bootstrap aws://ACCOUNT_ID/us-east-1`

### Steps

```bash
cd liamoles-backend
npm install
npx cdk deploy
```

At the end of the deploy you'll see output like:

```
LiamolesStack.ApiUrl = https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod/
```

Save that URL — you need it for the frontend.

### API endpoints

| Method | Path         | Body                              | Description              |
|--------|-------------|-----------------------------------|--------------------------|
| GET    | /liamoles   | —                                 | Returns `{ amount: N }`  |
| POST   | /liamoles   | `{ action: "add", amount: N }`    | Adds N liamoles          |
| POST   | /liamoles   | `{ action: "subtract", amount: N }` | Subtracts N (fails with 409 if insufficient) |

---

## 2 — Run the frontend locally

```bash
cd liamoles-app
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL to your API Gateway URL
npm install
npm run dev
```

---

## 3 — Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In repo Settings → Pages → Source: **GitHub Actions**.
3. Add a repository secret `VITE_API_URL` with your API Gateway URL.
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` will build and deploy automatically.

The site will be live at `https://<your-username>.github.io/liamoles/`.

---

## Customizing prizes

Edit `liamoles-app/src/data/prizes.js` — each prize is just an object in the array. Redeploy (push to main) to update.

## Changing the admin PIN

Edit the `ADMIN_PIN` constant at the top of `liamoles-app/src/components/AdminPanel.jsx`.
