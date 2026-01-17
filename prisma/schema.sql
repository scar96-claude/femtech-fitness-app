-- FemTech Fitness App - Phase 1 Database Schema
-- Generated from Prisma schema

-- Drop existing objects if they exist
DROP TABLE IF EXISTS performance_logs CASCADE;
DROP TABLE IF EXISTS cycle_logs CASCADE;
DROP TABLE IF EXISTS health_metadata CASCADE;
DROP TABLE IF EXISTS workout_templates CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS exercise_library CASCADE;

DROP TYPE IF EXISTS activity_level CASCADE;
DROP TYPE IF EXISTS goal CASCADE;
DROP TYPE IF EXISTS demographic CASCADE;
DROP TYPE IF EXISTS cycle_type CASCADE;
DROP TYPE IF EXISTS movement_pattern CASCADE;
DROP TYPE IF EXISTS equipment CASCADE;
DROP TYPE IF EXISTS phase CASCADE;
DROP TYPE IF EXISTS difficulty CASCADE;
DROP TYPE IF EXISTS split_type CASCADE;

-- Create ENUMs
CREATE TYPE activity_level AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE');
CREATE TYPE goal AS ENUM ('STRENGTH', 'WEIGHT_LOSS', 'ENDURANCE', 'BONE_HEALTH');
CREATE TYPE demographic AS ENUM ('REPRODUCTIVE', 'PERIMENOPAUSE');
CREATE TYPE cycle_type AS ENUM ('REGULAR', 'IRREGULAR', 'PERIMENOPAUSE', 'POSTMENOPAUSE');
CREATE TYPE movement_pattern AS ENUM ('SQUAT', 'HINGE', 'PUSH', 'PULL', 'CARRY', 'CORE', 'CARDIO');
CREATE TYPE equipment AS ENUM ('NONE', 'DUMBBELLS', 'BARBELL', 'MACHINE', 'BANDS');
CREATE TYPE phase AS ENUM ('ANY', 'FOLLICULAR', 'OVULATORY', 'LUTEAL');
CREATE TYPE difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE split_type AS ENUM ('FULL_BODY', 'UPPER_LOWER', 'PUSH_PULL_LEGS');

-- Table: user_profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth TIMESTAMP NOT NULL,
    height_cm DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    activity_level activity_level DEFAULT 'MODERATE' NOT NULL,
    primary_goal goal NOT NULL,
    demographic demographic NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table: health_metadata
CREATE TABLE health_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    pelvic_risk BOOLEAN DEFAULT FALSE NOT NULL,
    bone_density_risk BOOLEAN DEFAULT FALSE NOT NULL,
    cycle_type cycle_type NOT NULL,
    injury_history JSONB DEFAULT '[]' NOT NULL,
    medications JSONB DEFAULT '[]' NOT NULL,
    last_period_date TIMESTAMP,
    avg_cycle_length INTEGER DEFAULT 28 NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table: exercise_library
CREATE TABLE exercise_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    movement_pattern movement_pattern NOT NULL,
    equipment_required equipment NOT NULL,
    primary_muscle VARCHAR(50),
    video_url VARCHAR(500),
    is_osteo_safe BOOLEAN DEFAULT TRUE NOT NULL,
    is_pelvic_safe BOOLEAN DEFAULT TRUE NOT NULL,
    menopause_priority BOOLEAN DEFAULT FALSE NOT NULL,
    phase_recommendation phase DEFAULT 'ANY' NOT NULL,
    difficulty difficulty NOT NULL
);

-- Table: cycle_logs
CREATE TABLE cycle_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    period_start_date TIMESTAMP NOT NULL,
    period_end_date TIMESTAMP,
    symptoms JSONB DEFAULT '{}' NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table: performance_logs
CREATE TABLE performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercise_library(id),
    workout_date TIMESTAMP NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight_kg DECIMAL(5, 2),
    rpe INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table: workout_templates
CREATE TABLE workout_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    split_type split_type NOT NULL,
    target_audience demographic NOT NULL,
    exercise_order JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_demographic ON user_profiles(demographic);
CREATE INDEX idx_user_profiles_date_of_birth ON user_profiles(date_of_birth);

CREATE INDEX idx_exercise_library_movement_pattern ON exercise_library(movement_pattern);
CREATE INDEX idx_exercise_library_equipment_required ON exercise_library(equipment_required);
CREATE INDEX idx_exercise_library_menopause_priority ON exercise_library(menopause_priority);

CREATE INDEX idx_cycle_logs_user_period ON cycle_logs(user_id, period_start_date);

CREATE INDEX idx_performance_logs_user_exercise_date ON performance_logs(user_id, exercise_id, workout_date);

CREATE INDEX idx_workout_templates_target_audience ON workout_templates(target_audience);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO femtech_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO femtech_user;
