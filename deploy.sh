#!/bin/bash
# ==============================================================
# TAO 跟单系统 - 一键部署脚本 (支持 Ubuntu / CentOS / RHEL / OpenCloudOS)
# 用法: bash deploy.sh
# ==============================================================

set -e

# ─── 颜色 ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; }
info() { echo -e "${BLUE}[i]${NC} $1"; }

# ─── 配置 ───────────────────────────────────────────────
REPO_URL="https://github.com/wxc888-8/tao-copytrading.git"
APP_DIR="/opt/tao-copytrading"
BACKEND_DIR="$APP_DIR/tao-backend"
FRONTEND_DIR="$APP_DIR"

# ─── 检查 root ──────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    err "请使用 root 用户运行此脚本"
    exit 1
fi

# ─── 检测系统 ──────────────────────────────────────────
IS_DEBIAN=false
IS_RHEL=false
PKG_INSTALL=""
PKG_UPDATE=""
JAVA_PKG=""
MYSQL_SERVICE=""

if command -v apt &>/dev/null; then
    IS_DEBIAN=true
    PKG_UPDATE="apt update -y"
    PKG_INSTALL="apt install -y"
    JAVA_PKG="openjdk-17-jdk"
    MYSQL_SERVICE="mysql"
elif command -v dnf &>/dev/null; then
    IS_RHEL=true
    PKG_UPDATE="dnf update -y"
    PKG_INSTALL="dnf install -y"
    JAVA_PKG="java-17-openjdk-devel"
    MYSQL_SERVICE="mysqld"
elif command -v yum &>/dev/null; then
    IS_RHEL=true
    PKG_UPDATE="yum update -y"
    PKG_INSTALL="yum install -y"
    JAVA_PKG="java-17-openjdk-devel"
    MYSQL_SERVICE="mysqld"
else
    err "不支持的系统！仅支持 Ubuntu/Debian/CentOS/RHEL/OpenCloudOS"
    exit 1
fi

echo ""
echo "=============================================="
echo "    TAO 跟单系统 - 一键部署"
echo "    系统: $(cat /etc/os-release 2>/dev/null | head -1 || uname -a)"
echo "=============================================="
echo ""

# ─── 1. 安装基础工具 ────────────────────────────────
info "安装基础依赖..."
$PKG_UPDATE
$PKG_INSTALL wget curl git tar gzip

# ─── 2. 安装 Java 17 ──────────────────────────────────
if command -v java &>/dev/null; then
    JAVA_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VER" -ge 17 ]; then
        log "Java $JAVA_VER 已安装"
    else
        warn "Java 版本过低，安装 Java 17..."
        INSTALL_JAVA=true
    fi
else
    INSTALL_JAVA=true
fi

if [ "$INSTALL_JAVA" = true ]; then
    info "安装 Java 17..."
    $PKG_INSTALL $JAVA_PKG
    log "Java 17 安装完成"
    java -version
fi

# ─── 3. 安装 MySQL 8.0 ────────────────────────────────
MYSQL_ROOT_PASSWORD=""
if command -v mysql &>/dev/null; then
    log "MySQL 已安装"
    read -s -p "请输入 MySQL root 密码 (留空则使用默认 'Dong001604.'): " MYSQL_ROOT_PASSWORD
    echo ""
    MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-Dong001604.}"
else
    info "安装 MySQL 8.0..."
    
    if [ "$IS_DEBIAN" = true ]; then
        # Ubuntu/Debian
        $PKG_INSTALL mysql-server
        systemctl start mysql
        systemctl enable mysql
    else
        # RHEL/CentOS/OpenCloudOS
        OS_VERSION=$(grep -oP 'VERSION_ID="\K[^"]+' /etc/os-release 2>/dev/null | cut -d'.' -f1)
        if [ -z "$OS_VERSION" ] || [ "$OS_VERSION" -ge 8 ]; then
            rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm 2>/dev/null || true
        else
            rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm 2>/dev/null || true
        fi
        rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023 2>/dev/null || true
        $PKG_INSTALL mysql-community-server
        systemctl start mysqld
        systemctl enable mysqld
    fi
    
    # 获取临时密码（RHEL 系需要）
    TEMP_PASSWORD=""
    if [ "$IS_RHEL" = true ]; then
        TEMP_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log 2>/dev/null | tail -1 | grep -oP 'root@localhost: \K.*')
    fi
    
    if [ -n "$TEMP_PASSWORD" ]; then
        log "MySQL 临时密码: $TEMP_PASSWORD"
        read -p "请输入要设置的新密码 [Dong001604.]: " MYSQL_ROOT_PASSWORD
        MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-Dong001604.}"
        mysql -u root -p"$TEMP_PASSWORD" --connect-expired-password <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';
FLUSH PRIVILEGES;
EOF
        log "MySQL 密码设置成功"
    else
        # Ubuntu 或已初始化的系统
        MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-Dong001604.}"
        
        # Ubuntu 22.04 用 auth_socket，需要先切换到 mysql_native_password
        if [ "$IS_DEBIAN" = true ]; then
            mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';
FLUSH PRIVILEGES;
EOF
        fi
    fi
fi

# 确保密码有值
MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-Dong001604.}"

# 创建数据库
info "创建数据库..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS tao_copytrading CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS tao_copytrading CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
}
log "数据库 tao_copytrading 创建成功"

# ─── 4. 安装 Nginx ────────────────────────────────────
if command -v nginx &>/dev/null; then
    log "Nginx 已安装"
else
    info "安装 Nginx..."
    $PKG_INSTALL nginx
    systemctl start nginx
    systemctl enable nginx
    log "Nginx 安装完成"
