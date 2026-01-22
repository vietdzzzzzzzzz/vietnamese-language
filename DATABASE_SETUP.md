# Database & AI Setup Guide

## 📋 Tổng Quan

Hệ thống GYMORA sử dụng:
- **Database**: MongoDB (cloud hoặc local)
- **AI**: Vercel AI SDK với OpenAI/Anthropic/Google

## 🔧 Bước 1: Cấu Hình MongoDB

### Option 1: MongoDB Atlas (Cloud - Khuyên Dùng)

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Đăng ký tài khoản miễn phí
3. Tạo cluster mới (chọn FREE tier)
4. Chọn region gần Việt Nam (Singapore)
5. Tạo Database User:
   - Click "Database Access"
   - Add New Database User
   - Chọn Password authentication
   - Lưu username và password
6. Whitelist IP:
   - Click "Network Access"
   - Add IP Address
   - Chọn "Allow Access from Anywhere" (0.0.0.0/0)
7. Lấy Connection String:
   - Click "Connect" trên cluster
   - Chọn "Connect your application"
   - Copy connection string

### Option 2: MongoDB Local

```bash
# Cài đặt MongoDB Community Edition
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Khởi động MongoDB
mongod

# Connection string cho local
mongodb://localhost:27017/gymora
```

## 🤖 Bước 2: Cấu Hình AI API

Chọn một trong các provider sau:

### Option 1: OpenAI (Khuyên Dùng)
- Hỗ trợ tiếng Việt tốt
- Chi phí: ~$0.002/1K tokens

1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Đăng ký/Đăng nhập
3. Vào [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy key (bắt đầu với `sk-`)

### Option 2: Google Gemini (Miễn Phí)
- Miễn phí cho usage thấp
- Hỗ trợ tiếng Việt tốt

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Copy key

### Option 3: Anthropic Claude
- Chi phí: ~$0.003/1K tokens

1. Truy cập [Anthropic Console](https://console.anthropic.com/)
2. Tạo API key
3. Copy key (bắt đầu với `sk-ant-`)

## ⚙️ Bước 3: Cấu Hình Environment Variables

Mở file `.env.local` và điền thông tin:

```env
# 1. MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gymora?retryWrites=true&w=majority

# 2. Chọn 1 trong các AI provider (uncomment dòng bạn chọn)

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# HOẶC Google Gemini
# GOOGLE_GENERATIVE_AI_API_KEY=your-google-key-here

# HOẶC Anthropic
# ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# 3. App settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Lưu ý**: 
- Thay `username`, `password`, và `cluster` trong MONGODB_URI
- Chỉ cần 1 AI API key (chọn provider bạn muốn)
- File `.env.local` đã được thêm vào `.gitignore`

## 🧪 Bước 4: Test Kết Nối

### 1. Cài đặt dependencies

```bash
cd vietnamese-language
pnpm install
```

### 2. Khởi động dev server

```bash
pnpm dev
```

### 3. Test MongoDB Connection

Mở browser và truy cập:
```
http://localhost:3000/api/db-test
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "✅ Kết nối MongoDB thành công!",
  "databases": ["admin", "config", "gymora"],
  "timestamp": "2024-01-21T..."
}
```

### 4. Test AI Chat

Sử dụng UI chat trong app hoặc test bằng curl:

```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Chào bạn, tôi muốn tập gym"}
    ]
  }'
```

## 📊 Bước 5: Tạo Dữ Liệu Mẫu

### Tạo user mẫu

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gymora.com",
    "password": "password123",
    "name": "Nguyễn Văn A",
    "role": "member",
    "currentWeight": 75,
    "targetWeight": 68
  }'
```

### Kiểm tra user

```bash
curl http://localhost:3000/api/users?email=test@gymora.com
```

## 🗂️ Cấu Trúc Database

Hệ thống sử dụng các collections sau:

```
gymora/
├── users              # Thông tin người dùng
├── user_packages      # Gói tập của user
├── attendance         # Lịch sử check-in/out
└── workout_progress   # Tiến độ tập luyện
```

## 🛠️ Helper Functions

File `lib/db.ts` cung cấp các helper functions:

```typescript
// User operations
createUser(userData)
getUserByEmail(email)
getUserById(userId)
updateUser(userId, updates)

// Package operations
createUserPackage(packageData)
getUserPackages(userId)
getActiveUserPackage(userId)

// Attendance
createAttendance(attendanceData)
getUserAttendance(userId)
updateAttendanceCheckout(attendanceId, checkOutTime)

// Workout Progress
createWorkoutProgress(progressData)
getUserWorkoutProgress(userId)
getWorkoutProgressByDateRange(userId, startDate, endDate)

// Statistics
getUserStats(userId)
```

## ⚠️ Lưu Ý Bảo Mật

1. **Không commit file `.env.local`** vào git
2. **Hash passwords** trước khi lưu database (TODO: implement bcrypt)
3. **Validate input** ở cả client và server
4. **Rate limiting** cho API endpoints
5. **HTTPS** khi deploy production

## 🚀 Deploy Production

Khi deploy lên Vercel/Railway/etc:

1. Thêm environment variables vào dashboard
2. Sử dụng MongoDB Atlas (không dùng local)
3. Bật IP whitelist cho production IPs
4. Enable authentication và authorization

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Check logs trong terminal
2. Verify connection string
3. Check API key còn hạn
4. Test từng component riêng lẻ
