const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const s3 = require("../config/s3");
const path = require("path");
const fs = require("fs");
//This method is handle only small file upload
exports.uploadToS3 = async (file, folder = "products") => {
  try {
    const fileName = Date.now() + path.extname(file.originalname);
    console.log(file.buffer, "file buffer");
    console.log(file.mimetype, "file mimetype");
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    /*
    body - <Buffer ff db ff e0...></Buffer>
    contentType -  image.jpg - image/jpeg, image.png - image/png
    */

    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.log("Error uploading to S3:", error);
    throw error;
  }
};

exports.uploadLargeToS3 = async (file, folder = "products") => {
  // Implementation for large file upload
  try {
    // ✅ validation
    if (!file || !file.path) {
      console.log("Invalid file:", file);
      throw new Error("Invalid file");
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const fileStream = fs.createReadStream(file.path);
    fileStream.on("data", (chunk) => {
      console.log("chunk received", chunk.length, chunk);
    });

    fileStream.on("end", () => {
      console.log("chunk end");
    });
    /*
files are read in chunks 

eg: 

Starting large file upload...
chunk received 65536 <Buffer 00 00 00 20 66 74 79 70 6d 70 34 32 00 00 00 00 6d 70 34 32 6d 70 34 31 69 73 6f 6d 61 76 63 31 00 00 4a 55 6d 6f 6f 76 00 00 00 6c 6d 76 68 64 00 00 ... 65486 more bytes>
chunk received 65536 <Buffer 32 ec 33 a8 5a 3a 73 03 6c 24 a2 f4 e3 38 f8 6d 1c fe 79 08 7e 8c 0e f5 72 18 71 99 d0 cd 37 e2 ea c9 8a e1 09 bb 1d e3 8d db 8b 38 3d 93 65 7f 23 fc ... 65486 more bytes>
chunk received 65536 <Buffer f8 69 1a f2 1c 75 25 d0 2f 47 2a 72 c0 28 2a bf 6c dd 1e ae 2d 10 77 76 a6 9a 9c f3 8c c1 cf 21 df 54 f0 03 2e b4 84 b3 b9 74 73 70 2e 14 85 94 8b fc ... 65486 more bytes>
chunk received 65536 <Buffer 57 1d 1e cc 75 9c f3 a1 11 92 cd 36 ab 40 c7 c5 f8 70 32 c0 be 78 5a 14 c9 4e 30 3a ec 47 00 d2 6d 09 67 32 f7 39 f8 3f de 35 0a e8 0e 52 04 b7 74 09 ... 65486 more bytes>
chunk received 65536 <Buffer 1f 92 7b 4c 60 df 1f 54 01 56 4a 67 ce 5c 27 9d c8 ca 49 1d 57 89 30 f8 d9 f0 20 09 65 2e af d2 cc 89 4d a8 96 da ef 19 55 5c 84 2c 23 85 26 f9 22 9f ... 65486 more bytes>
chunk received 65536 <Buffer 37 fb 54 5f 7f ea ce 9c 94 af 9c 56 c1 a4 70 84 57 b5 cd e0 97 f6 03 3c eb c4 96 82 93 b9 6c fc f0 96 c8 2b aa 71 9c 6d 7c 36 db 7e 5e 4e 2e 96 41 61 ... 65486 more bytes>
chunk received 65536 <Buffer ea 94 14 67 a7 0d 98 21 09 15 c7 8d d2 17 a7 83 76 f2 9a c6 28 5a 6a f2 0d 54 93 e1 f1 77 a9 bb b4 ba 98 fb 6d a1 51 1d c0 03 39 99 87 5a 28 5f 8f f5 ... 65486 more bytes>
chunk received 65536 <Buffer 4e 11 b4 ed 89 6b ac d6 fa 53 69 51 92 e1 a7 55 82 94 18 99 77 69 48 e2 c5 ef 3d 82 43 30 fb 34 d5 d6 ec 8b b1 f4 42 ce 1c d4 65 c8 3e 8f e8 42 c5 dd ... 65486 more bytes>
chunk received 65536 <Buffer cb 04 11 9a 3d 4e c2 77 18 71 e7 6a f7 67 f3 33 bc e0 c3 a7 b3 93 24 8b 06 e7 54 b7 d0 ef cb ef d0 2a 3f 7a 29 94 5f 8e 0a 9c 00 3c e3 2f b2 25 68 14 ... 65486 more bytes>
chunk received 65536 <Buffer cb 88 6c 76 d5 9d ad f2 37 eb 4f 7c c6 34 2d 91 ac 27 f4 48 1f ce 4f f8 de 9c 2f 12 57 32 e4 54 1c 5e cd 2d 85 62 09 ce a1 85 d6 10 3b 1f 90 22 06 33 ... 65486 more bytes>
chunk received 65536 <Buffer c8 2d 05 e1 ce 52 ba 4b a9 fa 75 a4 20 27 0a 8f cc 52 8e 34 24 12 8a 29 23 e0 3d b6 99 da 7d 61 87 9d 1b 09 a5 8b 65 1c aa 25 07 cd 97 52 e3 f9 d4 cf ... 65486 more bytes>
chunk received 65536 <Buffer 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 ... 65486 more bytes>
chunk received 65536 <Buffer 2a 2a c6 28 0f cc 59 6a c3 5b d8 0e 2e bd 4f fa f3 79 78 bb 27 c1 42 0e a6 97 15 1b 16 4e 7c 12 ed 17 cb b5 0b 15 d2 cf 45 03 8d 4b ec 67 ed d3 d2 86 ... 65486 more bytes>
chunk received 65536 <Buffer ca 5c cf dc a2 01 36 98 cf 1a ea 74 10 c5 1a 5f 87 1f 78 06 a1 c1 af 8d 1e 85 6b b2 1d 9c 40 70 f0 74 7c fc 0d 38 43 cf 12 3e fe 16 c3 66 1c 0a a1 dd ... 65486 more bytes>
chunk received 65536 <Buffer d9 59 29 6f bf d8 74 0b aa 88 43 66 67 b5 4c d3 c1 af 3d 99 12 1b b4 85 d1 ab 5d 3f 4f f2 5c 21 6c 20 4a de 35 5b 63 8a 0d d8 40 3e 0a fa ec 26 54 67 ... 65486 more bytes>
chunk received 65536 <Buffer 8c 1d 23 9d bb 07 9e c6 49 64 0e 38 21 d8 75 e7 4b 79 0c 15 6e 08 a3 c4 20 7d 4f 32 41 a0 16 a8 e5 95 5b 4b 75 ad 57 56 7e 6b ba ea 3e d3 f8 c9 4e 90 ... 65486 more bytes>
chunk received 65536 <Buffer a7 e0 cc b6 f9 4e 8d 35 3f b7 8d 76 24 02 33 85 32 b6 1b 3a fd f8 36 dc 7e 83 32 ac 6d e4 15 44 bd 9d 69 34 cf 96 90 2f 8e 04 87 13 8d 10 58 bf 57 b6 ... 65486 more bytes>
chunk received 65536 <Buffer 61 5f 77 36 bf da b6 9b 54 79 95 37 d6 2c 2d ed 43 2c 32 bb 8f e9 3c 92 17 22 03 c8 03 e6 4e 77 6b 88 60 53 13 35 d1 0f ec ff a2 9d 10 9a 09 75 45 86 ... 65486 more bytes>
chunk received 65536 <Buffer ee 48 34 c0 31 6d fe 2c fb b0 ac f2 ba 81 c0 ba bc 8d d3 e6 2f ce 65 4c 4d 4c 4c 55 ff c9 d3 04 fd 98 b5 03 cf 0e 97 3c 26 7a ac cb 40 fd 98 62 c4 38 ... 65486 more bytes>
chunk received 65536 <Buffer 32 fd 7e e0 a9 81 34 51 4c 5f 40 bd 7a 16 3c cf 13 c8 b4 bf 39 8c a0 cf 86 09 9c 21 a8 b7 22 46 89 00 12 79 dc e1 de 47 0d 23 cb 1e 3e 75 bb 54 0a 5d ... 65486 more bytes>
chunk received 65536 <Buffer 45 59 25 db 2c 15 9a 7f 83 72 6b 93 aa 70 40 15 74 21 ae 94 a2 3e ad 1b 16 86 25 84 44 aa 66 88 81 cd c3 42 16 34 dc 43 a8 81 2c 3a 68 e6 5d 5d c5 c9 ... 65486 more bytes>
chunk received 65536 <Buffer d9 b1 8e 09 fd b5 c1 27 06 e5 9e 91 f5 8d 34 83 36 77 ee 25 c0 46 4c 29 a0 ee f8 4c 9e 7a c8 c4 df 79 ff 4b 56 ac 02 26 ed 6e 62 b7 73 6c e7 9a 85 ff ... 65486 more bytes>
chunk received 65536 <Buffer 9d 3a 3a 0f 52 47 11 87 67 94 e5 d2 63 08 57 8b c1 17 53 5e 25 0c 43 78 69 36 20 8f 1c 26 e7 41 d2 a2 18 23 eb f1 2d 31 ec 52 6d 95 dd 26 96 cb 47 99 ... 65486 more bytes>
chunk received 65536 <Buffer 47 01 9a fd 5a 9d 2c 8f eb a8 5b d6 f5 1a de 9b 6c 37 38 87 41 a3 4b f8 ee 1e 23 05 b8 19 ec fb 94 1d 5f a4 0a e7 4d 0f 46 56 1f 3d a1 60 30 4d 12 55 ... 65486 more bytes>
chunk received 65536 <Buffer 5d 67 18 d2 b8 43 4f 8f 93 27 5d 63 b4 e4 8d 61 18 0d 76 76 9d bc 42 10 dd 44 95 8c ca 7c bd 72 a0 af 96 04 5b 1e 3b cd f3 db f6 18 cc 46 45 c3 05 58 ... 65486 more bytes>
chunk received 65536 <Buffer 2b c6 f3 88 f7 b6 90 e9 77 c3 2e 0b 29 31 6e d8 bc 26 30 b7 5e df 1c ef b3 0c be 3b c3 56 71 ef ef 8e 40 ec 3a f0 99 e4 b0 51 74 3d 58 ea 29 fb 0b 2f ... 65486 more bytes>
chunk received 65536 <Buffer 49 21 57 98 16 09 4a ac 92 ae df 30 55 36 6e e5 67 14 56 dc ad 18 4f e1 49 ea 06 57 f2 48 5b 7c 04 20 70 82 23 87 48 20 82 42 12 3c 23 5a 37 1e b5 e7 ... 65486 more bytes>
chunk received 65536 <Buffer dd ef a9 47 75 d1 fa 56 98 a9 ec 26 1b 14 f1 3e 0c dc 50 de b9 b1 94 4e 02 2c b2 da 82 8e 3b 82 c4 80 c4 e4 c2 bd ea 9e 05 cb 9d 0a 2e dd 61 fd 95 72 ... 65486 more bytes>
chunk received 65536 <Buffer d1 dd 8b 6b 4c 40 c6 09 0a 87 af 37 32 d0 95 eb 4c 33 b4 dd f1 14 f9 ef a7 11 9b 43 80 fe 46 a5 ea 9c 66 2e 2d 61 e9 ca 7b e3 32 e2 72 99 c4 1e e6 ae ... 65486 more bytes>
chunk received 65536 <Buffer 59 54 71 19 a1 1c 7d ce 12 e8 e5 01 cb 2d 01 38 ba d8 f8 16 a3 8e 98 0b 7f cb 39 79 ae 12 55 d6 9c e8 55 1c d3 e0 70 70 a3 06 38 86 3b 97 b9 f7 46 56 ... 65486 more bytes>
chunk received 65536 <Buffer 5a 90 17 3e 67 15 b4 c0 bf ea ce d7 64 32 3d cc 59 c5 63 46 1f 98 f3 c5 a7 09 85 da 06 91 3b 53 a7 9e d7 77 3c 65 bf 47 b0 47 fb 93 58 ca 51 86 c5 b1 ... 65486 more bytes>
chunk received 65536 <Buffer f2 62 a7 9d 9e 91 0d 9f c7 05 c5 24 77 1f cb 10 3d 67 b0 c7 29 4a 38 fb d4 b2 60 e8 25 b3 7b 9b a2 0f c8 95 35 a7 61 48 06 6b 90 44 54 09 08 b7 ab bc ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer 0f 5a fe 6a 79 95 01 0a b2 21 f1 18 86 09 9a 73 05 d1 ff 17 a6 bc bf fd 67 89 50 d9 6d c5 47 fc 9d 45 66 21 95 b2 f9 22 b3 73 e3 a8 ad 3f 87 ee 13 4b ... 65486 more bytes>
chunk received 65536 <Buffer 06 07 e9 eb db fe e4 67 08 82 26 9d 63 e1 4a 0f 12 42 10 fd 9e 9a 89 2e 4d be 72 e7 d5 fa 1d 50 92 75 82 11 62 ab 4d 0f 2f 8d 52 73 a9 14 f5 f6 4e d2 ... 65486 more bytes>
chunk received 65536 <Buffer c4 31 4b ed a1 af 4c fc a9 30 1e d8 ab 4f 5f 3f a7 f9 0c d4 f8 3c da e0 29 1b 29 a8 a7 17 5b 62 8c 9a 85 43 22 74 0f 69 33 f5 ef f9 23 09 91 8e 6c 35 ... 65486 more bytes>
chunk received 65536 <Buffer 69 c7 db 7c c0 7d 70 ab 15 4f 4f 1e fb dd 4e 33 b0 64 12 b1 a6 da 1c c8 04 d2 de 43 f9 95 c3 bc 19 db 0a 6d cc 7f dd b8 a5 74 e2 5d 74 51 26 81 29 bc ... 65486 more bytes>
chunk received 65536 <Buffer 4c 72 b6 b4 c0 26 55 ff c8 c3 70 69 61 fd e9 cc 4d 6e d1 15 0c 59 a9 bc ff 4a 7c be 6c 3d 2e eb 1e 0e d6 e7 e7 16 03 2e 21 1b 61 54 b7 f9 82 06 49 f2 ... 65486 more bytes>
chunk received 65536 <Buffer de 44 b5 2f e7 6c 1f fd ff 34 a5 f0 c0 81 3f 1f 99 1f 67 fe 11 b7 cf 60 d4 df 00 df 74 5a dc 3b 84 5b 96 77 29 ae 5c 11 57 2a 70 14 67 51 70 d6 8f dd ... 65486 more bytes>
chunk received 65536 <Buffer d6 83 66 da 17 c0 31 8d 86 5e 9f 33 fc 80 d0 47 97 84 fb 24 b7 01 43 18 48 ee 78 bd 1c da 72 da 5c 6b d3 65 91 87 7c 6e 59 33 f0 6e d1 9b 31 dc e6 0a ... 65486 more bytes>
chunk received 65536 <Buffer 93 99 1b b1 23 45 06 12 db c5 f5 f4 1f 12 4b ed a6 da 0e 10 74 48 26 26 a7 96 66 64 00 e1 2d 0f f3 55 d0 3e 86 ec e9 32 24 0f 02 21 fd 34 e5 ad 23 dd ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer a6 4e 9c 9e ee 59 96 bc 0d 3d a4 b4 4d 3f 79 50 ab 52 04 7a 3f c3 9c e4 e7 64 96 79 2c 1d 65 b5 03 e7 52 cb 5a 43 af 2b 90 92 73 8f d5 27 39 52 8e bf ... 65486 more bytes>
chunk received 65536 <Buffer 41 63 20 6a 08 8d 84 eb 7c ad 87 c4 21 66 91 e1 60 87 89 9f bd b9 ce 68 7f b2 c9 18 50 af c6 81 c0 16 99 86 38 a1 c0 93 89 0c d2 a0 31 c0 be b6 57 c6 ... 65486 more bytes>
chunk received 65536 <Buffer 04 ae 3b 88 6b 10 f5 11 91 e0 8c 1a be be ae 02 40 45 af 51 37 bc b1 18 9d e8 57 f0 86 56 aa f4 53 b5 c1 14 79 e0 9f b7 d3 40 62 94 b5 90 22 92 ae d0 ... 65486 more bytes>
chunk received 65536 <Buffer 4e d7 f0 7b c6 87 37 d7 5b dd bc 4c 6e 57 54 dd cd a6 a0 84 7e 76 83 1d 29 ab 8f 98 18 40 d7 72 c2 42 20 04 92 96 16 ae bc 6b a5 a9 d8 3e bc 41 42 93 ... 65486 more bytes>
chunk received 65536 <Buffer 43 3e ca 25 01 a9 2b bc 36 a1 e1 22 b3 29 02 80 c7 90 b4 06 8d 98 80 54 47 6d f2 b9 9d 92 5f 18 ff d6 eb e6 86 94 29 d2 d7 eb cc 54 e0 ab e9 ab b8 73 ... 65486 more bytes>
chunk received 65536 <Buffer 94 18 20 c3 64 ac 5d 5b a0 9f e1 19 25 35 17 84 41 85 43 3a f4 ee 6c c5 83 bd d0 c8 97 a6 b2 f0 9a 29 cf b4 6e ed 50 62 94 1e 5e 93 a9 75 07 d6 8c a0 ... 65486 more bytes>
chunk received 65536 <Buffer 90 f8 3f d5 4b 85 63 a4 33 94 48 57 50 e9 5f 88 d1 2d 1b 32 cb 20 7b 38 10 cd d0 95 fd 59 77 96 63 39 04 7c 7f c0 8f 33 94 43 11 c6 a0 36 22 c9 3a ae ... 65486 more bytes>
chunk received 65536 <Buffer 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a ... 65486 more bytes>
chunk received 65536 <Buffer da 06 0e 30 76 66 97 9d ff 6d 7a fc a5 41 c6 80 f0 f6 e2 79 20 39 43 84 ff 1d 39 ee b2 51 2e f2 82 69 b5 70 65 1d 5f 9b de 3d a1 0b 72 65 0a 6d bf 66 ... 65486 more bytes>
chunk received 65536 <Buffer df 37 e9 9a fa 04 49 77 9e 22 07 fb a6 e5 65 2c 5f 70 c6 22 a6 d8 a1 79 68 27 61 e3 31 28 e2 9e 23 71 73 d9 92 c2 60 29 b4 a6 36 ff 88 3d b2 f8 ed 9e ... 65486 more bytes>
chunk received 65536 <Buffer 5b a5 e5 6b cc 43 5c fe 1f 2f 9c 73 5f 24 9f 40 46 e0 9c fa 6e 57 62 cf cb 25 71 d4 7e f7 33 03 91 46 ea 0a e9 85 ab 0d 5b 9f 8d c6 9c 1b fd f8 74 43 ... 65486 more bytes>
chunk received 65536 <Buffer 78 92 d8 48 ba c0 a2 fc db fa fb 8d 94 e5 d1 4e 3b 8a e4 2d b3 82 00 9e b8 ba 50 d8 e2 fa f3 39 e6 bd f0 13 d7 7e 6c 55 e7 b9 24 92 f4 d3 a8 06 9f 28 ... 65486 more bytes>
chunk received 65536 <Buffer 86 25 3c 29 4e 17 7f 75 10 39 14 af 22 2e 88 f9 cb 2d 49 31 ae 62 07 ff 4a cd 5e 9f 56 4a cf 10 bc 44 c4 4d 42 a1 64 f5 bd a2 af 3f e0 17 61 5e 33 b0 ... 65486 more bytes>
chunk received 65536 <Buffer 44 fd 19 00 ae 6b 80 94 c4 07 93 06 44 a6 af 55 c4 9d 65 38 ff 37 a6 8f c1 54 61 01 ba b6 ad bb 91 61 9f 6e e3 bb 0c 43 dd 2a ad 2e 24 28 bf 8a 2e 9d ... 65486 more bytes>
chunk received 65536 <Buffer 99 f0 26 41 a4 3c 44 1c 53 85 18 bc 74 da cc a8 09 7f f3 33 75 ad f9 93 b7 4f b9 56 fb 57 ca 62 09 1f e4 7b 31 3c e3 bc 0c 57 bf d7 1c c1 df f7 c7 86 ... 65486 more bytes>
chunk received 65536 <Buffer b0 8d d9 6d 4f 73 03 9a 0e 32 67 ff 73 54 3b a8 59 c7 51 56 a0 e1 ea ce 61 c0 98 a1 1b 93 8c ee f8 1d 5a 4f e6 69 d8 68 5a a5 23 12 23 2a 6b 51 b9 ef ... 65486 more bytes>
chunk received 65536 <Buffer c5 7b 96 cb fe bf 0f 3a 9a 0d b2 15 f0 b0 cd b5 1d 6b 21 10 3b 9b ea 2f f1 d3 48 b6 5b 09 5f 62 8b 3f ab e8 58 97 69 6e 40 7a 87 8a 8b df b9 e2 23 0a ... 65486 more bytes>
chunk received 65536 <Buffer de 8f 15 1d 26 0c f3 40 de 9f 98 7e 7b a9 83 a1 cb 83 6b 6f 9c 24 62 f7 b8 72 b8 c0 12 f8 19 11 99 3b 7c a6 02 c2 1d 2a fb 6f af 6c 9c 3b 76 1f ab e2 ... 65486 more bytes>
chunk received 65536 <Buffer ff 2c c1 3e 6b 92 a8 c4 e7 3f 36 21 11 e3 00 42 a6 53 f8 09 7a 1f 14 8f ed 2c ba 7c 9f 19 0f 45 bc 8d f3 26 85 f7 77 68 a8 18 85 26 2c 58 4f 11 c1 a2 ... 65486 more bytes>
chunk received 65536 <Buffer 73 ac 9a 79 a8 e5 d1 dc cd 74 46 1e d0 d9 70 49 dd 31 a6 23 e8 89 e8 e2 ac 1b 1d ca 79 b3 a8 5c 1e 69 f6 5b 94 9e d2 fd 96 26 45 48 39 f8 2c bf b8 8f ... 65486 more bytes>
chunk received 65536 <Buffer c5 2c 96 ac 98 4e 29 b9 09 f0 66 02 ed ff b8 86 e0 ff ad 73 58 ac a1 4b a2 21 e6 65 b4 cd 08 fc d0 ab 3c e4 5f eb 4b 63 72 b4 b8 0a 16 e7 44 2f 68 29 ... 65486 more bytes>
chunk received 65536 <Buffer 36 f3 1c db e1 05 49 15 24 dc 00 88 1f b8 dd 25 9e 6f 7b d8 6c 0b 7b 10 89 e0 8a d3 ed eb 32 36 72 e0 43 53 a2 a0 14 e4 69 9e 99 3c 53 03 96 c6 7b 5b ... 65486 more bytes>
chunk received 65536 <Buffer 58 17 9a cf 0d aa 32 21 90 e1 cc 59 fb c4 b7 e2 af 88 9c 98 48 c0 5f 48 7b 8f 7b b1 df 78 1f 46 78 8d f6 8e ce 04 72 5a eb 67 7f 2d 5c 09 f8 d1 8f 53 ... 65486 more bytes>
chunk received 65536 <Buffer c2 b8 20 da 91 7b 92 91 e8 18 d8 84 83 f2 96 87 21 26 df d7 ae fa 10 57 fd e9 b1 ea 32 78 03 14 be b5 b9 1c c7 93 71 40 31 3e cd 5d c7 85 8f 31 64 66 ... 65486 more bytes>
chunk received 65536 <Buffer 51 3a 0f 70 b1 a6 51 09 9f 9d 99 c2 f1 c8 bf 6f 8d c6 17 4f ff 6e 92 3a 59 72 5f a4 55 85 0c 60 e3 56 b6 49 79 e6 12 60 52 44 e6 f6 7e 3d 11 b1 04 63 ... 65486 more bytes>
chunk received 65536 <Buffer a7 83 70 39 f7 9f 09 35 6c 0f be c0 b0 c8 f3 37 f1 d0 31 53 5c b6 85 25 f4 a0 a9 e7 aa 0e 6b 2a b4 45 13 97 d1 57 7b b3 f8 af 7a dd 54 ef b0 0c ef 25 ... 65486 more bytes>
chunk received 65536 <Buffer e0 9d 91 46 80 89 8c fd 60 24 80 00 45 0d 0c 07 c5 57 c2 4b 8f be c2 d2 a7 93 65 fc 69 51 0b f5 1b 5e c8 5d 10 e5 23 94 41 a0 eb 5d 46 e6 5c c0 f0 6b ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer 86 2d 0e 25 39 e1 76 38 76 63 3f 2a b7 d7 2c db 8b b0 f0 52 86 6e 86 cc 6a 5d c5 b4 f6 38 6f 0c ca e9 44 63 88 55 6b 00 fd 95 60 25 5b c3 43 d3 a4 16 ... 65486 more bytes>
chunk received 65536 <Buffer 59 35 6e 12 4e e9 28 80 df d3 a4 21 7a 20 bd 1c a0 e2 be 95 ae c8 2f 2f 80 3d 3a 8f f2 80 5a b0 9f d0 61 c6 5c d9 37 51 85 ed 29 fa 97 6f 90 4b be 05 ... 65486 more bytes>
chunk received 65536 <Buffer b5 8f 43 f4 68 ee a8 5a ce 6e 52 f6 76 58 d4 08 56 87 45 56 3f 6b df 8b c6 27 70 ff 45 93 b7 f8 10 44 14 4b df cc 63 d0 0e a9 e6 78 d0 87 13 94 dc cb ... 65486 more bytes>
chunk received 65536 <Buffer b9 10 e7 92 3e 46 06 cb 72 ba 74 20 07 b4 21 95 2c 14 94 b7 c9 4f 56 71 ca 4a a3 01 bf f0 6a 24 02 99 1e 7b 44 5f 3b 72 a7 18 f2 bd 66 d8 d3 a1 fa e4 ... 65486 more bytes>
chunk received 65536 <Buffer bc 9d 0c 1e c1 53 a7 b3 8e ef e3 40 21 5b 2a 1e 16 b2 e1 9e b9 d8 b3 7b 2c 60 e1 0d 24 c0 99 32 39 2d fb d9 36 a2 03 d4 42 8d 67 09 94 d3 f7 9c 32 b2 ... 65486 more bytes>
chunk received 65536 <Buffer a8 7f ca 9e ed cc 54 17 79 0e db e4 3f 5d bd 41 4e 26 0b 06 58 c9 96 7a 70 15 21 51 76 34 8a b6 83 3f af f4 6d fe 2c 78 bf 4f 3f f8 49 63 ff 99 5c 8e ... 65486 more bytes>
chunk received 65536 <Buffer b9 18 f4 25 28 85 08 c4 67 79 0b 36 7a 18 de cd d1 fb 9e ce b3 e8 d6 71 aa 3d 39 3d 92 06 14 a9 e0 0c 93 b3 0f 42 64 e5 13 2b bc fc 93 fb 5f e9 16 92 ... 65486 more bytes>
chunk received 65536 <Buffer 55 91 f3 de 58 5b f0 37 32 82 f8 80 b0 69 c0 4c 72 c7 af 25 6a bd ec 2f e2 86 ce da c2 dc aa f5 4f 21 fc 10 05 bf 0f 37 70 1e 19 96 00 b5 8e ce e5 3b ... 65486 more bytes>
chunk received 65536 <Buffer 10 57 aa 62 86 f0 bd fc ce f1 2b 65 e6 c8 40 12 05 af b2 8e ec 39 3c 96 64 e0 ce 75 5e 37 c7 f3 58 4f 2e f8 d5 f4 3e 7b 39 5f 58 cb 6c f8 f9 50 7e 20 ... 65486 more bytes>
chunk received 65536 <Buffer ee e2 29 b5 fe 86 62 98 52 b5 9e b0 80 c1 c9 eb 15 88 3a b8 ce 0c 54 f1 15 18 fa 54 2b 07 60 cf 28 7a b3 49 5b 16 b9 07 10 69 c6 e2 3a d0 7f 30 75 0d ... 65486 more bytes>
chunk received 65536 <Buffer 55 6f 51 9e ab d2 10 ec d9 4a a2 47 b4 b7 d1 d0 b3 56 ae f0 ae fa 74 3c 92 17 48 6b df d2 65 0d 62 ea 48 ca fc 9e ae 84 7f d1 20 39 63 a9 72 6a 3f 16 ... 65486 more bytes>
chunk received 65536 <Buffer 66 20 c1 1e 03 5e 93 b2 93 3b 28 fe d5 06 ce c0 b0 f4 e1 22 31 1e 7f 61 57 37 f5 ab a1 ba d0 cf 85 17 21 cf 35 e5 45 71 5b a4 4a 52 d1 05 f6 35 a2 d0 ... 65486 more bytes>
chunk received 65536 <Buffer b1 d5 2b b0 2a c2 7e 74 62 bb 15 14 0d f6 a7 2d 8d 5b 43 8a 59 e0 78 a9 5b e4 72 18 f2 b5 5d 40 7c 59 4a 62 0f 83 85 7a 52 db 54 e2 61 db 14 49 40 c1 ... 65486 more bytes>
chunk received 65536 <Buffer ab d5 cf f7 03 c3 79 06 c6 1b 0d e8 5d 14 c0 75 c3 69 5b 60 85 72 2b c6 e7 55 9a d2 23 5e 88 4b 18 21 2e 33 1a 58 bb 36 e4 d4 f7 1d c8 f2 75 86 67 73 ... 65486 more bytes>
chunk received 65536 <Buffer 0a aa 83 4b 67 eb 13 74 80 5d 8d 10 65 99 f7 00 b4 ed e0 53 74 df bd 67 7f c8 3c 2f 6f eb 71 f9 1e c5 3e d0 78 66 ac a7 ba b6 33 61 46 8b 23 53 0c ff ... 65486 more bytes>
chunk received 65536 <Buffer 3d 23 14 03 12 80 79 8d b8 0c 71 7d 64 67 cd 58 e6 30 8b 29 16 59 dc cb 82 d3 67 fc b1 05 f6 61 62 49 cb f6 12 78 95 62 76 36 af 62 4a e8 51 ee fd 71 ... 65486 more bytes>
chunk received 65536 <Buffer 2e 62 c1 81 41 7c bf 31 1e ad 75 f8 94 82 34 71 5b 52 7f ff 3e 4b 55 62 1c e6 85 72 24 15 1b 51 33 3d 49 e2 7d dd 09 a2 65 a8 2b 50 1c 41 01 a4 07 c9 ... 65486 more bytes>
chunk received 65536 <Buffer ed 1d f0 54 84 c0 d3 99 37 d0 98 16 15 44 1f 8c a4 d4 94 de 5a 5e 07 97 c2 9a f1 a7 8b be e0 cd 98 44 c9 96 d5 dc 79 f9 6f 08 0f ad e2 14 97 c3 a0 2b ... 65486 more bytes>
chunk received 65536 <Buffer 0a 89 16 e8 2c fc 82 53 b9 68 4c 3e f4 dc 3a 91 cd 7d fa d9 fe ea f4 91 12 9f 40 7e cc c2 2b 57 09 cd b8 da 29 47 ca 32 89 bb c1 84 f1 57 eb 00 d5 80 ... 65486 more bytes>
chunk received 65536 <Buffer 71 be 57 82 dc 3e c1 31 09 da d3 6c bc c4 e9 4a 60 de 74 1a e0 04 db a7 5a 69 73 0d 11 b7 62 9a 8a c6 db 6b 29 e9 89 64 6f 3a 3d ef 33 57 3c 6c a9 03 ... 65486 more bytes>
chunk received 65536 <Buffer 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a ... 65486 more bytes>
chunk received 65536 <Buffer 71 c7 91 ab 4c 5c 47 85 77 c5 a6 3b 85 3a 7b ef 44 b0 dd 16 ac a0 3d 32 2b 73 88 aa 41 c5 84 09 7e 4a 95 ba cc 04 8d 7c 37 f1 53 13 79 8f 3d cd 21 37 ... 65486 more bytes>
chunk received 65536 <Buffer 87 cd 5c 19 86 53 a8 62 7b 9e 67 2b 6c fe cd 97 dd b6 7d 63 92 f4 57 af ff 1d ec 54 56 7d 24 4b ba b9 ee 37 d1 c0 49 af 2f f2 aa f3 e4 6d 82 71 aa 35 ... 65486 more bytes>
chunk received 65536 <Buffer c0 4a d9 b2 5d a2 45 4c d6 9f e8 c7 99 4d 20 68 c9 31 cf 3a ce fe 2a 27 20 03 da 2c 50 f1 6f 0d 42 a2 c1 c8 04 43 61 95 15 4b f8 5a a0 c9 48 ce 44 a3 ... 65486 more bytes>
chunk received 65536 <Buffer b0 4a 8c a0 88 98 44 21 39 c6 29 2d 96 dc 0a 57 37 96 1a 26 0c a4 0d e2 10 0b 41 98 58 f7 7e d2 52 f8 ee 00 eb dc 0e d3 1b 7a d1 b5 4c f1 f9 f7 24 e8 ... 65486 more bytes>
chunk received 65536 <Buffer 22 f7 e9 eb 6d f2 9b f7 8a 8d 77 af 68 5a bb b8 89 c7 b4 3a b3 d4 97 49 38 9c c4 ac 49 a0 5d fd c9 33 b6 62 f7 10 f9 20 61 5f d5 51 f8 73 54 ca 98 53 ... 65486 more bytes>
chunk received 65536 <Buffer 1c 25 b0 89 48 dc ce 55 17 ac 88 7a 15 db 71 d6 77 8d 50 a0 b1 3c 4c 8e 04 36 50 02 1f 6c d4 dc a1 32 f3 ec 26 0f eb 92 c2 10 7a 8b 93 76 5d c6 fd 26 ... 65486 more bytes>
chunk received 65536 <Buffer e2 fe f0 06 6c 13 a7 eb 53 3c e1 36 8b f4 21 e1 ac 16 a7 e7 0b 91 82 7b 68 af a2 84 db 5a 46 6d 70 ed 1d b0 f2 06 da 04 fc be ab a9 b3 ec db b8 79 73 ... 65486 more bytes>
chunk received 65536 <Buffer 53 4c 44 ed 59 8a 4f 73 39 c3 d8 40 39 70 c5 f2 bb bb a1 39 eb 7f 53 48 7c b1 04 86 06 9b 7a 14 e4 33 7d 51 5b af c7 a8 a4 0a 48 2f 75 6b c7 bb 08 64 ... 65486 more bytes>
chunk received 65536 <Buffer a8 3f 92 cb 11 e2 d5 d3 4c 30 90 32 52 0d 6a 42 a9 cf 0c 59 dd ae 3f a2 1a 5e 6b c4 bf e7 13 27 7f db ed e4 b0 36 5b 69 46 5d 4a b2 fd fb 56 9f 5a ba ... 65486 more bytes>
chunk received 65536 <Buffer de ed 97 c1 d3 03 e6 dc 21 d1 d9 4c 9c c7 0d 24 c9 37 e9 03 15 eb 2c 75 b9 a2 76 98 c3 6e a6 af 16 ea bd a6 35 23 75 72 43 b4 6b 2c a8 b0 99 bb 37 d2 ... 65486 more bytes>
chunk received 65536 <Buffer 7d 7e 06 92 8b 2f 7f e6 43 b7 44 30 d1 f2 82 28 29 78 ae 45 4d 8b 24 2c a2 4d 47 7b 4e 8c 57 f4 e3 75 5c 1b ff 4f 43 89 52 54 88 cc 73 f2 f0 5c ee 90 ... 65486 more bytes>
chunk received 65536 <Buffer 8f c7 38 a6 5f ee 1f 94 35 d1 31 f2 f2 02 4d a9 f8 59 4c 48 7e f7 c0 85 22 0d 8f 53 37 d4 f9 35 cc c3 2f e9 21 e6 aa 82 42 8c aa 4c 77 d1 f9 d4 02 5b ... 65486 more bytes>
chunk received 65536 <Buffer ac fd cb 6e c6 63 61 89 05 c3 09 50 13 4c 46 2f aa b2 09 ee a6 cd c0 c7 53 a4 58 af c8 0d f7 97 81 d1 59 ba 83 93 18 6e 01 59 7f 82 a8 fb 4f 22 87 c8 ... 65486 more bytes>
chunk received 65536 <Buffer ec ac 04 98 08 bf a2 58 82 ac 30 90 56 8f 4e 23 d5 62 f6 4d a7 f8 1e c7 c4 d7 f1 9c f9 92 30 fd e4 2f a5 cc 9d a5 55 3a 5e a5 7d 4b 98 27 71 1f b2 86 ... 65486 more bytes>
chunk received 65536 <Buffer 18 02 b4 b9 5d 9c 48 42 ff 5a 82 5e 45 c7 e8 88 6f e4 33 49 87 5d a7 88 94 fe 75 12 36 8f d1 e1 79 7c 0c 7c e6 c5 c5 b0 7e ea 3e a2 50 ac cf 9f f3 f2 ... 65486 more bytes>
chunk received 65536 <Buffer 0b b1 ad c4 45 62 07 6b c0 0d 65 dd 74 39 58 1b e1 80 df 22 66 1e 40 6a 50 52 30 ea a9 33 66 20 37 51 a6 70 19 ae fd 8f 06 0e 4e 59 08 1f 71 65 5a f1 ... 65486 more bytes>
chunk received 65536 <Buffer cb 59 44 54 e9 00 69 08 47 17 6c 25 5d 76 27 46 1f 2f d7 0d d2 ba 52 9d c3 90 14 eb e1 25 46 90 71 02 d4 06 c3 24 9b 3c 9d 2b c7 42 f6 69 a0 96 86 34 ... 65486 more bytes>
chunk received 65536 <Buffer ae 28 19 fd 1c 25 89 15 52 b3 df b9 42 00 79 07 4f f9 c7 1d 88 bf 88 90 ad 7f b9 ef a6 c4 fe 78 a1 6d d4 6f a3 19 0b aa cb df 7d f6 a4 d7 f5 f0 85 1f ... 65486 more bytes>
chunk received 65536 <Buffer c0 e4 f4 f7 2e b4 17 3f 85 9d 9f a8 bf a8 3c 15 00 fd 66 29 45 b5 a4 d3 9b 4b 8f 56 45 a1 44 2f df c7 e0 06 b9 e3 5e b5 b3 88 2b 60 85 ba e1 f1 b6 b6 ... 65486 more bytes>
chunk received 65536 <Buffer a4 50 f0 49 2f 9d e4 1a 8e b0 89 5e fb d5 8b d4 69 ac 56 9e fb c2 d6 3a de 99 32 f2 a5 2b 46 1d 64 92 c9 43 66 7e a9 e9 93 d3 41 05 b2 94 f3 a1 55 08 ... 65486 more bytes>
chunk received 65536 <Buffer 4a 1b a9 0f eb 56 1c 4c 39 f7 0f 92 c2 1e e0 01 b2 5e 26 19 a6 7f 05 7f f9 91 b9 d6 8d 59 fb 06 a8 8b 53 7f 88 49 77 aa 6f e0 bc 20 6b c2 e6 c6 6a 21 ... 65486 more bytes>
chunk received 65536 <Buffer f8 5a 37 b4 82 86 b7 b6 f2 b5 89 6a d7 18 95 4b aa 7b 38 d3 1f 9c f7 ca b9 ea e5 68 39 a5 ae 57 04 23 2d 3b 59 52 90 11 f0 5b 9e 61 21 5f 28 64 e1 a1 ... 65486 more bytes>
chunk received 65536 <Buffer c5 03 1e 60 8a ee 17 66 cd c5 71 49 e6 b7 78 db 4a e4 f7 4a 32 c0 a9 07 3d 28 75 a2 9c 37 29 dc cb 20 9a 82 ea 0c 3d bd 18 3b ba 65 e3 f0 98 75 76 2f ... 65486 more bytes>
chunk received 65536 <Buffer 09 38 d6 42 71 fa 4e 0d 00 41 9d 1d b6 bc c0 59 a1 8a 22 51 cf 2f 8e f0 6f 38 8e 85 9a 8f a5 22 0d da 20 e1 e7 25 ca 2b 0f 5b a4 b6 fd 78 e8 ca af 90 ... 65486 more bytes>
chunk received 65536 <Buffer ca 6b e2 ae 69 18 51 44 b5 20 a9 c6 8b f3 aa ac ed 68 f3 a5 f0 3a d5 d2 28 67 d2 94 8a 8a 20 63 d9 58 d3 29 39 87 5b e8 d8 f7 d3 a7 11 62 3b 61 c1 31 ... 65486 more bytes>
chunk received 65536 <Buffer 0f e3 c3 53 3e 54 d4 79 e8 0d 59 3d 47 62 58 88 ff 24 f2 54 09 98 1e 12 ff 37 8f 41 ea 64 89 66 f7 a8 e4 2e b9 4c f7 99 47 51 2a c5 97 90 8b 77 0e f7 ... 65486 more bytes>
chunk received 65536 <Buffer b8 23 47 30 24 8b 6b 37 00 59 6e c6 65 35 75 fa d1 3d 99 6a 4d 48 f0 41 ee 6f 0f c0 85 76 98 59 52 56 c9 d5 3a 3c 86 12 b9 a4 56 a0 4e 96 2e d2 35 28 ... 65486 more bytes>
chunk received 65536 <Buffer c2 6b b2 07 68 80 93 13 81 b0 ae fd 60 97 24 98 96 25 fa 55 77 4b 5d 15 4b 83 6e b5 f1 d6 53 71 c6 27 21 8d b7 e3 19 75 c4 7d c5 bf 01 af 16 7e d6 a4 ... 65486 more bytes>
chunk received 65536 <Buffer 77 c5 22 79 f6 2d 01 04 ce 35 ec 7d 89 4f 7e 9c 70 70 46 37 1c c2 6b 55 54 96 90 61 95 a7 d2 7d 47 8a 5d 98 4a 00 db d1 77 70 98 b6 65 2a cd dd 09 3a ... 65486 more bytes>
chunk received 65536 <Buffer e9 34 d2 b0 e5 1d 5d 4e 90 22 9d 87 4b 15 3f fd c9 a5 bb b3 b8 54 8a 84 09 1c ba 9b a2 b5 20 bc 6e 9d c0 ad ad 07 c7 01 8c a6 25 a1 69 8d 4f 05 ba 10 ... 65486 more bytes>
chunk received 65536 <Buffer 91 1e 59 2f 30 09 46 77 79 55 a6 24 ad b5 85 1a d0 df a2 42 cc e1 f0 2a 3a d7 fa 44 db f2 88 3d 5a 91 62 1b 05 a9 e1 62 e7 2b 93 74 ae c5 c0 4c 6e 15 ... 65486 more bytes>
chunk received 65536 <Buffer c8 9a e3 bd 94 5e ed 84 92 13 50 1a 9a b3 28 c4 44 1c 04 74 98 08 49 1a a5 cc ec cb a1 a2 4e 84 3b 53 2c 47 05 6c 69 65 f1 31 97 bc df 45 c8 23 1b f4 ... 65486 more bytes>
chunk received 65536 <Buffer 07 db ff 22 f5 2c 29 77 d7 1c 47 74 7d 03 a4 0b 82 82 ff bb db 2a d0 84 11 f5 06 e0 de 42 41 c3 b5 ab 21 41 83 95 2a c5 5d 11 b3 2f a0 b4 68 f1 b3 dd ... 65486 more bytes>
chunk received 65536 <Buffer 0b e9 3e f5 98 89 1d e8 bb 1b 38 f9 ec 2c 0b 48 1c d6 70 9a 21 25 3a 44 98 74 99 64 f6 48 eb cb 23 93 e0 6c 87 31 c7 99 ec 13 05 38 c7 93 a0 57 59 d4 ... 65486 more bytes>
chunk received 65536 <Buffer 93 3e 1e a5 c3 f8 48 55 e5 f6 17 7c ac a7 5c 62 5a 9f a4 bb 95 4f 0f e8 da 81 6d 13 0a 13 51 8b c3 38 27 fb 5c ff b2 9e 21 ec f8 41 c6 21 36 98 0f 70 ... 65486 more bytes>
chunk received 65536 <Buffer cd bd c9 fe 1d ed 1f 0f 32 bc 44 c2 d5 1d 7d fa 28 84 25 30 01 3d a3 26 b5 5b a6 39 dc 55 aa a2 58 2d 35 1c 47 66 96 08 7d cf 28 25 aa 26 4b 66 8c 33 ... 65486 more bytes>
chunk received 65536 <Buffer 99 fb 69 8f e3 be a0 f6 1d 17 7c 39 54 59 f7 03 3b 4a 82 82 8e 27 2c 7d 91 da ed b0 c6 7d 7c 6b d7 b4 58 7a 99 0a 00 85 5b 21 98 51 22 ce 91 3c 62 ee ... 65486 more bytes>
chunk received 65536 <Buffer e8 16 0e 37 c5 14 e0 0c f9 cf 2b 91 1d cc 7c 9a 03 4a d6 c0 c4 49 b9 1f f6 0f ee 53 65 2f 3d ef 13 90 ff 89 b6 89 0d 4d 24 23 a1 14 ab 93 06 08 2d c4 ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 bb dd 44 29 69 69 69 69 69 69 ... 65486 more bytes>
chunk received 65536 <Buffer a1 ce fe 82 08 56 93 e2 ab b3 c6 52 79 53 85 c0 29 dc 47 99 c0 fe 15 1a 39 50 bf 21 4c 35 f1 ec b8 c7 b8 f9 f1 b0 85 f8 3d 34 7f 0e 9c 51 d0 21 4d fb ... 65486 more bytes>
chunk received 65536 <Buffer 7d b9 71 5b e6 ed 27 1e ce f5 e4 36 ec d9 8d fd b5 c2 49 4a 12 95 f9 84 d5 44 da 04 9e 96 93 77 10 9b 71 0d 24 8e 0b 6e de 15 03 75 00 ea 6f 08 82 34 ... 65486 more bytes>
chunk received 65536 <Buffer fd 13 f1 96 a6 7b 72 fa a2 82 62 49 45 d5 4b c7 65 57 cd c0 40 c0 27 bc d8 69 c8 76 6b 33 9d 98 b3 7e 2c c7 19 c2 38 1f 41 ee a4 15 57 1f 20 f6 89 7a ... 65486 more bytes>
chunk received 65536 <Buffer 3f 09 c3 b3 72 5c 5e 2a c9 23 1a 54 af f0 b2 4f 6e 5f 5e 07 12 28 15 f1 3a 4b 74 70 2a 03 6e 5f 3e d6 f3 41 21 87 36 28 a2 87 20 4f 95 ab 0c 48 73 22 ... 65486 more bytes>
chunk received 65536 <Buffer 72 17 b8 e2 43 64 d4 94 5f ef d0 b5 42 df dc bc c1 e2 42 83 c5 13 25 06 85 9a c7 39 32 63 11 95 d3 db e1 64 4d d7 09 e2 c3 0b 90 b8 aa fa f3 a2 44 4c ... 65486 more bytes>
chunk received 65536 <Buffer fc cb 0f b8 a4 75 44 05 12 ef 47 8f 23 5d f0 09 33 9f 8e 6e 78 f7 4f db fb b9 7b 6d 6a bc 35 82 02 23 fd 94 85 c9 98 d5 0c 70 ef 55 2b 6f c3 cf 98 87 ... 65486 more bytes>
chunk received 65536 <Buffer 14 ea 9b 84 35 6a 94 62 63 4f 31 6d 91 94 e9 5d 34 df 7a c6 ac 6d 1b 6a 3c 1f d1 65 1d 38 06 87 99 03 dd b5 36 84 cc 99 6d 0a 8c 2f 81 01 5a 14 6c ae ... 65486 more bytes>
chunk received 65536 <Buffer 02 07 94 02 ff d4 ba c9 a6 cf 8f fd 8b 97 b4 3c 26 f2 3a a6 53 c6 41 b2 a3 eb 28 f4 be 13 87 11 77 6d d4 47 25 d5 a9 ff 97 f9 99 76 b0 a1 b0 8c 9f 40 ... 65486 more bytes>
chunk received 65536 <Buffer 96 73 c0 9d 73 5a e8 ce d8 0a 6d 66 7d f5 7c e0 48 63 2b ce e4 9f d0 d7 71 80 40 cd ba e0 31 49 01 c7 e8 44 2e 80 72 39 bf dd ad 90 ad 5e 32 2e b6 a5 ... 65486 more bytes>
chunk received 65536 <Buffer 6d b5 10 2d 0c 56 f7 8a d9 b0 44 b5 78 27 41 20 54 3d b1 cb b9 a3 30 59 47 a5 48 ae 3c bb f4 25 13 af c9 33 10 a0 a5 62 75 6d 80 c1 bd 79 14 29 d9 49 ... 65486 more bytes>
chunk received 65536 <Buffer 13 68 47 96 fe f8 e2 50 04 1a 12 92 d6 7d ce 01 f9 e5 df 1e b4 8e ed 19 7a b3 b1 1d d9 ca 16 80 1d 5e bf 64 c8 e0 3c ab 81 34 6b bc e9 1e 4a 61 ec 81 ... 65486 more bytes>
chunk received 65536 <Buffer cc 94 09 16 1e d6 19 20 74 f4 10 c6 db ff 43 cf ae 09 a9 77 a5 46 db 80 b0 58 23 c2 7e eb e3 6b 4c 10 d8 52 dc 1a ff 43 c9 56 43 fe 1b 4f 24 41 1e 4b ... 65486 more bytes>
chunk received 65536 <Buffer ce b4 d4 27 15 d1 e9 a2 de 0a f1 f7 99 fe 09 86 3a a6 cb 18 3a 5f b4 ba be 09 2f 8a c9 78 68 10 79 0c 6e 70 87 4f 6d d3 04 5e da f2 45 32 ba d2 43 32 ... 65486 more bytes>
chunk received 65536 <Buffer 2f 06 8f ec 65 46 33 0e cf 69 16 02 79 a0 ae 03 60 bd 0a b8 dd 44 e8 06 e2 7b 1a 91 dc 50 73 6d b0 0c a0 fe 40 ae 9a 51 92 24 28 5e ea c0 b5 41 d5 95 ... 65486 more bytes>
chunk received 65536 <Buffer ee 53 ff b8 c1 5a 1b 0d a9 3b 80 29 72 35 aa 22 5f e6 54 e7 d1 82 f5 3f f0 d3 8c b5 3d 5f 94 a3 71 d7 bf 3a fc 78 ae 12 38 14 a6 6e 34 38 cb 32 4e 5a ... 65486 more bytes>
chunk received 65536 <Buffer 74 07 96 55 c3 4f 58 6c 68 3e 3d 94 05 cd 95 e8 19 51 c5 78 1a 62 56 9d 5d d1 77 74 f7 48 f8 30 50 da dd e6 28 75 5e ba c4 dc 8b 6a c9 f9 58 e0 40 d3 ... 65486 more bytes>
chunk received 65536 <Buffer 84 c8 60 0d c0 20 3c 19 30 ff bd c0 16 09 59 98 dd 87 a2 17 b0 ab a8 43 b5 7e fc a4 cc 39 b1 70 af c1 8b 81 23 29 aa 5b 4d bb 25 35 7a 6e b1 e5 d5 96 ... 65486 more bytes>
chunk received 65536 <Buffer 6c 2c 9d b2 03 76 89 4b 97 e7 da 1a 61 45 83 3b 7b 91 de 3a 5d 6d e1 e0 98 09 71 63 ac 45 bb a7 bc fe b8 cf 40 7c e1 69 3e 6d 63 2f c6 a4 e6 3f 42 4c ... 65486 more bytes>
chunk received 65536 <Buffer ad 3f c4 bb 0d 02 c0 35 eb 22 13 73 65 ff 70 f1 49 07 24 9e a6 5c 8b e5 ae 4d a7 93 63 90 f6 26 6a 12 5e d1 15 e1 25 84 06 50 8b a8 37 17 45 8e a0 ac ... 65486 more bytes>
chunk received 65536 <Buffer 9f e5 66 59 09 81 97 5b 46 4d f2 f9 86 54 2e b4 db 90 e3 ce 97 dc c3 ec f0 96 41 af 01 df 3f 4c b0 a5 c9 b8 9f 2d 59 ed 13 66 1a 32 be ba bf e6 92 bb ... 65486 more bytes>
chunk received 65536 <Buffer 6a 2d c3 fc 2f 54 6d ad b8 31 87 1a 4a ac 44 64 4a 09 0b b8 85 29 75 b9 9b cd 3b 46 e4 91 69 d3 b7 2a 3b d5 11 03 67 a2 a5 91 df a5 61 b6 60 55 04 a5 ... 65486 more bytes>
chunk received 65536 <Buffer 7e 1f 1f 94 a2 11 f5 04 48 53 56 6c 9b be 09 95 c4 85 c5 4b ba 16 b3 88 d7 63 3b 52 e1 56 ba 96 ca 24 43 f4 f9 01 af 4c d6 e8 64 a7 4d 0c c3 aa 27 64 ... 65486 more bytes>
chunk received 65536 <Buffer 4a e9 d9 2d 11 c3 82 88 43 1a 35 18 a3 ca 08 5f e8 78 ef 26 cd 86 76 9c 5f 9e 21 da 86 72 46 b7 b2 8f af 99 37 fd f0 48 f9 fc 49 65 64 94 05 04 d9 8a ... 65486 more bytes>
chunk received 65536 <Buffer 70 01 07 d7 a6 7e 62 65 0b f5 11 07 8f e6 38 e4 b3 e4 db a4 9b ea 11 5f 38 39 e7 b5 e4 ae 9d c7 0d 10 e5 bb 5f bb b4 f3 f7 eb 02 bc 7e a3 b5 fb 42 ed ... 65486 more bytes>
chunk received 65536 <Buffer 6e 85 a2 71 cb 32 89 bd 46 12 ae ae 40 7b 4f 60 1a 33 73 a3 12 4e 8b cd cb 01 53 6a 6e 6c 2a aa 56 ea 7d a9 de fb 1e 08 e9 b7 fd ae ac 69 9e ea de 61 ... 65486 more bytes>
chunk received 65536 <Buffer d4 8d 00 09 1c e1 ef 29 99 0b 5e d9 a7 8e c6 73 27 f3 8f 4f f3 b1 ee 5d 0e 95 5d 2d 22 71 76 5a b5 eb 6a 74 4d 38 88 69 ba 2e e7 49 4d 46 db e9 42 05 ... 65486 more bytes>
chunk received 65536 <Buffer ca 0f a9 69 cb 8e b0 b6 3b d9 30 a9 ef 75 cc 2c 6c 22 74 3a 82 cc 5a 15 56 bb 54 e4 38 bb 48 9a f8 06 0d 75 0d f6 44 7a ce 0e 3e a0 c9 cd 2f c2 f1 80 ... 65486 more bytes>
chunk received 65536 <Buffer 52 90 02 82 ab 4a 54 64 53 01 37 f8 53 6f 24 0d 08 a0 ce 0e 4f f2 47 86 94 c4 ec 26 08 f5 f1 16 42 b4 69 15 6e b8 9e 83 25 cb 16 83 83 11 7d 63 c0 b2 ... 65486 more bytes>
chunk received 65536 <Buffer 50 94 c5 28 49 bd de ef a7 03 b6 48 ef ce 23 4d 64 4e 30 b2 b1 7c 71 e6 d7 25 61 52 56 33 c4 38 e3 9b 5d 5e a5 a7 fc 20 39 e1 46 aa b0 29 ae 6e 63 7c ... 65486 more bytes>
chunk received 65536 <Buffer 21 e7 77 96 72 3f 5b 2e 5a 78 d0 19 aa dd 71 b4 cf 54 af 3a 6e 47 bd bd 38 f7 52 28 c8 44 aa 11 1e 11 02 d1 50 3b 89 32 e4 ec f8 d2 ff ef fe 46 a7 2d ... 65486 more bytes>
chunk received 65536 <Buffer c5 39 f3 04 d6 00 e1 40 f4 65 86 92 b8 78 d4 f8 a3 9d 5c 25 cf a1 1a b6 c7 ee 07 0d 4f 1e fd aa 1d 1a 69 54 cf 06 a4 0d ef a0 b5 b5 52 11 68 c4 22 0c ... 65486 more bytes>
chunk received 65536 <Buffer 4d 2b 1a ae d8 4d 1e 61 fd 80 c4 db ff 9e f2 5b 46 13 26 da 2d 6e fa ef d3 17 47 3c 7c de 46 01 d5 bf 8e 1a a2 c6 55 51 d5 c5 c1 8b 49 91 a2 ac f0 9c ... 65486 more bytes>
chunk received 65536 <Buffer 21 17 d1 e4 32 18 e9 10 af fd da fd eb 2c 76 ba b9 5a e1 ed e2 1f 35 d2 6a a8 84 5b 65 f8 6e f1 ca 7a 8a 11 79 af b2 d0 81 09 0a 90 ee b9 95 41 29 78 ... 65486 more bytes>
chunk received 65536 <Buffer 0f 8e df ce 72 40 58 18 d8 a6 a8 4a c3 50 4f 99 f5 0e fd 87 82 da 90 dc 3c 8e e7 b9 c3 fc 0e cf b5 55 4b 7f 0c e5 f5 b6 db 28 b6 a0 fb a2 fd 6d 9f 02 ... 65486 more bytes>
chunk received 65536 <Buffer 54 49 35 a0 37 da 92 b4 c2 e9 81 13 8d e7 b1 9c 64 e5 a2 99 0e 23 71 e0 61 19 38 02 49 45 a9 38 de ed 55 f9 f0 e9 b0 68 ce b5 37 15 56 e8 51 aa 7a bf ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer d6 2c d2 b3 77 93 d8 8b cd 24 c7 d4 94 4e 0a 86 c6 58 a6 0a dd bc 2f 6c 8a 25 23 23 ee b0 51 60 0f e2 91 61 df d2 9a b6 29 36 a6 91 e2 11 60 3a fe b0 ... 65486 more bytes>
chunk received 65536 <Buffer e7 e4 70 c8 7d 2b 3d 4c c1 ba 46 20 f6 f8 f7 9b 5a 1f 3e 5d 5a 46 95 ad f4 64 09 97 2a 40 25 27 e1 4a e5 1d ca 58 41 21 b9 98 f5 20 a8 a2 fb 9d 0e 21 ... 65486 more bytes>
chunk received 65536 <Buffer 4c 7a 87 a8 c0 9c 56 d4 82 de 16 3d 0a 83 37 d6 92 5b 36 0b e1 ae 3b f1 4b 60 73 d1 d2 f1 07 75 f9 6f 54 88 28 7e ab ed cd 49 5f 96 eb ec 22 be 97 5c ... 65486 more bytes>
chunk received 65536 <Buffer e8 30 ee 10 9a b4 b0 8e 41 a1 ad e7 f5 23 b7 9a c4 97 b5 a7 7a ac 16 60 d5 d3 2f b9 50 99 24 26 d2 be 66 24 0b 94 a1 fc 2d d6 7e 70 6b 7b 72 c6 22 81 ... 65486 more bytes>
chunk received 65536 <Buffer 31 0b 54 55 16 a6 21 cb 79 26 76 52 45 69 1b 03 50 f0 67 fe 0a e6 85 51 0b 4e 4c 38 ff 5a 19 4a 78 77 e0 c0 bf d4 08 1e 44 13 cd 43 79 66 c8 8b 0b be ... 65486 more bytes>
chunk received 65536 <Buffer b4 20 13 55 7e 52 b3 65 1e 14 4c 9c c1 52 f8 94 43 b3 5b b1 18 05 d4 03 87 e7 66 92 8b 89 68 dc f3 f9 92 ee c6 23 a7 eb 36 a7 0d 8c eb 49 e0 1e 97 2b ... 65486 more bytes>
chunk received 65536 <Buffer 52 8a 64 9d 34 df 7a 6d 10 c9 27 a2 1e be 6e 3d 18 c0 1b fe ec 5c d4 b3 37 c2 91 38 f9 5d 8f d6 94 f5 27 78 1d 2e 42 55 1d 5b 78 f8 05 63 ce 92 b0 87 ... 65486 more bytes>
chunk received 65536 <Buffer 70 42 1a 12 a8 ea 53 bb ae 98 bc 52 05 ef 16 62 9d 1d 50 ad de e6 25 c1 22 51 5b d9 bc ba b4 1c c7 bf 93 fd b3 86 7d 8c 4a 86 8e 77 69 a6 ba c2 f7 41 ... 65486 more bytes>
chunk received 65536 <Buffer 9a ec f1 22 7a e2 45 9a c4 d6 ed 28 f9 69 01 a1 af 81 2f 3f 1b 38 f6 cc 62 3e 64 92 e4 16 b8 12 84 01 22 8e ec 1f 38 66 4a 72 50 8e a7 fd ff 73 ca 80 ... 65486 more bytes>
chunk received 65536 <Buffer 21 13 c1 45 23 93 7a a1 71 8f c1 6c 85 7f f9 9b f4 7b 17 3d 9a 1c 19 70 65 ca f4 c8 ba 73 d9 70 7e 0b be ef d1 03 85 5e d6 47 5e 76 6d cc 0d f9 1f 2b ... 65486 more bytes>
chunk received 65536 <Buffer 08 be 87 37 47 b3 4a 2e 6f a3 1f b4 e3 3b a0 43 0d ed fc 86 e5 fb ca a5 ad d7 49 3a 51 9b 0a 1f 2d 74 7c 22 0e b2 31 09 39 34 37 0d 76 63 12 67 5b 0d ... 65486 more bytes>
chunk received 65536 <Buffer a7 cf 19 bd 4a d1 a7 c4 36 61 9c 38 7f bd b6 ad 67 70 48 11 36 f6 0c 35 19 c5 eb 62 3c f6 a4 7f 09 b1 f0 19 a3 66 38 df 53 c3 46 ee 07 03 d7 dc d5 0d ... 65486 more bytes>
chunk received 65536 <Buffer 05 11 00 b8 53 da 96 ca a7 95 e8 6a 2e 8c c8 cb d9 02 7b 2b 63 78 34 b6 82 5c 71 d4 77 19 43 c3 ae e1 4d f8 9d 68 2b e4 f1 b7 cd ed d5 ac c2 57 25 90 ... 65486 more bytes>
chunk received 65536 <Buffer e7 79 76 81 05 2f bb 6e 49 73 78 e6 a4 cf 46 94 5b d1 2a ab 3d d2 a9 69 6d 30 d9 52 15 8f 34 75 2f 8a b1 d4 ad 49 39 a0 a1 23 fd 99 2b 9e b6 ea b6 50 ... 65486 more bytes>
chunk received 65536 <Buffer 79 c9 54 9e cd 7c 23 cf b1 ee 07 52 ba 20 f8 c8 94 c4 28 a3 32 a3 4f a6 c0 79 c0 57 19 98 91 45 c7 c6 fb cf 7a e6 a4 d2 54 2e c1 da 37 a9 e4 5b 6a 8e ... 65486 more bytes>
chunk received 65536 <Buffer e0 9f 36 13 b3 9f bf c6 13 1e 46 34 c6 99 1a 7f c2 ed 41 55 c1 d6 cd 8c 78 0a 14 e4 0b 0a fb 41 75 82 f6 8d 9a 96 74 36 c6 bf 5b f5 fa f8 8e 50 34 f2 ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer 63 f8 e8 a4 a7 25 e9 cd b5 44 64 b9 01 35 f8 3a c3 65 ff 43 70 c6 38 93 21 49 8c c2 69 1c 5e 8c 94 1c 62 1a 28 68 c9 23 0c 99 5f d9 c1 f7 cc ce bf f5 ... 65486 more bytes>
chunk received 65536 <Buffer f0 50 66 e9 ab 88 3b 0a 36 4b 32 a2 40 3a 54 14 ad 9e da ec b8 84 f2 4e 98 26 db dc bf c3 40 c6 18 6f 5f 0e cf 64 4a ef 7d 54 f6 c7 fe af 9e 6d 2a 73 ... 65486 more bytes>
chunk received 65536 <Buffer e8 a5 e2 eb ee 85 a7 ec 04 40 6c ef 33 24 51 a9 0c d3 aa 80 41 74 29 1f 12 ee a9 e5 29 a9 58 f8 d5 8b 27 0a 69 e9 a1 11 c0 df 19 5e 40 bc 81 63 ec db ... 65486 more bytes>
chunk received 65536 <Buffer 64 e0 40 20 47 e3 c6 b7 c4 84 67 d4 21 ea d6 42 b8 b0 ee c0 6e 48 f7 bc 96 83 02 48 24 d4 35 da 85 72 78 dc 0f da 4a 10 99 dd 35 f5 a0 4c 4a f0 c8 a7 ... 65486 more bytes>
chunk received 65536 <Buffer 9a 0b c3 92 e6 fe fd 28 8c f5 5a 29 ca 4e 91 2c 70 4e 9a 52 0e c1 79 b9 8a 16 22 f8 9c ee cf 24 ab 68 cd e5 2c 0f fd 6b e0 94 95 7f 29 12 d4 90 38 5e ... 65486 more bytes>
chunk received 65536 <Buffer c1 d3 71 2c df 75 3f 36 e3 0f 42 1a e1 eb 31 8c 86 10 58 6a 49 c0 06 94 6e ce 87 14 5d a9 b4 20 f5 f6 51 99 a5 98 d8 6b 6f f3 16 b5 9f 8d 35 fd 76 69 ... 65486 more bytes>
chunk received 65536 <Buffer 64 02 c8 55 85 1a 63 ca 34 b3 be 4e 28 6e 03 3e 0c bd 80 47 35 ad a2 54 a3 60 c0 62 6a 82 bc aa 8f 81 54 c8 02 ac 65 a3 02 64 90 14 f8 e0 cf 98 b1 a0 ... 65486 more bytes>
chunk received 65536 <Buffer 58 71 64 57 26 ee 82 70 bc 27 76 d6 ad 6c e8 83 67 d7 92 ea 74 db 15 c5 81 c7 00 32 70 d7 6b 16 1c 44 83 79 37 63 99 c5 c2 54 56 f0 c2 cd 37 b5 cd b8 ... 65486 more bytes>
chunk received 65536 <Buffer b8 6e 62 5b 90 47 5a 84 9c ce 87 e5 34 af 44 6c f4 b0 d0 bf bf 18 72 8b 2c 45 22 1f 66 1e f8 d8 73 63 41 a2 71 5d 1f 2b 21 51 41 54 ff 18 e4 62 25 72 ... 65486 more bytes>
chunk received 65536 <Buffer 5f ee dd f0 c5 79 8e 48 b2 84 60 a1 d6 8b fe a7 f1 79 2c e5 1f 1a 7a 55 27 8f 18 e9 02 63 d6 c5 9e d6 b5 d1 68 f8 02 9d be 41 53 c8 bf e0 cf 3c 44 b3 ... 65486 more bytes>
chunk received 65536 <Buffer fa b4 6e 34 67 d5 11 f8 8e 31 5f 14 8b 5b 44 f8 92 88 08 fb d5 0e ab 04 86 ab c4 4a 19 65 8f 19 ff d9 f2 ce 18 14 e6 d7 14 d9 ff b6 7b 34 bd b4 35 63 ... 65486 more bytes>
chunk received 65536 <Buffer d0 7e 3a de be f0 5b 41 fc 62 30 ac 60 7e a1 d8 ce 3a 04 9f b9 2b a4 c2 53 d1 05 41 fa eb cb 30 3e 6f b4 70 e5 03 2e 81 38 06 b8 3c d5 a1 01 53 34 28 ... 65486 more bytes>
chunk received 65536 <Buffer 3e b1 87 77 6a a2 97 32 cc 33 2e fe f9 2a 48 14 9b ec 9c a9 13 cc 60 9e 85 8d 66 cb 16 01 24 56 26 6f b6 50 17 4a 37 a5 a0 b8 3b 86 08 12 da 8f 2c 13 ... 65486 more bytes>
chunk received 65536 <Buffer 84 95 30 2e 3a 08 66 21 dd af 61 b1 7d c9 89 ea 16 01 3f e5 da de c2 ce fd 07 c8 60 69 70 e1 4d 98 b2 5d 18 8f 53 1a 54 89 21 23 01 a6 71 1d 8a 06 59 ... 65486 more bytes>
chunk received 65536 <Buffer 06 bd 27 8d f5 fc 8a 6f a0 7b c3 bc ef 6e d4 83 64 f2 25 d5 22 4d 05 2a fc 3b aa ac 82 8c 0d c2 4d b8 fa d6 c0 a0 e8 a9 3d 2b 6e 86 92 12 bc 18 9c e4 ... 65486 more bytes>
chunk received 65536 <Buffer db 9b 51 d9 d2 95 54 98 78 3d 05 67 19 1e fe 97 e5 41 b0 fe 0e 69 4c 89 a3 2d bf 11 5b be 9a 21 71 ab c4 7b b2 1f bf f0 d4 68 f4 09 3e ed 64 21 b8 bf ... 65486 more bytes>
chunk received 65536 <Buffer aa 70 72 69 55 a0 c4 63 b8 86 49 f4 85 1e a4 42 ca fc 41 df 9b 1f 3b 0b 8c 7f aa 5f 4d 41 c9 29 55 2e da 80 10 65 90 97 46 9b 93 b9 a0 ca 57 f3 75 16 ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer ca 84 61 d7 df 01 23 35 e8 fa 90 99 bb 5c f1 c3 54 19 b7 f3 0a 27 38 55 ad 41 4b 99 c5 81 4f b2 6c 7c 3b 1f 77 04 97 d7 9c 5b 65 9a 9f 18 5a b4 6c 57 ... 65486 more bytes>
chunk received 65536 <Buffer f2 f2 1b 9a e5 f4 b7 5b 9e 9d ea 40 5e 13 21 c3 27 39 91 25 aa 48 9a 27 0a 22 50 c7 d6 d1 00 ec 9c e6 90 9d ac 74 12 74 41 5f fb 5a 79 ab 6a 5e be 61 ... 65486 more bytes>
chunk received 65536 <Buffer 48 3d e0 bb 1c 9c 56 44 44 97 c7 9e 41 4c ce d6 a3 32 26 b9 bc 84 1b ce 79 57 a4 78 9d 41 58 46 b4 5e 70 f1 8f 31 44 f4 af f0 ee 69 6c 0c d5 5a 51 4f ... 65486 more bytes>
chunk received 65536 <Buffer c3 57 9e e0 06 c4 47 df b4 b4 50 06 72 de 20 db fc cd 64 d9 48 72 f9 17 27 8b 3d 0e e1 d1 b0 bd 15 15 0c 8d f7 68 1a f8 34 b4 45 bb 3d bf 17 25 60 8a ... 65486 more bytes>
chunk received 65536 <Buffer 59 1e 2e 87 50 5c ca da b4 c1 7b 92 11 ad 9e 8f 35 4d 21 b8 ca 4e 43 e3 b0 f4 40 3c 53 47 56 24 ff ea e5 74 08 23 91 62 bc d1 fc c1 52 0b d2 f1 bc f3 ... 65486 more bytes>
chunk received 65536 <Buffer 90 2d 9e 5a d2 3f d3 58 5e ff 99 85 20 0a e0 2e 4f 15 f5 47 9e 91 a1 00 f7 de 9a 00 5d d0 24 57 93 db 1b 2a 67 b4 e7 b2 1b 6c d8 aa 27 08 34 17 16 d7 ... 65486 more bytes>
chunk received 65536 <Buffer ea 3f ce 11 2a b2 a3 e0 10 d5 b7 1c 0e 90 08 7e 17 97 3e 25 e7 73 0f f3 8f f6 0f 47 a4 4e 6a 58 d0 24 02 32 31 cc 7b 68 96 59 2a 15 4d 55 df 36 b8 1b ... 65486 more bytes>
chunk received 65536 <Buffer 5c d4 80 21 5d 22 ce ae 2a 0f 2c 78 37 1b 8d 62 ed 3a 53 c7 c3 e0 ad 6b 8a 5a 41 b1 68 b9 ec a3 2b 27 23 15 62 61 24 c5 8c 11 50 9d 23 44 27 96 a8 ed ... 65486 more bytes>
chunk received 65536 <Buffer 18 56 97 a0 86 dc b4 80 2e 1c 01 04 87 50 35 35 90 0b 42 61 5f 44 fc a6 02 69 48 1c dd de 20 aa da 08 ec 65 58 62 25 01 2e b7 f6 fe 2d 32 8a 71 27 08 ... 65486 more bytes>
chunk received 65536 <Buffer b5 80 db 44 94 32 f3 66 01 d9 0c 23 2e 1c 24 39 0d f2 06 02 c9 03 73 a1 e1 07 a5 d6 08 b7 f8 1c 75 4d 47 ad 9a 92 45 cd f5 6a 53 a8 57 c8 e3 3c 0c 06 ... 65486 more bytes>
chunk received 65536 <Buffer 6e b5 03 34 93 bf 8a b4 2e e3 d5 9b c1 bf 19 76 8a 17 1f c1 5e a8 3a 2c 87 a6 a4 87 a4 4f 07 c0 69 aa b2 ad 13 2f 6d 15 a8 4e 47 74 96 fe ba ff 1e 6a ... 65486 more bytes>
chunk received 65536 <Buffer 5c a9 07 89 09 97 ab 26 67 a5 ab 10 80 52 20 5d 0e 8b f9 07 ab 8a a0 58 c6 3a ca d4 4b 84 41 36 f2 fc f3 d7 0e 84 0d 66 69 6c 90 a6 68 95 e3 fe 5a dd ... 65486 more bytes>
chunk received 65536 <Buffer 81 81 e4 42 e2 1c 2b a7 9d d6 c4 cb e1 53 5b e4 40 3c b3 6b ef d3 85 3d ac 19 cf 2e fb c5 7f 1f 6c 72 b8 4e b2 e0 65 36 5e 9a 95 c1 22 88 f0 2d db 54 ... 65486 more bytes>
chunk received 65536 <Buffer c9 c3 e2 18 67 27 04 3a b3 1c 60 b2 dd c5 df 39 a1 0d c3 b5 35 3a be ec 8c 35 90 c2 5e 38 9a 5b 68 6f 20 83 aa 34 8e 58 02 5f d7 a4 bf 93 e2 c4 0e 00 ... 65486 more bytes>
chunk received 65536 <Buffer 86 f7 cd 76 50 99 a8 61 64 25 88 82 92 cf 45 48 98 65 e9 70 47 bd 8a 9b 84 bc 00 bf 6c 1a bb 3a d4 47 79 b9 27 ac 29 80 6b 00 b5 3a d7 21 15 75 fb 54 ... 65486 more bytes>
chunk received 65536 <Buffer e4 db 93 86 4d e1 07 6e 39 6a 83 11 f2 3a d7 47 10 1c f6 75 28 8b 8f 67 7a a7 61 71 65 24 87 05 60 3f 88 a9 6c 1d 34 64 01 3b 8e f1 15 c3 16 ab 0d f4 ... 65486 more bytes>
chunk received 65536 <Buffer 2b ad f6 c6 17 71 68 f5 85 f1 51 ba 47 e6 07 81 7b 3f 00 4a 28 d0 70 85 d5 e3 b8 4a 79 43 7e 67 21 51 12 d5 e7 c3 7b 55 5e dd 5c 6a a7 d8 3f 56 85 ed ... 65486 more bytes>
chunk received 65536 <Buffer c8 a8 44 ce a4 3e b9 68 ee 7d 1d cb 5e 03 69 c6 fd 2d 3c 27 96 be 60 c2 67 8d f6 16 27 1e 0d 14 d7 21 da 87 bb aa 4a f9 13 79 5f 2b 9d 07 50 1f 15 9a ... 65486 more bytes>
chunk received 65536 <Buffer 2e 74 5a 0e 86 6a 31 bd b4 2b 71 1e 24 39 1b 56 10 75 47 1a 8a 9b ae fb eb 79 fe 4e f8 23 68 1d 53 f0 8a 2d 40 6e c1 20 6b 66 9a a6 18 3c 26 72 f3 d5 ... 65486 more bytes>
chunk received 65536 <Buffer a3 b9 27 18 ce a8 87 be c9 d0 5f ce 64 fd 21 8b 2f 01 5f 91 3c ef 2b 0d ca 34 e1 f7 5b 41 9a 02 65 e9 fa ff 52 4c 2c a1 13 9b fc f4 f7 66 80 66 e2 b5 ... 65486 more bytes>
chunk received 65536 <Buffer 84 f4 a3 04 ce f6 a3 45 32 48 b2 fd ad ca 51 ad 56 15 20 d9 27 85 a2 ed e7 0f ce 39 f2 f7 b0 03 52 24 d6 d7 6f 95 3a 97 c5 93 67 3c 8a f0 11 04 11 a1 ... 65486 more bytes>
chunk received 65536 <Buffer d4 55 e6 47 52 6e 0f 40 da 30 fc 31 a6 64 ab d2 52 55 bf 8d b1 f1 2c 5b 9f 05 97 f1 3e 46 06 4d ce d0 e2 60 62 54 62 d3 48 31 49 f9 6a cf 48 7c ce da ... 65486 more bytes>
chunk received 65536 <Buffer cb 14 8c 46 9e 73 0f 3a dd b7 d3 22 1f 00 cc dc 56 ce f3 0e 08 36 84 77 97 1b fe fe dd 9b 8e 3e 70 05 8f fb f2 1f 23 49 ae 74 e6 a4 3e 56 81 8a ba 5e ... 65486 more bytes>
chunk received 65536 <Buffer 68 f1 62 df 33 c4 e7 78 39 3a 08 3b 9f f4 80 f1 18 0c ab 2f 06 fa 90 e0 42 48 58 6e 6b c8 0c 08 b9 84 ee cb 44 16 07 e7 db 65 d1 84 e4 cc 25 1d 67 d7 ... 65486 more bytes>
chunk received 65536 <Buffer 13 0a 85 81 0e 0b dc 88 fa a9 56 48 a6 0e 32 08 db 87 75 c3 af 47 59 bb 78 c8 3d ee ec 71 c1 e8 e9 2a db e5 b3 5b ab 2d 2e 17 77 18 cf b8 2c 0a d8 e5 ... 65486 more bytes>
chunk received 65536 <Buffer 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a ... 65486 more bytes>
chunk received 65536 <Buffer 9a 1e a0 36 c6 34 aa 9e 6b c5 64 04 f7 c9 97 1f 5c cc 98 ea 82 de 42 2e c7 53 30 d0 62 82 f6 c3 42 d2 89 5f d3 20 e4 c9 f8 65 4f fb 6f 61 18 06 72 b1 ... 65486 more bytes>
chunk received 65536 <Buffer 7a dd b5 9e 81 91 35 60 19 b7 62 78 c1 25 8b 06 be 7f 66 54 b4 96 91 da a9 a7 ed c7 13 4e 4c fe fd 9a 7b 67 c6 24 bf 62 0d bc 0a 9a f7 63 68 dd f7 54 ... 65486 more bytes>
chunk received 65536 <Buffer 77 04 92 5c d1 0d b5 38 4d d7 19 21 0f c4 5e df c7 fb aa 87 a8 ae 88 cf 76 27 c7 0a e0 a5 ba 1e 7c aa b4 8a 4f 0a 6e cb 7a 0d 4c 08 8e f0 0f dd e5 8a ... 65486 more bytes>
chunk received 65536 <Buffer c6 02 70 c6 4b 8b 2b 57 dd 0b 7c b1 a4 37 13 d9 1a 3a 29 b0 62 c0 9b b4 a9 26 cd 9e 60 3a d7 84 f9 77 55 79 6d c2 fe dc 10 78 98 8c 1a 21 fd ad 8e a0 ... 65486 more bytes>
chunk received 65536 <Buffer a4 c7 27 2b 6c 06 95 37 cd 5f 4f fd 78 7d 7e f4 3c cf 4a 5d f0 eb 10 b1 fe 26 cf e4 73 78 a5 c9 6c 6e 5a 0f bb 69 e4 5b c9 86 cd f8 8a 22 37 79 0f 68 ... 65486 more bytes>
chunk received 65536 <Buffer cb 4f d0 92 09 93 e6 f1 82 ff 7e a9 e4 e7 a0 ec c4 98 b1 c5 88 8a c2 92 05 5a 4e cd 75 1b 61 c5 9a 30 4b 3b b6 2b ae aa 39 27 27 04 8d 3e b3 80 3f ce ... 65486 more bytes>
chunk received 65536 <Buffer c8 cf 33 02 7f b5 d7 16 4c 97 02 e2 1a 2c 8c 61 6d c6 ea 04 8c 54 34 8f ce 2f 7d 48 63 1e 11 fa 06 8d a3 b1 84 ea 49 2d 73 08 5f 3b 6c b6 f9 7f 4a d7 ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer 89 d6 59 c4 df 3f bf f2 09 a1 4f 0f de 08 6d 1d d1 6c 99 5b 9b 60 a1 e6 c5 a6 af 21 96 ed 80 db cf 1d 39 ae 17 81 e3 71 a6 36 ce c6 a8 39 28 ad f6 c8 ... 65486 more bytes>
chunk received 65536 <Buffer a8 5d ea d2 91 41 6d 18 c1 12 10 9b 2c 4f e7 88 e7 6b 45 fb 9e b3 2d 5a b1 97 db 9b 25 75 13 a4 38 10 4a 32 8e 50 09 5b 09 43 df 96 c4 f6 52 73 9c 3e ... 65486 more bytes>
chunk received 65536 <Buffer 44 98 6d ee 65 9c e1 6b dd ec 2c 52 ce e4 60 4d c3 b8 49 c9 f1 f1 94 64 d7 30 fb dc 7f 61 6e f4 04 16 78 04 29 a9 ea 9e 77 22 af ac 40 d6 db b9 da 61 ... 65486 more bytes>
chunk received 65536 <Buffer af b1 2b e8 96 6c ed 43 0e 78 60 65 94 ce 6f 1a 59 6a 2e 43 83 9b 23 27 0e 26 16 6e ac 73 b6 2c 5c 35 c9 01 7a 0f 47 93 10 d3 b2 44 a2 47 ce d8 05 69 ... 65486 more bytes>
chunk received 65536 <Buffer e3 52 c6 e0 69 10 b2 25 3a 14 d9 c5 cf d0 b7 38 fe cb 97 ca 17 f5 84 3e b3 59 79 8c e7 ab 3d b1 c5 56 0c 3b da e3 9a d0 cf b2 e5 83 9b 4b 41 91 02 66 ... 65486 more bytes>
chunk received 65536 <Buffer 17 42 9e 5a 46 f5 f6 67 39 4f e9 20 55 8c e6 de 98 a0 29 b8 b2 d5 91 4e 38 4f 29 b5 2d f6 a7 b1 33 a5 1f 3f 13 64 4e 22 a3 ba 87 90 10 bc e0 65 23 ea ... 65486 more bytes>
chunk received 65536 <Buffer 00 7b d1 b2 4d b0 3f be ea d8 ca 1a be 17 df b3 e5 31 5b 9f 03 ee 8e de 26 89 7a 3b e0 72 fc 6c 40 7f cf ce ac 4e fe 5e 86 fb 11 c8 99 9d 1d ea b0 27 ... 65486 more bytes>
chunk received 65536 <Buffer a2 cd d1 f0 56 21 50 12 6e f7 7c 6d c5 9c a4 3f a7 f2 1b d9 0e c2 02 2f 7f 67 3c ea a8 90 d6 12 00 8d 66 6d 33 a8 e2 e7 0b 56 7d 16 34 a5 02 3f a6 12 ... 65486 more bytes>
chunk received 65536 <Buffer 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a ... 65486 more bytes>
chunk received 65536 <Buffer ac 73 c4 ad 33 80 79 52 27 92 be 8b 90 50 66 c2 7f 49 77 d2 3e cc fc e7 b6 8c 8d b4 bb 5a cb a3 91 24 12 c0 95 f0 ed 53 9a af 5c 36 a1 12 4f 72 66 b8 ... 65486 more bytes>
chunk received 65536 <Buffer ce 00 34 81 2b f7 92 55 86 d6 05 0b 99 11 f5 31 1c 9b 8b 40 04 46 ad 94 a5 d5 43 4d 98 c5 eb 54 a9 db e1 da 0c f9 d0 6f 6a 3c 2b b5 97 28 db a8 55 3b ... 65486 more bytes>
chunk received 65536 <Buffer d6 62 46 91 76 62 7c 97 e0 78 87 9c ab 85 c2 23 b9 5e b4 5a 37 10 1a 5a 76 69 dc bc 41 6c 28 87 a8 c4 ab d9 56 78 86 48 8e 28 ac a8 43 68 13 bd 9d 70 ... 65486 more bytes>
chunk received 65536 <Buffer fd 0b 88 f0 dd 42 b2 a6 6b 90 9d 13 63 4b ad 77 be 4b c5 44 21 0f 0e d7 ab e1 a6 38 30 3b 77 b6 38 b3 9a e5 88 f1 09 fd 51 e1 1e 76 df 3f 8c 5f 11 0a ... 65486 more bytes>
chunk received 65536 <Buffer 48 67 43 9c 2e 05 67 31 4f 09 99 05 ff 2d 12 b4 b1 85 f6 53 93 1e 13 56 b5 86 38 80 ff 6e 5f cd 4b 52 19 d6 4f 85 27 5f 56 6d d7 83 a1 7a d7 44 b6 b2 ... 65486 more bytes>
chunk received 65536 <Buffer 66 2b 0d 32 d6 0f a0 e0 8a a9 ee f6 53 e2 e1 45 a1 d7 8f 2b 9b 4a e6 c7 62 86 75 6c a8 29 b1 29 8b aa 4b bd 6c 97 9c 5b 72 9f d9 af 20 cd f8 de 6e 4e ... 65486 more bytes>
chunk received 65536 <Buffer 1d b7 7b 66 bc fe 1d b4 71 63 e1 d5 f6 37 3f 6b ef c8 41 7d a9 e0 05 5c 09 7c e9 37 2b 51 8c 09 46 ad db 8b 9d 4e ad f6 57 ff 36 0f 5e 54 19 e5 4e 3e ... 65486 more bytes>
chunk received 65536 <Buffer 78 9b c7 27 84 96 5c 08 74 3e 14 85 1b 5b c9 ff fb 69 3b 33 69 fb de e0 14 75 6a 52 81 98 0e 86 c8 4b 34 65 37 05 46 d9 ac 2b ee 9c dd 94 f3 99 5e b0 ... 65486 more bytes>
chunk received 65536 <Buffer 74 33 f0 91 d5 7e 8b 19 45 3e a0 1d 03 80 f9 54 13 8b 3d 73 1c 5a 82 76 28 25 61 b7 39 75 a6 0b 4d a6 58 f6 8d 0c ea eb 46 41 88 0c 94 04 65 5b 8b fb ... 65486 more bytes>
chunk received 65536 <Buffer e6 01 2d e9 1b ea 10 29 ef 91 20 e2 d9 f6 ef 0a 50 a4 61 d1 d9 d1 d8 16 28 82 48 3a f3 83 0b d6 ca 84 33 23 e5 cc a6 49 b5 99 ef b9 6f 7a 89 18 ca ea ... 65486 more bytes>
chunk received 65536 <Buffer 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a 5a ... 65486 more bytes>
chunk received 65536 <Buffer 41 77 99 a0 c2 58 1e 83 49 7d 68 bd a1 25 fe 13 13 9f e8 0d f5 f9 1e 8a 13 98 98 2b c8 c4 97 ad aa d3 50 2e 03 66 5c 6f 7b 1f 7a 8e 28 44 76 ac 38 c7 ... 65486 more bytes>
chunk received 65536 <Buffer 95 f2 4e 6a eb b5 1d a8 9e dc e7 b7 7d 31 73 20 49 c0 31 1f da 4d 1e cd 0e 3a 1d 52 43 0e 5f 1a 7e 95 1b 0e 71 1f bb c3 26 3d fe f1 30 e5 0d 8a 6b c4 ... 65486 more bytes>
chunk received 65536 <Buffer 4b 60 6a b4 13 ed 7b 14 21 ae 1d 52 fb 13 91 4a 6a 9d 69 40 aa 99 d4 2d e5 8d 6f f9 22 40 8b 88 db f6 da f7 f9 84 c0 e3 0a 28 cd da bc 85 65 23 66 de ... 65486 more bytes>
chunk received 65536 <Buffer 82 ed 34 b9 7e 92 80 46 f4 07 4e 40 a1 a4 ca cc c1 6d 56 06 ac 66 e9 a4 aa b1 ee af 60 ac 4c 1a 32 79 07 81 b1 1c 88 66 75 8a 6d 79 a0 be 5d ad 4c a4 ... 65486 more bytes>
chunk received 65536 <Buffer 78 4c 09 2b 77 0c 57 67 99 cc 60 2a 1b 05 f2 e3 9a c4 7b 69 84 65 01 7b c0 04 7f ea d1 38 0f 82 ad 53 6f 13 78 27 d4 70 54 a4 39 d2 58 73 3f a5 39 45 ... 65486 more bytes>
chunk received 65536 <Buffer 5d fa 3f cd e7 08 4d 6c 97 33 f8 85 37 0c 15 82 ff 1c d1 92 ef 62 b2 0b 00 2c d2 45 61 86 5f 54 aa ad 60 67 77 11 08 0b 81 82 37 a6 35 33 5b 6b a1 71 ... 65486 more bytes>
chunk received 65536 <Buffer 0c 34 f2 22 0c a8 c3 15 96 bb e0 8f 16 1a 16 60 27 65 52 c0 9c de b4 65 c3 64 fc 29 71 be 3c bf f4 cf a1 2a fe c2 b9 f1 f7 9c e6 d9 cf 5b 94 96 3b 26 ... 65486 more bytes>
chunk received 65536 <Buffer 8e 06 98 57 3a 8c 73 ba 85 3e 90 bb a4 0d 45 33 57 0c 77 bb 76 30 f1 d7 86 24 d8 08 4c a6 67 16 6d c6 ef 6f 74 2e d3 08 57 4c 3b f8 27 ba 7f 8f 18 10 ... 65486 more bytes>
chunk received 65536 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 65486 more bytes>
chunk received 65536 <Buffer 34 77 77 47 27 3c 8e af 4c 55 ef bb 5e 34 ea 10 73 2c d3 04 8f 7b fc c0 22 5e 09 7d 8b c0 63 39 6a 6c e3 b4 a6 80 08 74 ce 6c 07 15 3f 81 50 19 96 81 ... 65486 more bytes>
chunk received 65536 <Buffer d5 c5 78 32 97 ef 06 31 6a b6 e8 c6 b8 6a 94 64 c9 ec 6c 22 19 cf ea 58 c2 09 0f db 23 fd c8 ac ec 8f 5a 68 f9 ae d4 b2 cb 46 bc c8 fa f2 47 64 6f 51 ... 65486 more bytes>
chunk received 65536 <Buffer 7b 41 49 52 f8 f7 7a 12 18 fa 8c 79 d1 a6 96 a0 05 f0 5f 9f 07 e0 f3 31 48 fb d0 68 14 e2 75 24 64 f2 d2 0a ef ab 70 8a bf 75 7c ae 81 d7 3c 92 b0 1a ... 65486 more bytes>
chunk received 65536 <Buffer 3c f3 29 80 0c 5f 11 f0 96 7b 2b 73 82 cb f8 4f d3 9d c7 90 a8 06 37 5c 1a 20 e3 f5 f8 8d d7 f1 29 4c 8a 34 03 1e ce 5f 5c 0a 61 dd 43 f1 d3 64 11 d8 ... 65486 more bytes>
chunk received 65536 <Buffer 6d 7f 9e 87 3e b8 0a a1 a2 61 4f fd d6 29 a7 f6 3b eb 4d 10 81 49 f6 38 9c 0b af 9b 97 a8 c2 ee ee 9d 3e 64 43 a9 d0 51 be 3c f0 b2 23 44 73 5d 71 93 ... 65486 more bytes>
chunk received 65536 <Buffer 8a b6 32 71 ec 21 ed 74 8d aa 42 a2 37 cb cd d2 b6 4b 22 52 aa 37 25 f6 fa a1 7a a8 68 09 f0 d1 40 83 36 fb a3 1f df bd 50 25 4d bf bd c5 59 a1 cc c6 ... 65486 more bytes>
chunk received 65536 <Buffer 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 69 ... 65486 more bytes>
chunk received 65536 <Buffer ee 33 ee 08 0b a1 ad a5 1c 05 d6 f9 c8 a5 bc 97 b5 63 be a6 7d 25 47 21 6f 47 52 73 f9 9c f9 dc 8a ca f7 a9 b9 63 18 fa 15 95 9a 09 18 7a 36 17 28 b3 ... 65486 more bytes>
chunk received 14053 <Buffer b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 b4 ... 14003 more bytes>
chunk end
📤 Uploaded: 2.01 MB / 17.01 MB
📤 Uploaded: 7.01 MB / 17.01 MB
📤 Uploaded: 12.01 MB / 17.01 MB
📤 Uploaded: 17.01 MB / 17.01 MB
✅ Large file upload completed.
    */
    fileStream.on("error", (error) => {
      console.error("Error occurred while reading file:", error);
    });
    // ✅ create stream

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: fileStream,
        ContentType: file.mimetype
      }
    });

    console.log("🚀 Starting large file upload...");

    upload.on("httpUploadProgress", (progress) => {
      const uploadedMB = (progress.loaded / (1024 * 1024)).toFixed(2);

      // ✅ safe handling
      const totalMB = progress.total
        ? (progress.total / (1024 * 1024)).toFixed(2)
        : "Unknown";

      console.log(`📤 Uploaded: ${uploadedMB} MB / ${totalMB} MB`);
    });

    await upload.done();

    console.log("✅ Large file upload completed.");

    // ✅ cleanup temp file
    fs.unlinkSync(file.path, (err) => {
      if (err) console.log("File delete error:", err);
    });

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.log("❌ Error uploading large file to S3:", error);
    throw error;
  }
};
