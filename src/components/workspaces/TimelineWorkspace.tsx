import React from 'react';
import { WORK_EXPERIENCE, EDUCATION, CERTIFICATIONS } from '../../data/pratheeshData';
import { sound } from '../../utils/soundEffects';
import { Milestone, Briefcase, GraduationCap, Award, Calendar, MapPin } from 'lucide-react';

export const TimelineWorkspace: React.FC = () => {
  const timelineEvents = [
    {
      year: "March 2026",
      title: "Google Skillshop Fundamentals of Digital Marketing",
      subtitle: "Google Digital Garage • Certificate ID: 453421024",
      type: "certification",
      icon: Award,
      color: "#EC4899",
      details: "Completed 26 modules covering SEO, SEM, Social Media Marketing, Content Strategy, and Google Analytics."
    },
    {
      year: "2024",
      title: "Bachelor of Computer Application (BCA)",
      subtitle: "Pope John Paul II College of Education • Puducherry",
      type: "education",
      icon: GraduationCap,
      color: "#00F2FE",
      details: "Graduated with computer applications specialization covering Web Technologies, Data Structures, DB Systems, and Software Architecture."
    },
    {
      year: "Mar 2019 – Mar 2020",
      title: "Store Department Associate (Supply Chain)",
      subtitle: "Nexteer Automotive Production Company",
      type: "experience",
      icon: Briefcase,
      color: "#10B981",
      details: "Managed industrial inventory using QAD ERP enterprise software, maintaining stock levels, material issue requests, and factory floor coordination."
    },
    {
      year: "March 2020",
      title: "Honours Diploma in Computer Application (HDCA)",
      subtitle: "CSC Computer Software College • Grade A (Excellent)",
      type: "certification",
      icon: Award,
      color: "#A855F7",
      details: "Mastered MS Windows, Office, SQL Server, Visual Basic, HTML/ASP/XML, Tally ERP 9, and hardware."
    },
    {
      year: "2019",
      title: "Higher Secondary Certificate (HSC)",
      subtitle: "Fatima Matriculation Higher Secondary School",
      type: "education",
      icon: GraduationCap,
      color: "#3B82F6",
      details: "Mathematics and Science foundation."
    },
    {
      year: "2017",
      title: "Secondary School Leaving Certificate (SSLC)",
      subtitle: "S.D. Eaden Matriculation Higher Secondary School",
      type: "education",
      icon: GraduationCap,
      color: "#64748B",
      details: "General secondary education."
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <Milestone size={28} color="#6366F1" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>CAREER & ACADEMIC TIMELINE</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Chronological journey spanning Education, Industrial Experience, and Certifications
            </p>
          </div>
        </div>
      </div>

      {/* Spatial Timeline List */}
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {/* Central Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '11px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(to bottom, #00F2FE 0%, #7F00FF 50%, #10B981 100%)'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {timelineEvents.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
                {/* Node Marker */}
                <div style={{
                  position: 'absolute',
                  left: '-43px',
                  top: '24px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#07090E',
                  border: `3px solid ${item.color}`,
                  boxShadow: `0 0 12px ${item.color}`
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '6px', borderRadius: '8px', background: `${item.color}20` }}>
                      <IconComp size={18} color={item.color} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit' }}>
                      {item.title}
                    </h3>
                  </div>

                  <span className="badge" style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
                    <Calendar size={12} style={{ marginRight: '4px' }} /> {item.year}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', color: item.color, fontWeight: 600, marginBottom: '10px' }}>
                  {item.subtitle}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.6' }}>
                  {item.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
