package javaApp; // Matches your exact case-sensitive folder: javaApp

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

public class App {

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8040), 0);
        
        // Router Contexts
        server.createContext("/api/search", new SearchApiHandler());
        server.createContext("/api/documents", new DocumentListApiHandler());
        server.createContext("/", new StaticFileHandler());
        
        server.setExecutor(null); // default executor
        System.out.println("SOP Engine running locally on http://localhost:8040");
        server.start();
    }

    // --- 1. Static Web Resource Router ---
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) {
                path = "/index.html";
            }

            File file = new File("templates" + path);
            if (!file.exists() || file.isDirectory()) {
                String error404 = "404 Resource Not Found";
                exchange.sendResponseHeaders(404, error404.length());
                OutputStream os = exchange.getResponseBody();
                os.write(error404.getBytes());
                os.close();
                return;
            }

            String contentType = "text/plain";
            if (path.endsWith(".html")) contentType = "text/html";
            else if (path.endsWith(".css")) contentType = "text/css";
            else if (path.endsWith(".js")) contentType = "text/javascript";

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, file.length());
            
            try (OutputStream os = exchange.getResponseBody()) {
                Files.copy(file.toPath(), os);
            }
        }
    }

    // --- 2. Document Inventory Discovery Endpoint ---
    static class DocumentListApiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<String> fileNames = new ArrayList<>();
            File dataFolder = new File("data");

            if (dataFolder.exists() && dataFolder.isDirectory()) {
                File[] files = dataFolder.listFiles((dir, name) -> name.toLowerCase().endsWith(".docx"));
                if (files != null) {
                    for (File f : files) {
                        fileNames.add("\"" + f.getName().replace("\"", "\\\"") + "\"");
                    }
                }
            }

            String jsonResponse = "[" + String.join(",", fileNames) + "]";
            byte[] responseBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }
    }

    // --- 3. Descriptive Content Search Engine Endpoint ---
    static class SearchApiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String queryParams = exchange.getRequestURI().getQuery();
            String searchTerm = "";
            
            if (queryParams != null && queryParams.startsWith("q=")) {
                searchTerm = URLDecoder.decode(queryParams.substring(2), StandardCharsets.UTF_8.toString()).toLowerCase();
            }

            List<String> jsonResults = new ArrayList<>();
            File dataFolder = new File("data");

            if (dataFolder.exists() && dataFolder.isDirectory() && !searchTerm.isEmpty()) {
                File[] files = dataFolder.listFiles((dir, name) -> name.toLowerCase().endsWith(".docx"));
                if (files != null) {
                    for (File f : files) {
                        try {
                            String docText = extractTextFromDocx(f.toPath());
                            if (docText.toLowerCase().contains(searchTerm)) {
                                int matchIdx = docText.toLowerCase().indexOf(searchTerm);
                                int start = Math.max(0, matchIdx - 60);
                                int end = Math.min(docText.length(), matchIdx + searchTerm.length() + 100);
                                String snippet = docText.substring(start, end);

                                String safeSnippet = escapeJsonString(snippet);

                                jsonResults.add(String.format("{\"document\":\"%s\",\"snippet\":\"%s\"}", f.getName(), safeSnippet));
                            }
                        } catch (Exception e) {
                            System.err.println("Could not parse file: " + f.getName() + " due to " + e.getMessage());
                        }
                    }
                }
            }

            String jsonResponse = "[" + String.join(",", jsonResults) + "]";
            byte[] responseBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }

        private String escapeJsonString(String input) {
            if (input == null) return "";
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < input.length(); i++) {
                char ch = input.charAt(i);
                switch (ch) {
                    case '"':  sb.append("\\\""); break;
                    case '\\': sb.append("\\\\"); break;
                    case '\b': sb.append("\\b"); break;
                    case '\f': sb.append("\\f"); break;
                    case '\n': sb.append(" ");    break; 
                    case '\r': sb.append(" ");    break;
                    case '\t': sb.append("\\t"); break;
                    default:
                        if (ch < ' ') {
                            String ss = Integer.toHexString(ch);
                            sb.append("\\u").append("0".repeat(4 - ss.length())).append(ss);
                        } else {
                            sb.append(ch);
                        }
                }
            }
            return sb.toString();
        }

        private String extractTextFromDocx(Path docxPath) throws IOException {
            URI uri = URI.create("jar:" + docxPath.toUri());
            try (FileSystem fs = FileSystems.newFileSystem(uri, java.util.Collections.emptyMap())) {
                Path xmlPath = fs.getPath("/word/document.xml");
                if (Files.exists(xmlPath)) {
                    String rawXml = new String(Files.readAllBytes(xmlPath), StandardCharsets.UTF_8);
                    return stripXmlTags(rawXml);
                }
            } catch (Exception ex) {
                // Ignore gracefully
            }
            return "";
        }

        private String stripXmlTags(String xml) {
            StringBuilder sb = new StringBuilder();
            boolean inTag = false;
            for (int i = 0; i < xml.length(); i++) {
                char c = xml.charAt(i);
                if (c == '<') {
                    inTag = true;
                } else if (c == '>') {
                    inTag = false;
                } else if (!inTag) {
                    sb.append(c);
                }
            }
            return sb.toString();
        }
    }
}
