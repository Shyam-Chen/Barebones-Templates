import { randomUUID } from 'node:crypto';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { QdrantClient } from '@qdrant/js-client-rest';
import type { ModelMessage } from 'ai';
import { embedMany, generateText, jsonSchema, streamText, tool, stepCountIs } from 'ai';
import Type from 'typebox';

import auth from '~/middleware/auth.ts';

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const llm = google('gemini-3-flash-preview');
const embedding = google.embeddingModel('gemini-embedding-001');

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });

export default (async (app) => {
  /*
  $ curl --request GET \
         --url http://localhost:3000/api/chat
  */
  app.get('', async (_request, reply) => {
    const { text } = await generateText({
      model: llm,
      system: ``,
      prompt: `什麼是 Qdrant？`,
    });

    return reply.send({ text });
  });

  app.post('', { sse: true }, async (request, reply) => {
    const body = JSON.parse(request.body as string) as { messages: ModelMessage[] };

    const limitedMessages = body.messages.slice(-10);

    const { textStream } = streamText({
      model: llm,
      system: ``,
      messages: limitedMessages,
    });

    for await (const textPart of textStream) {
      await reply.sse.send({ data: textPart });
    }
  });

  // ---

  app.post('/embed', async (_request, reply) => {
    // 一個標準的知識庫 Embedding 流程圖：
    // 1. Raw Data：原始 PDF/Word 文件。
    // 2. Parsing：轉為 Markdown/Text。
    // 3. Chunking：切成 500 字的小塊（帶有 Overlap，50~100 字的 Overlap（重疊））。
    // 4. Enrichment (分類)：加上 Metadata（分類、標籤、摘要）。
    //     -> 來源資訊：文件名、頁碼、URL
    //     -> 分類標籤：產品類型、部門、文檔類別（如：技術手冊、FAQ、合約）
    //     -> 時間戳記：確保 AI 能抓到最新版本的資料
    //     -> 摘要（Summary）：有時我們會先叫 LLM 幫這一小段寫個摘要，然後同時 Embed 原始內容和摘要。檢索時用摘要去對齊，命中率會更高
    // 5. Embedding：將文字轉為 1536 維的數值向量。
    // 6. Storage：存入向量資料庫（如 Pinecone, Milvus, Chroma, Weaviate）。

    const documents = [
      'Qdrant 是一個高效能的向量資料庫。',
      'Gemini 是 Google 開發的多模態大型語言模型。',
      'TypeScript 讓 JavaScript 開發更安全。',
    ];

    const { embeddings } = await embedMany({
      model: embedding,
      values: documents,
    });

    const COLLECTION_NAME = 'my-knowledge-base';

    // await qdrant.createCollection(COLLECTION_NAME, {
    //   vectors: { size: 768, distance: 'Cosine' },
    // });

    // const collection = await qdrant.getCollection(COLLECTION_NAME);

    const points = embeddings.map((vector, index) => ({
      id: randomUUID(),
      vector,
      payload: {
        content: documents[index],
        // 把 Metadata 寫進 Prompt
        // 例如：「以下資訊來自 [source_type: PDF] 的 [category: HR] 部門文件，最後更新於 [created_at]：內容：[content]」
        metadata: {
          source: 'manual_input',
          timestamp: new Date().toISOString(),
        },
      },
    }));

    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: points,
    });

    return reply.send({ message: 'OK' });
  });

  app.post('/query', { sse: true }, async (request, reply) => {
    const body = JSON.parse(request.body as string);

    // 1. 假設從向量資料庫檢索出了結果
    const searchResults = [
      { content: '員工每年有 7 天特休', metadata: { source: '員工手冊', page: 5 } },
      { content: '特休需於三日前申請', metadata: { source: '差勤管理辦法', page: 2 } },
    ];

    const contextString = searchResults
      .map(
        (res) =>
          `資料來源：[${res.metadata.source} 第 ${res.metadata.page} 頁]\n內容：${res.content}`,
      )
      .join('\n\n');

    const userQuery = '請問我有幾天特休？要怎麼請假？';

    const { textStream } = streamText({
      model: llm,
      prompt: `
        你是一個專業的助手，請根據以下提供的「參考資料」回答使用者的問題。
        如果資料中沒有提到，請回答不知道，不要瞎編。
        回覆時請務必註明資料來源。

        ### 參考資料：
        ${contextString}

        ### 使用者問題：
        ${userQuery}
      `,
    });

    for await (const textPart of textStream) {
      await reply.sse.send({ data: textPart });
    }
  });

  // ---

  app.post('/tool', { sse: true, onRequest: [auth] }, async (request, reply) => {
    const input = `What is my username?`;

    const { textStream } = streamText({
      model: llm,
      prompt: `${input}`,
      tools: {
        username: tool({
          description: 'Get the username',
          inputSchema: jsonSchema(
            Type.Object({
              username: Type.String({ description: 'The username to get the username for' }),
            }),
          ),
          async execute({ username }) {
            const users = app.mongo.db?.collection('users');

            const user = await users?.findOne(
              { username: { $eq: request.user.username } },
              { projection: { password: 0, secret: 0 } },
            );

            return { username };
          },
        }),
      },
    });

    for await (const textPart of textStream) {
      await reply.sse.send({ data: textPart });
    }
  });

  // ---

  app.post('/step', { sse: true, onRequest: [auth] }, async (request, reply) => {
    // 當前用戶名
    // request.user.username

    const body = JSON.parse(request.body as string) as { messages: ModelMessage[] };

    const limitedMessages = body.messages.slice(-10);

    const { textStream } = streamText({
      model: llm,
      messages: limitedMessages,
      system: '你是一個企業 HR 助手。你可以回答關於公司政策的問題，也可以查詢員工個人的特休資訊。',
      tools: {
        // 工具一：查詢 HR 規章 (RAG)
        queryHRPolicy: tool({
          description: '查詢公司的 HR 規章、福利、請假流程等一般性政策。',
          inputSchema: jsonSchema(
            Type.Object({
              query: Type.String({ description: '要搜尋的政策關鍵字' }),
            }),
          ),
          async execute({ query }) {
            // 這裡實作你的向量資料庫檢索邏輯 (例如 Pinecone, Supabase Vector)
            // const docs = await vectorStore.search(query);
            return { content: '根據規章第 5 條，病假每年有 30 天半薪...' };
          },
        }),

        // 工具二：查詢個人資料 (Doc / SQL / API)
        getUserVacationBalance: tool({
          description: '查詢特定員工剩餘的特休天數。',
          inputSchema: jsonSchema(Type.Object({})), // 不需要參數，因為我們會從 Context 拿 userId
          async execute() {
            // 這裡實作你的資料庫查詢
            // const balance = await db.vacation.findFirst({ where: { userId } });
            const balance = 12.5;
            return { daysRemaining: balance, userId: request.user.username };
          },
        }),
      },

      // 自動執行工具並回傳結果給 AI
      stopWhen: stepCountIs(5),
    });

    await reply.sse.send({ data: '' });
  });
}) as FastifyPluginAsyncTypebox;
