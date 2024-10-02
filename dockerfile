# 在运行build后，把这个文件移动到.output目录下

FROM oven/bun

WORKDIR /app

COPY . .

ENV TZ=Asia/Shanghai

EXPOSE 3000

CMD ["bun", "server/index.mjs"]
