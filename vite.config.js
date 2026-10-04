import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { v2 as cloudinary } from "cloudinary";

// Vite configuration with Cloudinary dev middleware
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const cloudName = (
    env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "dtdpkfkw2"
  ).trim();

  const apiKey = (
    env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY ||
    "181285968731254"
  ).trim();

  const apiSecret = (
    env.CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_API_SECRET ||
    "TJTUTGw2KkiFiwpGdC9duIOxIBs"
  ).trim();

  const setupDeleteApi = (middlewares) => {
    middlewares.use(async (req, res, next) => {
      const cleanUrl = (req.url || "").split("?")[0].replace(/\/+$/, "");
      if (cleanUrl === "/api/delete-image" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const parsed = JSON.parse(body || "{}");
            let publicId = parsed.publicId;

            if (!publicId) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  message: "publicId is required",
                })
              );
              return;
            }

            publicId = String(publicId).trim().replace(/\.[^/.]+$/, "");

            cloudinary.config({
              cloud_name: cloudName,
              api_key: apiKey,
              api_secret: apiSecret,
            });

            const result = await cloudinary.uploader.destroy(publicId, {
              resource_type: "image",
              invalidate: true,
            });

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, result }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                success: false,
                message:
                  error?.message || "Failed to delete Cloudinary image",
                error,
              })
            );
          }
        });
        return;
      }
      next();
    });
  };

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "cloudinary-delete-api",
        configureServer(server) {
          setupDeleteApi(server.middlewares);
        },
        configurePreviewServer(server) {
          setupDeleteApi(server.middlewares);
        },
      },
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});