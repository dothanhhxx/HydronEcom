/**
 * Tạo sẵn cấu trúc trên Appwrite Cloud (chạy 1 lần, chạy lại vẫn an toàn):
 *   - Database `hydron` với 2 bảng `documents` (data) và `records` (stream, data) + index theo stream
 *   - Bucket ảnh `products` cho mọi người xem (chỉ backend tải lên được)
 *
 *   npm run setup:appwrite --workspace backend
 *
 * Cần APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY trong backend/.env.
 * API key cần quyền: databases.read/write, tables.read/write, columns.read/write, indexes.read/write,
 * rows.read/write, buckets.read/write, files.read/write.
 */
import { AppwriteException, Permission, Role, TablesDBIndexType } from "node-appwrite";
import { ENV } from "../config/env.js";
import { appwriteEnabled, AW_TABLES, getAppwrite } from "../infrastructure/appwrite/client.js";

/** Bỏ qua lỗi "đã tồn tại" (409) để chạy lại nhiều lần được. */
async function ensure(label: string, create: () => Promise<unknown>) {
  try {
    await create();
    console.log(`  + ${label}`);
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 409) console.log(`  = ${label} (đã có)`);
    else throw new Error(`${label}: ${(err as Error).message}`);
  }
}

/** Cột tạo xong ở trạng thái "processing"; phải đợi "available" mới tạo index được. */
async function waitColumn(tableId: string, key: string) {
  const { db } = getAppwrite();
  for (let i = 0; i < 60; i++) {
    const col = await db.getColumn({ databaseId: ENV.APPWRITE_DATABASE_ID, tableId, key });
    if (col.status === "available") return;
    if (col.status === "failed") throw new Error(`Cột ${tableId}.${key} tạo thất bại: ${(col as { error?: string }).error ?? ""}`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Cột ${tableId}.${key} chưa sẵn sàng sau 60 giây`);
}

async function main() {
  if (!appwriteEnabled) {
    console.error("✖ Thiếu APPWRITE_PROJECT_ID hoặc APPWRITE_API_KEY trong backend/.env");
    process.exitCode = 1;
    return;
  }
  const { db, storage } = getAppwrite();
  const databaseId = ENV.APPWRITE_DATABASE_ID;
  console.log(`Appwrite: ${ENV.APPWRITE_ENDPOINT} · project ${ENV.APPWRITE_PROJECT_ID}`);

  await ensure(`database ${databaseId}`, () => db.create({ databaseId, name: "Hydron" }));

  // Không cấp quyền cho ai (permissions rỗng): chỉ API key của backend đọc ghi được.
  await ensure(`bảng ${AW_TABLES.documents}`, () =>
    db.createTable({ databaseId, tableId: AW_TABLES.documents, name: "Documents", permissions: [], rowSecurity: false }),
  );
  await ensure(`cột ${AW_TABLES.documents}.data`, () =>
    db.createLongtextColumn({ databaseId, tableId: AW_TABLES.documents, key: "data", required: true }),
  );

  await ensure(`bảng ${AW_TABLES.records}`, () =>
    db.createTable({ databaseId, tableId: AW_TABLES.records, name: "Records", permissions: [], rowSecurity: false }),
  );
  await ensure(`cột ${AW_TABLES.records}.stream`, () =>
    db.createVarcharColumn({ databaseId, tableId: AW_TABLES.records, key: "stream", size: 64, required: true }),
  );
  await ensure(`cột ${AW_TABLES.records}.data`, () =>
    db.createLongtextColumn({ databaseId, tableId: AW_TABLES.records, key: "data", required: true }),
  );
  await waitColumn(AW_TABLES.records, "stream");
  await waitColumn(AW_TABLES.records, "data");
  await waitColumn(AW_TABLES.documents, "data");
  await ensure(`index ${AW_TABLES.records}.stream`, () =>
    db.createIndex({ databaseId, tableId: AW_TABLES.records, key: "stream_idx", type: TablesDBIndexType.Key, columns: ["stream"] }),
  );

  await ensure(`bucket ${ENV.APPWRITE_BUCKET_ID}`, () =>
    storage.createBucket({
      bucketId: ENV.APPWRITE_BUCKET_ID,
      name: "Ảnh sản phẩm",
      permissions: [Permission.read(Role.any())],
      fileSecurity: false,
      maximumFileSize: 10 * 1024 * 1024,
      allowedFileExtensions: ["jpg", "jpeg", "png", "webp", "gif", "avif"],
    }),
  );

  console.log("✔ Xong. Chuyển dữ liệu cũ lên: npm run migrate:appwrite --workspace backend");
}

main().catch((err) => {
  console.error("✖", err.message);
  process.exitCode = 1;
});
