package com.sunline.sunline_backend.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class UploadPathConfig {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path resolvedPath;

    @PostConstruct
    public void init() throws IOException {
        Path current = Paths.get("").toAbsolutePath();

        // Running from project root (e.g. IntelliJ default working directory)
        if (Files.exists(current.resolve("backend/pom.xml"))) {
            resolvedPath = current.resolve("backend").resolve(uploadDir).normalize();
        } else {
            // Running from backend/ directory (e.g. mvn spring-boot:run)
            resolvedPath = current.resolve(uploadDir).normalize();
        }

        Files.createDirectories(resolvedPath);
        log.info("Upload directory: {}", resolvedPath);
    }

    public Path getResolvedPath() {
        return resolvedPath;
    }
}
