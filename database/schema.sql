-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    domain TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    employee_size TEXT NOT NULL DEFAULT '',
    raw_json JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on company_name and domain combination
CREATE UNIQUE INDEX IF NOT EXISTS companies_unique_name_domain 
ON companies (company_name, domain);

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS companies_country_idx ON companies (country);
CREATE INDEX IF NOT EXISTS companies_employee_size_idx ON companies (employee_size);
CREATE INDEX IF NOT EXISTS companies_domain_idx ON companies (domain);
CREATE INDEX IF NOT EXISTS companies_created_at_idx ON companies (created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON companies
    FOR ALL USING (true);

-- Create policy to allow read access for anonymous users
CREATE POLICY "Enable read access for anonymous users" ON companies
    FOR SELECT USING (true); 