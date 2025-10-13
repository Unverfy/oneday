import React from 'react';
import { useApp } from '../context/AppContext';
import InputSection from './InputSection';
import PlanSection from './PlanSection';

const CardLayout: React.FC = () => {
  const { generatedPlan, isLoading, error } = useApp();

  return (
    <div className="card-layout">
      <div className="main-content">
        <div className="content-cards">
          {/* Input Card */}
          <div className="content-card input-card">
            <div className="card-header">
              <h3>Створити план дня</h3>
              <p>Опиши свої побажання або вибери готові опції</p>
            </div>
            <div className="card-content">
              <InputSection />
            </div>
          </div>

          {/* Plan Card */}
          <div className="content-card plan-card">
            <div className="card-header">
              <h3>Твій план дня</h3>
              <p>Персоналізований розклад активностей</p>
            </div>
            <div className="card-content">
              <PlanSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLayout;
