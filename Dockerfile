# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制项目文件到容器
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制其余项目文件
COPY . .

# 构建 Next.js 项目
RUN npm run build

# 使用更小的镜像，优化镜像大小
FROM node:18-alpine AS runner

# 设置工作目录
WORKDIR /app

# 将构建产物从 builder 阶段复制到 runner 阶段
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/package-lock.json ./

# 安装仅生产依赖
RUN npm install --omit=dev

# 暴露应用运行的端口
EXPOSE 3000

# 启动 Next.js 应用
CMD ["npm", "run", "start"]