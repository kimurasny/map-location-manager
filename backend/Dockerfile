# ---- ビルドステージ ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# 依存解決を先に行いレイヤキャッシュを効かせる
COPY gradlew ./
COPY gradle ./gradle
COPY settings.gradle build.gradle ./
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies || true

# ソースをコピーして bootJar を生成
COPY src ./src
RUN ./gradlew --no-daemon clean bootJar

# ---- 実行ステージ ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# 非 root ユーザで実行する
RUN useradd --system --create-home appuser
COPY --from=build /app/build/libs/*.jar app.jar
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
