# Sử dụng Tomcat 10.1.30 kèm JDK 17
FROM tomcat:10.1.30-jdk17-temurin

# Xoá các webapp mặc định để tránh xung đột
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy WAR của bạn vào thư mục webapps và đổi tên thành ROOT.war để app chạy ở "/"
COPY target/PureFoods-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

# Mở cổng 8080 (Render sẽ dùng cổng này)
EXPOSE 8080

# Lệnh khởi động Tomcat
CMD ["catalina.sh", "run"]
