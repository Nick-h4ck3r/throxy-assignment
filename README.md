# DataFlow - AI-Powered Data Intelligence Platform

A modern, production-ready platform for intelligently processing, cleaning, and exploring company data from CSV files. Built with Next.js, TypeScript, PostgreSQL, and powered by AI for seamless data transformation.

## 🎯 Platform Overview

DataFlow transforms messy CSV files into clean, structured company data using pure AI intelligence. No manual rules, no hardcoded patterns - just intelligent data processing that adapts to any format automatically.

## 🚀 Features

### 🤖 AI-Powered Intelligence

- **Pure AI Data Cleaning**: Uses OpenAI GPT-3.5 to intelligently clean and standardize company data
- **Zero Manual Rules**: No hardcoded patterns or regex - AI handles all data formats automatically
- **Adaptive Processing**: Learns from examples and adapts to any CSV structure
- **Confidence Scoring**: AI provides confidence levels and reasoning for each transformation

### 🎨 Modern User Experience

- **Beautiful Landing Page**: Professional design with geometric logo and subtle animations
- **Smooth Interactions**: Debounced search, skeleton loaders, and hover effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Feedback**: Live progress indicators and smooth transitions

### 🔍 Advanced Data Exploration

- **Debounced Search**: Smart domain filtering with 500ms delay for optimal performance
- **Multi-column Filtering**: Filter by country, employee size, and domain simultaneously
- **Alphabetical Sorting**: Three-state sorting (None → A-Z → Z-A) with visual indicators
- **Table Skeleton Loading**: Professional loading states that maintain table structure

### 🗄️ Robust Data Management

- **PostgreSQL Storage**: Enterprise-grade database with proper indexing
- **Duplicate Prevention**: Smart constraint handling prevents data duplication
- **Data Traceability**: Preserves original data in JSON format for audit trails
- **Scalable Architecture**: Built for production with proper error handling

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**: Latest app router with React 19
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Modern utility-first styling
- **React Hook Form**: Efficient form handling
- **TanStack Table**: Advanced table functionality

### Backend & AI

- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL (Supabase)**: Production-ready database
- **OpenAI GPT-3.5**: AI-powered data cleaning
- **Papa Parse**: Robust CSV parsing

### UI/UX

- **Lucide React**: Beautiful, consistent icons
- **Custom Animations**: Smooth transitions and hover effects
- **Intersection Observer**: Smart animation triggering
- **Debounced Search**: Optimized search performance

### Deployment

- **Vercel**: Zero-config deployment
- **Environment Variables**: Secure configuration management

## 📋 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd throxy-assignement
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings → API to find your project URL and anon key
3. In the SQL Editor, run the schema from `database/schema.sql`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from env.example
cp env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_ai_api_key  # Required for AI data processing
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Database Schema

The application uses a single `companies` table with the following structure:

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    domain TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    employee_size TEXT NOT NULL DEFAULT '',
    raw_json JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📊 Data Processing Pipeline

### 1. CSV Upload & Validation

- **Drag-and-drop Interface**: Modern file upload with progress indicators
- **File Validation**: Checks file type, size, and structure
- **Header Normalization**: Automatically handles various CSV formats
- **Real-time Feedback**: Live progress updates during processing

### 2. AI-Powered Data Cleaning

- **Pure AI Processing**: Uses OpenAI GPT-3.5 with example-based prompting
- **Adaptive Intelligence**: No hardcoded rules - AI learns from examples
- **Comprehensive Cleaning**:
  - Country normalization (e.g., "us" → "United States")
  - Employee size bucketing (e.g., "1000+" → "1000+ employees")
  - Domain validation and cleaning
  - City extraction from location strings
- **Confidence Scoring**: AI provides reasoning and confidence levels

### 3. Smart Data Storage

- **PostgreSQL Integration**: Enterprise-grade database with proper indexing
- **Duplicate Prevention**: Unique constraints prevent data duplication
- **Data Traceability**: Original data preserved in JSON format
- **Efficient Queries**: Optimized for filtering and sorting

### 4. API Architecture

- `POST /api/upload` - Process CSV files with AI cleaning
- `GET /api/companies` - Retrieve companies with advanced filtering
- `GET /api/countries` - Get unique countries for filter dropdown
- `GET /api/employee-sizes` - Get unique employee sizes for filter dropdown

## 🔧 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📁 Project Structure

```
throxy-assignement/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── upload/        # CSV upload endpoint
│   │   ├── companies/     # Companies data endpoint
│   │   ├── countries/     # Countries filter endpoint
│   │   └── employee-sizes/ # Employee sizes filter endpoint
│   ├── globals.css        # Global styles with animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main landing page
├── components/            # React components
│   ├── file-upload.tsx    # File upload component
│   ├── companies-table.tsx # Companies table with filtering
│   ├── Logo.tsx           # Geometric logo component
│   ├── AnimatedCounter.tsx # Animated statistics counter
│   └── AnimatedSection.tsx # Intersection observer animations
├── lib/                   # Utility libraries
│   ├── database.ts        # Database client and queries
│   ├── data-cleaning.ts   # AI data cleaning algorithms
│   └── utils.ts           # General utilities
├── database/              # Database schema and migrations
│   └── schema.sql         # PostgreSQL schema
├── public/               # Static assets
└── env.example           # Environment variables template
```

## 🧪 Testing the Application

### Quick Start

1. **Start the development server**: `npm run dev`
2. **Upload sample CSV**: Test drag-and-drop functionality
3. **Explore filtering**: Try debounced search and multi-column filters
4. **Test sorting**: Verify alphabetical sorting functionality

### Sample CSV Data

```csv
company_name,domain,city,country,employee_size
Apple Inc.,apple. com,Cupertino CA USA,United States,100000+
Google LLC,google.com,Mountain View California,USA,> 10000
Tesla Inc.,tesla.com,Palo Alto CA,United-States,
Microsoft Corp,www.microsoft.com,Redmond WA,US,50000+
```

## 🔍 API Endpoints

- `POST /api/upload` - Upload and process CSV files
- `GET /api/companies` - Retrieve companies with filtering
- `GET /api/countries` - Get unique countries
- `GET /api/employee-sizes` - Get unique employee sizes

## 📚 Additional Documentation

- **[ENRICHMENT_APPROACHES.md](./ENRICHMENT_APPROACHES.md)** - Comprehensive guide to data enrichment strategies including heuristics, public APIs, and LLM approaches

## 📝 License

This project is built as a take-home assignment and is available for review and evaluation.

## 🤝 Contributing

This is a take-home assignment project. For questions or clarifications, please reach out to the development team.

---

Built with ❤️ using Next.js, TypeScript, and PostgreSQL
