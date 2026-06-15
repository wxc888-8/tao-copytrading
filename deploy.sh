#!/bin/bash
# ==============================================================
# TAO 跟单系统 - 一键部署脚本
# 支持: Ubuntu 20.04 / 22.04 / 24.04
# 用法: bash deploy.sh
# ==============================================================

set -e

# ─── 颜色 ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; }
info() { echo -e "${BLUE}[i]${NC} $1"; }

# ─── 配置 ───────────────────────────────────────────────
REPO_URL="https://github.com/wxc888-8/tao-copytrading.git"
APP_DIR="/opt/tao-copytrading"
BACKEND_DIR="$APP_DIR/tao-backend"
FRONTEND_DIR="$APP_DIR"
MYSQL_ROOT_PASSWORD=""

# ─── 检查 root ──────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    err "请使用 root 用户运行此脚本"
    exit 1
fi

# ─── 1. 环境检查 ────────────────────────────────────────
echo ""
echo "=============================================="
echo "    TAO 跟单系统 - 环境检查"
echo "=============================================="
echo ""

# 检查 Java
if command -v java &>/dev/null; then
    JAVA_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VER" -ge 17 ]; then
        log "Java $JAVA_VER 已安装"
    else
        warn "Java 版本 $JAVA_VER 过低，需要 17+，将自动安装"
        INSTALL_JAVA=true
    fi
else
    warn "Java 未安装，将自动安装"
    INSTALL_JAVA=true
fi

# 检查 MySQL
if command -v mysql &>/dev/null; then
    MYSQL_VER=$(mysql --version 2>&1 | grep -oP 'Distrib \K[0-9.]+')
    log "MySQL $MYSQL_VER 已安装"
else
    warn "MySQL 未安装，将自动安装"
    INSTALL_MYSQL=true
fi

# 检查 Nginx
if command -v nginx &>/dev/null; then
    NGINX_VER=$(nginx -v 2>&1 | grep -oP 'nginx/\K[0-9.]+')
    log "Nginx $NGINX_VER 已安装"
else
    warn "Nginx 未安装，将自动安装"
    INSTALL_NGINX=true
fi

# 检查 Node.js
if command -v node &>/dev/null; then
    NODE_VER=$(node -v 2>&1 | grep -oP 'v\K[0-9]+')
    if [ "$NODE_VER" -ge 18 ]; then
        log "Node.js $(node -v) 已安装"
    else
        warn "Node.js 版本过低，需要 18+，将自动安装"
        INSTALL_NODE=true
    fi
else
    warn "Node.js 未安装，将自动安装"
    INSTALL_NODE=true
fi

# 检查 Git
if command -v git &>/dev/null; then
    log "Git $(git --version 2>&1 | grep -oP '\d+\.\S+') 已安装"
else
    warn "Git 未安装，将自动安装"
    INSTALL_GIT=true
fi

echo ""
echo "=============================================="
echo "    环境检查完成"
echo "=============================================="
echo ""

# ─── 2. 安装依赖 ────────────────────────────────────────
info "准备安装缺失的组件..."

# 询问 MySQL root 密码
if [ "$INSTALL_MYSQL" = true ]; then
    read -p "请输入要设置的 MySQL root 密码 [Dong001604.]: " MYSQL_ROOT_PASSWORD
    MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-Dong001604.}"
fi

# 更新包索引
apt update -y

# 安装 Java 17
if [ "$INSTALL_JAVA" = true ]; then
    info "安装 Java 17..."
    apt install openjdk-17-jdk -y
    log "Java 17 安装完成"
    java -version
fi

# 安装 MySQL 8
if [ "$INSTALL_MYSQL" = true ]; then
    info "安装 MySQL 8.0..."
    
    # 检测系统版本选择 MySQL 安装方式
    if grep -qi "ubuntu 24" /etc/os-release 2>/dev/null; then
        # Ubuntu 24 用 default-mysql-server
        apt install default-mysql-server -y
    else
        apt install mysql-server -y
    fi
    
    # 启动 MySQL
    systemctl start mysql
    systemctl enable mysql
    
    # 配置 root 密码
    mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';
FLUSH PRIVILEGES;
EOF
    
    log "MySQL 安装完成，root 密码已设置"
fi

# 安装 Nginx
if [ "$INSTALL_NGINX" = true ]; then
    info "安装 Nginx..."
    apt install nginx -y
    systemctl start nginx
    systemctl enable nginx
    log "Nginx 安装完成"
fi

# 安装 Node.js 18
if [ "$INSTALL_NODE" = true ]; then
    info "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install nodejs -y
    log "Node.js $(node -v) 安装完成"
fi

# 安装 Git
if [ "$INSTALL_GIT" = true ]; then
    info "安装 Git..."
    apt install git -y
    log "Git 安装完成"
