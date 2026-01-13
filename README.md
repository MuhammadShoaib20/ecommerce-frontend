Stripe client integration

This project uses Stripe Elements on the checkout page.

Install the required packages in the `frontend` folder:

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Then run the frontend dev server as usual:

```bash
npm run dev
```

Notes:
- The checkout page requests the publishable key from the backend via `GET /api/stripeapikey` (requires authentication). If the backend has no publishable key configured, the page falls back to a mocked payment flow.
- For local end-to-end webhook testing, see `backend/README.md` for Stripe CLI setup and the local e2e smoke test script.