fi

# ─── 5. 安装 Node.js 18 ────────────────────────────────
if command -v node &>/dev/null; then
    NODE_VER=$(node -v 2>&1 | grep -oP 'v\K[0-9]+')
    if [ "$NODE_VER" -ge 18 ]; then
        log "Node.js $(node -v) 已安装"
    else
        warn "Node.js 版本过低，重新安装..."
        INSTALL_NODE=true
    fi
else
    INSTALL_NODE=true
fi

if [ "$INSTALL_NODE" = true ]; then
    info "安装 Node.js 18..."
    if [ "$IS_DEBIAN" = true ]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    else
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    fi
    $PKG_INSTALL nodejs
    log "Node.js $(node -v) 安装完成"
fi

# ─── 6. 克隆代码 ──────────────────────────────────────
echo ""
info "拉取项目代码..."

if [ -d "$APP_DIR" ]; then
    warn "目录 $APP_DIR 已存在，覆盖更新..."
    cd "$APP_DIR"
    git pull origin master 2>/dev/null || {
        rm -rf "$APP_DIR"
        git clone "$REPO_URL" "$APP_DIR"
    }
else
    git clone "$REPO_URL" "$APP_DIR"
fi
log "代码拉取完成"

# ─── 7. 配置后端 ──────────────────────────────────────
echo ""
info "配置后端..."

JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | base64 2>/dev/null || echo "tao-copytrading-jwt-secret-2024")

cat > "$BACKEND_DIR/src/main/resources/application.yml" <<EOF
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
  secret: ${JWT_SECRET}
  expiration: 86400000

logging:
  level:
    com.tao: INFO
EOF

log "后端配置完成"

# ─── 8. 构建并启动后端 ────────────────────────────────
echo ""
info "构建后端..."
cd "$BACKEND_DIR"
chmod +x gradlew

./gradlew build -x test -q 2>&1 || {
    warn "Gradle 构建失败，尝试检查..."
    ./gradlew build -x test 2>&1 | tail -20
    err "构建失败，请检查上方错误"
    exit 1
}

JAR_FILE=$(ls build/libs/*.jar 2>/dev/null | head -1)
if [ -z "$JAR_FILE" ]; then
    err "未找到 JAR 文件"
    exit 1
fi

info "启动后端服务..."
nohup java -jar "$JAR_FILE" > /var/log/tao-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /var/run/tao-backend.pid

info "等待后端启动（最多 60 秒）..."
for i in $(seq 1 30); do
    sleep 2
    if curl -s http://127.0.0.1:8080/api/auth/login >/dev/null 2>&1; then
        log "后端启动成功 (PID: $BACKEND_PID)"
        break
    fi
    if [ "$i" -eq 30 ]; then
        log "后端启动中，请检查日志: tail -f /var/log/tao-backend.log"
    fi
done

# ─── 9. 构建前端 ──────────────────────────────────────
echo ""
info "构建前端..."
cd "$FRONTEND_DIR"

npm install --legacy-peer-deps 2>&1 | tail -3
npm run build 2>&1 | tail -5

if [ -d "dist" ]; then
    log "前端构建完成"
else
    err "前端构建失败"
    exit 1
fi

# ─── 10. 配置 Nginx ──────────────────────────────────
echo ""
info "配置 Nginx..."

SERVER_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || curl -s ifconfig.me 2>/dev/null || echo "localhost")

# Ubuntu Nginx 配置路径不同
if [ "$IS_DEBIAN" = true ]; then
    NGINX_CONF="/etc/nginx/sites-available/tao"
    NGINX_ENABLED="/etc/nginx/sites-enabled/tao"
else
    NGINX_CONF="/etc/nginx/conf.d/tao.conf"
    NGINX_ENABLED="$NGINX_CONF"
fi

cat > "$NGINX_CONF" <<EOF
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

# Ubuntu 需要启用站点
if [ "$IS_DEBIAN" = true ]; then
    ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
    rm -f /etc/nginx/sites-enabled/default
else
    rm -f /etc/nginx/conf.d/default.conf 2>/dev/null
    rm -f /etc/nginx/conf.d/example.conf 2>/dev/null
fi

nginx -t && systemctl restart nginx
log "Nginx 配置完成"

# ─── 11. 开机自启 ────────────────────────────────────
echo ""
info "配置开机自启..."

if [ "$IS_DEBIAN" = true ]; then
    AFTER_TARGET="network.target mysql.service"
else
    AFTER_TARGET="network.target mysqld.service"
fi

cat > /etc/systemd/system/tao-backend.service <<EOF
[Unit]
Description=TAO Copy Trading Backend
After=$AFTER_TARGET

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

# ─── 防火墙 ──────────────────────────────────────────
if systemctl is-active firewalld &>/dev/null; then
    info "配置防火墙..."
    firewall-cmd --permanent --add-port=80/tcp 2>/dev/null || true
    firewall-cmd --permanent --add-port=8080/tcp 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
    log "防火墙配置完成"
fi

# ─── 完成 ──────────────────────────────────────────────
echo ""
echo "=============================================="
echo -e "${GREEN}  ✅  TAO 跟单系统部署完成！${NC}"
echo "=============================================="
echo ""
echo "  访问地址: http://$SERVER_IP"
echo ""
echo "  常用命令:"
echo "    查看后端日志: tail -f /var/log/tao-backend.log"
echo "    重启后端:     systemctl restart tao-backend"
echo "    重启 Nginx:   systemctl restart nginx"
echo ""
echo "  如果无法访问，请检查云服务器安全组是否开放 80 端口"
echo ""
echo "=============================================="