## Reference:

[财报狗](https://statementdog.com/analysis/2330/monthly-revenue)
[Figma 设计图](<https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FnBCCS3g1xFDJnFShBBuVZB%2FStark-Tech%E5%89%8D%E7%AB%AF%E8%A9%95%E6%B8%AC-(%E7%B0%A1%E7%89%88)%3Ftype%3Ddesign%26node-id%3D0-1%26mode%3Ddesign%26t%3DzkzG36fgrHo7VSkX-0>)
[APIs](https://finmindtrade.com/analysis/#/data/api)

## Getting Started

First, create your own .env.local file, and set your finmind user_id and password in it.

Second, install dependencies:

```bash
npm install
```

Third, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Get Docker Image from Docker Hub
```bash
docker pull zoverdoser/stockdog-web:latest
```

## Build Docker Image

Run build.sh to build docker image.

## Run Docker Image

```bash
docker run -d -p 3000:3000 \
  -e FINMIND_USER_ID=YOUR_FINMIND_USER_ID \
  -e FINMIND_USER_PASSWORD=YOUR_FINMIND_USER_PASSWORD \
  -e FINMIND_API_HOST=https://api.finmindtrade.com \
  stockdog-web
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
