# AnimeHelper Nuxt前端页面

完整的项目（后端）[在这里](https://github.com/Zhoucheng133/Anime-Helper)

> [!NOTE]
> 注意，这个项目的页面[AnimeHelper](https://github.com/Zhoucheng133/Anime-Helper)中的页面有些区别，如果你想要查找AnimeHelper中由Vue3开发的**静态页面**的代码，请切换到`static`分支，这个分支是由Nuxt开发的**服务器端渲染**页面

> [!IMPORTANT]
> 如果你使用本分支，即服务器端渲染的方式的搭建，务必仔细阅读[搭建指南](#搭建指南)，如果你觉得复杂可以直接使用[AnimeHelper](https://github.com/Zhoucheng133/Anime-Helper)中的说明直接搭建，只是缺少ssr功能

## 搭建指南

1. 先搭建好[AnimeHelper](https://github.com/Zhoucheng133/Anime-Helper)
2. 使用[Bun](https://bun.sh/)来搭建本项目环境（你也可以尝试使用`yarn`或者`npm`）
3. 在本项目中安装好依赖
   ```bash
   bun install
   # 如果你使用yarn或者npm
   # yarn install
   # npm install
   ```
4. 修改服务器端渲染的Host
   ```typescript
   // hooks/network.ts
   // 修改下面这行为你的AnimeHelper服务端IP和端口
   export const ssrHost='http://192.168.31.236:5000';
   // 下面这行不用修改
   export const reqHost='';
   ```
5. 使用下面的命令生成服务文件
   ```bash
   bun run build
   # 如果你使用yarn或者npm
   # yarn run build
   # npm run build
   ```
6. 如果你不使用Docker，那么在服务器端安装好Bun或者Node.js，复制.output文件内容到服务器（如果你正确生成服务文件，会在根目录有这个文件夹，建议将其重命名）
   > [!WARNING]
   > 建议使用Docker搭建，AnimeHelper服务端和本项目默认端口都为3000，可能存在端口冲突
7. 运行服务器
   ```bash
   cd <输出的文件夹>
   bun run server/index.mjs
   # 或者使用node.js
   # node run server/index.mjs
   ```
8. 如果你使用了Docker，那么将`dockerfile`复制到输出文件夹中，然后执行dockerfile即可
   > [!WARNING]
   > 默认暴露端口号为3000，将其转发成主机另外的端口号以防冲突
9. 用nginx统一两者的端口
    ```conf
   # nginx.conf
   server{
      listen <统一的端口号>;
      server_name animehelper;

      location /api{
        proxy_pass http://127.0.0.1:<AnimeHelper服务端口>/api;
      }

      location /{
        proxy_pass http://127.0.0.1:<Docker转发端口或者3000端口>;
      }
    }
    ```