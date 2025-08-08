// Script to seed initial development progress data

import { createClient } from '@supabase/supabase-js';
import { getAllFeatures } from '../lib/utils/extract-features';
import type { Database } from '../lib/types/supabase';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function seedDevProgressData() {
  console.log('🌱 Starting development progress data seeding...');

  try {
    // 1. Clear existing data (optional - comment out if you want to preserve data)
    console.log('🧹 Clearing existing data...');
    await supabase.from('dev_progress_snapshots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('dev_milestones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('dev_session_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('dev_project_features').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Extract and insert features
    console.log('📋 Extracting features from sidebar navigation...');
    const features = getAllFeatures();
    console.log(`Found ${features.length} features to insert`);

    const insertedFeatures = [];
    for (const feature of features) {
      try {
        const { data, error } = await supabase
          .from('dev_project_features')
          .insert({
            feature_key: feature.feature_key,
            category: feature.category,
            title: feature.title,
            description: feature.description,
            objectives: feature.objectives,
            estimated_hours: feature.estimated_hours,
            priority: feature.priority,
            url_path: feature.url_path,
            icon_name: feature.icon_name,
            dependencies: feature.dependencies,
            status: feature.feature_key.includes('multi-tenant') ? 'planned' : 
                   feature.feature_key.includes('payroll') ? 'in-progress' :
                   feature.feature_key === 'dashboard' ? 'completed' : 'planned',
            completion_percentage: feature.feature_key === 'dashboard' ? 95 :
                                 feature.feature_key.includes('payroll') ? 65 :
                                 feature.feature_key.includes('cpq') ? 40 :
                                 feature.feature_key.includes('kwiver') ? 30 : 15
          })
          .select()
          .single();

        if (error) {
          console.error(`❌ Failed to insert feature ${feature.title}:`, error.message);
        } else {
          insertedFeatures.push(data);
          console.log(`✅ Inserted feature: ${feature.title}`);
        }
      } catch (err) {
        console.error(`❌ Error inserting feature ${feature.title}:`, err);
      }
    }

    console.log(`🎉 Successfully inserted ${insertedFeatures.length} features`);

    // 3. Create sample session logs
    console.log('📝 Creating sample session logs...');
    const sampleSessions = [
      {
        session_date: '2025-01-15',
        session_title: 'Payroll System Enhancement',
        summary_text: 'Worked on improving the payroll system with better WPS export functionality and enhanced payslip generation. Added new validation for employee data and improved the UI for payroll administrators.',
        features_worked_on: ['payroll-tools', 'payslips', 'employees'],
        ai_estimated_hours: 6.5,
        ai_confidence_score: 0.85,
        key_achievements: [
          'Implemented WPS export validation',
          'Enhanced payslip PDF generation',
          'Added employee data validation'
        ],
        blockers_identified: [
          'Need clarification on UAE labor law requirements'
        ]
      },
      {
        session_date: '2025-01-14',
        session_title: 'CPQ System Development',
        summary_text: 'Built the foundation for the Configure-Price-Quote system. Created the quote builder interface and integrated with the pricing engine. Still need to add approval workflows.',
        features_worked_on: ['kwiver-cpq'],
        ai_estimated_hours: 8.0,
        ai_confidence_score: 0.90,
        key_achievements: [
          'Created quote builder interface',
          'Integrated pricing engine',
          'Set up quote templates'
        ],
        blockers_identified: [
          'Approval workflow needs design review'
        ]
      },
      {
        session_date: '2025-01-13',
        session_title: 'Dashboard Improvements',
        summary_text: 'Polished the main dashboard with better KPI widgets and improved responsive design. Added real-time updates for key metrics.',
        features_worked_on: ['dashboard', 'reports'],
        ai_estimated_hours: 4.0,
        ai_confidence_score: 0.80,
        key_achievements: [
          'Enhanced KPI widgets',
          'Improved responsive design',
          'Added real-time updates'
        ],
        blockers_identified: []
      }
    ];

    for (const session of sampleSessions) {
      try {
        const { data, error } = await supabase
          .from('dev_session_logs')
          .insert(session)
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to insert session:', error.message);
        } else {
          console.log(`✅ Inserted session: ${session.session_title}`);
        }
      } catch (err) {
        console.error('❌ Error inserting session:', err);
      }
    }

    // 4. Create progress snapshots
    console.log('📊 Creating progress snapshots...');
    for (const feature of insertedFeatures) {
      try {
        const { error } = await supabase
          .from('dev_progress_snapshots')
          .insert({
            feature_id: feature.id,
            snapshot_date: '2025-01-15',
            completion_percentage: feature.completion_percentage,
            calculation_method: 'manual',
            contributing_factors: {
              initial_setup: true,
              based_on_current_state: true
            },
            notes: 'Initial progress snapshot based on current implementation state'
          });

        if (error) {
          console.error(`❌ Failed to create snapshot for ${feature.title}:`, error.message);
        } else {
          console.log(`✅ Created progress snapshot for: ${feature.title}`);
        }
      } catch (err) {
        console.error(`❌ Error creating snapshot for ${feature.title}:`, err);
      }
    }

    // 5. Create sample milestones
    console.log('🎯 Creating sample milestones...');
    const payrollFeature = insertedFeatures.find(f => f.feature_key === 'payroll-tools');
    const cpqFeature = insertedFeatures.find(f => f.feature_key === 'kwiver-cpq');

    if (payrollFeature) {
      const milestones = [
        {
          feature_id: payrollFeature.id,
          milestone_name: 'WPS Export Implementation',
          description: 'Complete UAE WPS file format export functionality',
          target_date: '2025-02-01',
          completion_criteria: [
            'WPS file format validation',
            'Bank integration testing',
            'Error handling implementation'
          ],
          is_completed: true,
          completed_at: new Date().toISOString()
        },
        {
          feature_id: payrollFeature.id,
          milestone_name: 'EOSB Calculation Engine',
          description: 'Implement end-of-service benefits calculation',
          target_date: '2025-02-15',
          completion_criteria: [
            'EOSB formula implementation',
            'Multi-year calculation support',
            'Integration with payroll runs'
          ],
          is_completed: false
        }
      ];

      for (const milestone of milestones) {
        try {
          const { error } = await supabase
            .from('dev_milestones')
            .insert(milestone);

          if (error) {
            console.error('❌ Failed to insert milestone:', error.message);
          } else {
            console.log(`✅ Created milestone: ${milestone.milestone_name}`);
          }
        } catch (err) {
          console.error('❌ Error inserting milestone:', err);
        }
      }
    }

    console.log('🎉 Development progress data seeding completed successfully!');
    console.log(`📊 Summary:
      - Features: ${insertedFeatures.length}
      - Sessions: ${sampleSessions.length}
      - Snapshots: ${insertedFeatures.length}
      - Milestones: 2
    `);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDevProgressData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDevProgressData };