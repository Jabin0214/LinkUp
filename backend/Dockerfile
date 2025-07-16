# 使用多阶段构建减少镜像大小
# 运行时阶段
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# 优化：设置环境变量
ENV ASPNETCORE_URLS=http://+:80
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_gcServer=0
ENV DOTNET_gcConcurrent=1

# 构建阶段
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 复制项目文件并还原依赖
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"

# 复制源代码
COPY . .

# 构建项目
RUN dotnet build "backend.csproj" -c Release -o /app/build

# 发布应用程序
FROM build AS publish
RUN dotnet publish "backend.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# 最终运行阶段
FROM base AS final
WORKDIR /app

# 安装curl用于健康检查
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 复制发布的文件
COPY --from=publish /app/publish .

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

ENTRYPOINT ["dotnet", "backend.dll"]