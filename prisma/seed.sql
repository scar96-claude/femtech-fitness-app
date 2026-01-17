-- FemTech Fitness App - Phase 1 Seed Data
-- 54 exercises + 3 test users

-- Clear existing data
DELETE FROM performance_logs;
DELETE FROM cycle_logs;
DELETE FROM health_metadata;
DELETE FROM workout_templates;
DELETE FROM user_profiles;
DELETE FROM exercise_library;

-- ============================================================================
-- EXERCISE DATA (54 exercises)
-- ============================================================================

-- SQUAT MOVEMENTS (8 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Barbell Back Squat', 'SQUAT', 'BARBELL', 'Quadriceps', TRUE, FALSE, TRUE, 'FOLLICULAR', 'INTERMEDIATE'),
('Goblet Squat', 'SQUAT', 'DUMBBELLS', 'Quadriceps', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER'),
('Bulgarian Split Squat', 'SQUAT', 'DUMBBELLS', 'Quadriceps', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Wall Squat', 'SQUAT', 'NONE', 'Quadriceps', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Air Squat', 'SQUAT', 'NONE', 'Quadriceps', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Jump Squat', 'SQUAT', 'NONE', 'Quadriceps', FALSE, FALSE, FALSE, 'FOLLICULAR', 'INTERMEDIATE'),
('Box Squat', 'SQUAT', 'BARBELL', 'Quadriceps', TRUE, FALSE, TRUE, 'ANY', 'INTERMEDIATE'),
('Leg Press', 'SQUAT', 'MACHINE', 'Quadriceps', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER');

-- HINGE MOVEMENTS (8 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Deadlift', 'HINGE', 'BARBELL', 'Hamstrings', TRUE, FALSE, TRUE, 'FOLLICULAR', 'INTERMEDIATE'),
('Romanian Deadlift', 'HINGE', 'BARBELL', 'Hamstrings', TRUE, FALSE, TRUE, 'ANY', 'INTERMEDIATE'),
('Hip Thrust', 'HINGE', 'BARBELL', 'Glutes', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER'),
('Glute Bridge', 'HINGE', 'NONE', 'Glutes', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Single-Leg RDL', 'HINGE', 'DUMBBELLS', 'Hamstrings', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Good Morning', 'HINGE', 'BARBELL', 'Hamstrings', TRUE, FALSE, FALSE, 'ANY', 'INTERMEDIATE'),
('Kettlebell Swing', 'HINGE', 'DUMBBELLS', 'Glutes', TRUE, FALSE, TRUE, 'FOLLICULAR', 'INTERMEDIATE'),
('Cable Pull-Through', 'HINGE', 'MACHINE', 'Glutes', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER');

-- PUSH MOVEMENTS (8 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Bench Press', 'PUSH', 'BARBELL', 'Chest', TRUE, TRUE, FALSE, 'ANY', 'INTERMEDIATE'),
('Overhead Press', 'PUSH', 'BARBELL', 'Shoulders', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Push-Up', 'PUSH', 'NONE', 'Chest', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Incline Dumbbell Press', 'PUSH', 'DUMBBELLS', 'Chest', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Pike Push-Up', 'PUSH', 'NONE', 'Shoulders', TRUE, TRUE, FALSE, 'ANY', 'INTERMEDIATE'),
('Dips', 'PUSH', 'NONE', 'Triceps', TRUE, TRUE, FALSE, 'ANY', 'INTERMEDIATE'),
('Landmine Press', 'PUSH', 'BARBELL', 'Shoulders', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Dumbbell Shoulder Press', 'PUSH', 'DUMBBELLS', 'Shoulders', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER');

-- PULL MOVEMENTS (8 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Bent Over Row', 'PULL', 'BARBELL', 'Back', TRUE, TRUE, FALSE, 'ANY', 'INTERMEDIATE'),
('Lat Pulldown', 'PULL', 'MACHINE', 'Lats', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Face Pull', 'PULL', 'BANDS', 'Rear Delts', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Single-Arm Dumbbell Row', 'PULL', 'DUMBBELLS', 'Back', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Pull-Up', 'PULL', 'NONE', 'Lats', TRUE, TRUE, FALSE, 'ANY', 'ADVANCED'),
('Seated Cable Row', 'PULL', 'MACHINE', 'Back', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('T-Bar Row', 'PULL', 'BARBELL', 'Back', TRUE, TRUE, FALSE, 'ANY', 'INTERMEDIATE'),
('Band Pull-Apart', 'PULL', 'BANDS', 'Rear Delts', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER');

-- CARRY MOVEMENTS (6 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Farmer''s Walk', 'CARRY', 'DUMBBELLS', 'Grip', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER'),
('Suitcase Carry', 'CARRY', 'DUMBBELLS', 'Obliques', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER'),
('Overhead Carry', 'CARRY', 'DUMBBELLS', 'Shoulders', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Waiter Walk', 'CARRY', 'DUMBBELLS', 'Shoulders', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Front Rack Carry', 'CARRY', 'DUMBBELLS', 'Core', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Trap Bar Carry', 'CARRY', 'BARBELL', 'Grip', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER');

-- CORE MOVEMENTS (8 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Plank', 'CORE', 'NONE', 'Core', TRUE, FALSE, FALSE, 'ANY', 'BEGINNER'),
('Dead Bug', 'CORE', 'NONE', 'Core', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Bird Dog', 'CORE', 'NONE', 'Core', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Pallof Press', 'CORE', 'BANDS', 'Core', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Ab Wheel', 'CORE', 'NONE', 'Core', TRUE, FALSE, FALSE, 'ANY', 'ADVANCED'),
('Hollow Hold', 'CORE', 'NONE', 'Core', TRUE, FALSE, FALSE, 'ANY', 'INTERMEDIATE'),
('Sit-Up', 'CORE', 'NONE', 'Core', FALSE, FALSE, FALSE, 'ANY', 'BEGINNER'),
('Russian Twist', 'CORE', 'NONE', 'Obliques', FALSE, TRUE, FALSE, 'ANY', 'BEGINNER');

-- CARDIO MOVEMENTS (8 exercises)
INSERT INTO exercise_library (name, movement_pattern, equipment_required, primary_muscle, is_osteo_safe, is_pelvic_safe, menopause_priority, phase_recommendation, difficulty) VALUES
('Battle Ropes', 'CARDIO', 'NONE', 'Shoulders', TRUE, TRUE, FALSE, 'FOLLICULAR', 'INTERMEDIATE'),
('Sled Push', 'CARDIO', 'MACHINE', 'Legs', TRUE, TRUE, TRUE, 'ANY', 'INTERMEDIATE'),
('Rowing Machine', 'CARDIO', 'MACHINE', 'Back', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Assault Bike', 'CARDIO', 'MACHINE', 'Legs', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER'),
('Jump Rope', 'CARDIO', 'NONE', 'Calves', FALSE, FALSE, FALSE, 'FOLLICULAR', 'BEGINNER'),
('Heel Drops', 'CARDIO', 'NONE', 'Calves', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER'),
('Step-Ups', 'CARDIO', 'NONE', 'Quadriceps', TRUE, TRUE, TRUE, 'ANY', 'BEGINNER'),
('Walking Lunges', 'CARDIO', 'NONE', 'Quadriceps', TRUE, TRUE, FALSE, 'ANY', 'BEGINNER');

-- ============================================================================
-- TEST USER DATA (3 users)
-- ============================================================================

-- User 1: Sarah (Age 28, REPRODUCTIVE)
INSERT INTO user_profiles (id, email, date_of_birth, height_cm, weight_kg, activity_level, primary_goal, demographic) VALUES
('a1111111-1111-1111-1111-111111111111', 'sarah.28@test.com', '1998-03-15', 165.00, 62.00, 'MODERATE', 'STRENGTH', 'REPRODUCTIVE');

INSERT INTO health_metadata (user_id, pelvic_risk, bone_density_risk, cycle_type, last_period_date, avg_cycle_length) VALUES
('a1111111-1111-1111-1111-111111111111', FALSE, FALSE, 'REGULAR', '2026-01-05', 28);

-- User 2: Maria (Age 45, PERIMENOPAUSE)
INSERT INTO user_profiles (id, email, date_of_birth, height_cm, weight_kg, activity_level, primary_goal, demographic) VALUES
('b2222222-2222-2222-2222-222222222222', 'maria.45@test.com', '1981-07-22', 168.00, 71.00, 'LIGHT', 'BONE_HEALTH', 'PERIMENOPAUSE');

INSERT INTO health_metadata (user_id, pelvic_risk, bone_density_risk, cycle_type, last_period_date, avg_cycle_length) VALUES
('b2222222-2222-2222-2222-222222222222', TRUE, FALSE, 'PERIMENOPAUSE', '2025-12-10', 35);

-- User 3: Linda (Age 55, PERIMENOPAUSE)
INSERT INTO user_profiles (id, email, date_of_birth, height_cm, weight_kg, activity_level, primary_goal, demographic) VALUES
('c3333333-3333-3333-3333-333333333333', 'linda.55@test.com', '1971-01-08', 162.00, 68.00, 'MODERATE', 'BONE_HEALTH', 'PERIMENOPAUSE');

INSERT INTO health_metadata (user_id, pelvic_risk, bone_density_risk, cycle_type, last_period_date, avg_cycle_length) VALUES
('c3333333-3333-3333-3333-333333333333', FALSE, TRUE, 'POSTMENOPAUSE', NULL, 28);
