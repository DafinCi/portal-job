-- ==========================================
-- TABEL 1: profiles
-- Tanpa email, murni untuk data profil publik
-- ==========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- TABEL 2: resumes
-- Ditambah kolom 'status' untuk tracking UX loading
-- ==========================================
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    raw_text TEXT,
    status TEXT DEFAULT 'uploaded', -- Status: uploaded, processing, completed, failed
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- TABEL 3: resume_analysis
-- Relasi 1-to-N dipertahankan untuk versioning AI
-- ==========================================
CREATE TABLE resume_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
    model_version TEXT,
    prompt_version TEXT,
    candidate_data JSONB NOT NULL, 
    extracted_skills TEXT[],  
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Index untuk mempercepat pencarian analisis berdasarkan resume
CREATE INDEX idx_resume_analysis_resume_id ON resume_analysis(resume_id);

-- ==========================================
-- TABEL 4: companies
-- ==========================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- TABEL 5: jobs
-- ==========================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT[], 
    location TEXT,
    experience_level TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==========================================
-- TABEL 6: job_matches
-- ==========================================
CREATE TABLE job_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES resume_analysis(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    match_score INTEGER,
    reason TEXT,
    missing_skills JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(analysis_id, job_id)
);

-- ==========================================
-- SETUP ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Resumes
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Resume Analysis (User hanya bisa BACA, Insert dilakukan oleh Server/API)
CREATE POLICY "Users can view own analysis" ON resume_analysis FOR SELECT USING (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = resume_analysis.resume_id AND resumes.profile_id = auth.uid())
);

-- Companies & Jobs (Public Read-Only)
CREATE POLICY "Anyone can view companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (is_active = true);

-- Job Matches (User hanya bisa BACA, Insert dilakukan oleh Server/API)
CREATE POLICY "Users can view own job matches" ON job_matches FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM resume_analysis 
        JOIN resumes ON resume_analysis.resume_id = resumes.id
        WHERE resume_analysis.id = job_matches.analysis_id AND resumes.profile_id = auth.uid()
    )
);