fi

# ─── 3. 创建数据库 ──────────────────────────────────────
echo ""
info "配置数据库..."

# 获取之前设置的密码
if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
    # MySQL 已存在，询问密码
    if ! mysqladmin ping -u root --silent 2>/dev/null; then
        read -s -p "请输入 MySQL root 密码: " MYSQL_ROOT_PASSWORD
        echo ""
    fi
fi

# 创建数据库
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<EOF 2>/dev/null || {
    # 如果密码认证失败，尝试通过 socket 认证
    mysql -u root <<EOF
}
CREATE DATABASE IF NOT EXISTS tao_copytrading CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

if [ $? -eq 0 ]; then
    log "数据库 tao_copytrading 创建成功"
else
    err "数据库创建失败，请检查 MySQL 连接"
    exit 1
fi

# ─── 4. 拉取代码 ────────────────────────────────────────
echo ""
info "拉取项目代码..."

if [ -d "$APP_DIR" ]; then
    warn "目录 $APP_DIR 已存在，将备份为 ${APP_DIR}.bak"
    rm -rf "${APP_DIR}.bak" 2>/dev/null
    mv "$APP_DIR" "${APP_DIR}.bak"
fi

git clone "$REPO_URL" "$APP_DIR"
log "代码拉取完成"

# ─── 5. 配置数据库连接 ──────────────────────────────────
echo ""
info "配置后端数据库连接..."

cd "$BACKEND_DIR"
cat > src/main/resources/application.yml <<EOF
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tao_copytrading?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
    username: root
    password: ${MYSQL_ROOT_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
  flyway:
    enabled: true
    baseline-on-migrate: true

jwt:
  secret: $(openssl rand -hex 32)
  expiration: 86400000

logging:
  level:
    com.tao: INFO
EOF

log "后端配置完成"

# ─── 6. 构建并启动后端 ──────────────────────────────────
echo ""
info "构建后端..."
cd "$BACKEND_DIR"
chmod +x gradlew

# 用 gradle wrapper 构建
./gradlew build -x test -q 2>&1 | tail -5

if [ $? -ne 0 ]; then
    warn "Gradle 构建失败，尝试 Maven 或检查 JDK..."
    err "请检查上方错误信息"
    exit 1
fi

info "启动后端服务..."
JAR_FILE=$(ls build/libs/*.jar 2>/dev/null | head -1)
if [ -z "$JAR_FILE" ]; then
    err "未找到构建产物"
    exit 1
fi

nohup java -jar "$JAR_FILE" > /var/log/tao-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /var/run/tao-backend.pid

# 等待后端启动
info "等待后端启动..."
for i in $(seq 1 30); do
    sleep 2
    if curl -s http://127.0.0.1:8080/api/auth/login >/dev/null 2>&1; then
        log "后端启动成功 (PID: $BACKEND_PID)"
        break
    fi
    if [ "$i" -eq 30 ]; then
        warn "后端启动可能较慢，请检查日志: tail -f /var/log/tao-backend.log"
    fi
done

# ─── 7. 构建前端 ────────────────────────────────────────
echo ""
info "构建前端..."
cd "$FRONTEND_DIR"

npm install -q 2>&1 | tail -3
npm run build 2>&1 | tail -5

if [ -d "dist" ]; then
    log "前端构建完成"
else
    err "前端构建失败"
    exit 1
fi

# ─── 8. 配置 Nginx ──────────────────────────────────────
echo ""
info "配置 Nginx..."

# 获取服务器 IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")

cat > /etc/nginx/sites-available/tao <<EOF
server {
    listen 80;
    server_name $SERVER_IP;

    root $FRONTEND_DIR/dist;
    index index.html;

    gzip on;
    gzip_types text/plain application/javascript text/css application/json;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_read_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/tao /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

log "Nginx 配置完成"

# ─── 9. 开机自启 ────────────────────────────────────────
echo ""
info "配置开机自启..."

cat > /etc/systemd/system/tao-backend.service <<EOF
[Unit]
Description=TAO Copy Trading Backend
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/java -jar $BACKEND_DIR/build/libs/tao-copytrading-backend.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable tao-backend.service

log "开机自启配置完成"

# ─── 完成 ──────────────────────────────────────────────
echo ""
echo "=============================================="
echo -e "${GREEN}  ✅  TAO 跟单系统部署完成！${NC}"
echo "=============================================="
echo ""
echo "  访问地址: http://$SERVER_IP"
echo ""
echo "  后端日志: tail -f /var/log/tao-backend.log"
echo "  Nginx状态: systemctl status nginx"
echo "  后端状态: systemctl status tao-backend"
echo ""
echo "=============================================="
echo ""
