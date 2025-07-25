# Use official Tomcat image as base
FROM tomcat:9.0-jdk17-temurin-jammy

# Remove default webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy WAR file to webapps
COPY target/PureFoods-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/PureFoods.war

# Expose default Tomcat port
EXPOSE 8082
